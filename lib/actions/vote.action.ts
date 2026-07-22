"use server";

import { CreateVoteParams, HasVotedParams, HasVotedResponse, UpdateVoteCountParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";
import serverAction from "../handlers/server-action";
import { CreateVotesSchema, HasVotedSchema, UpdateVoteCountSchema } from "../zod/validation";
import handleError from "../handlers/error";
import mongoose, { ClientSession } from "mongoose";
import { Answer, Question, Vote } from "@/database";
import { TARGET_TYPE, VOTE_TYPE } from "@/constants/vote";
import { ROUTES } from "@/constants/routes";
import { revalidatePath } from "next/cache";

export async function updateVoteCount(params: UpdateVoteCountParams, session?: ClientSession): Promise<ActionResponse> {
  const validationResult = await serverAction({
    params,
    schema: UpdateVoteCountSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { targetId, targetType, voteType, change } = validationResult.params;

  const Model = targetType === TARGET_TYPE.QUESTION ? Question : Answer;
  const voteFieldType = voteType === VOTE_TYPE.UPVOTE ? VOTE_TYPE.UPVOTE : VOTE_TYPE.DOWNVOTE;

  try {
    // super modular
    const result = await Model.findByIdAndUpdate(
      targetId,
      {
        $inc: {
          [voteFieldType]: change,
        },
      },
      {
        new: true,
        session,
      }
    );

    if (!result) {
      return handleError(new Error("failed to update vote count")) as ErrorResponse;
    }

    return { success: true };
  } catch (e) {
    return handleError(e) as ErrorResponse;
  }
}

export async function createVotes(params: CreateVoteParams): Promise<ActionResponse> {
  const validationResult = await serverAction({
    params,
    schema: CreateVotesSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { targetId, targetType, voteType } = validationResult.params;

  const userId = validationResult.session?.user?.id;

  if (!userId) return handleError(new Error("Unauthorized")) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingVotes = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    }).session(session);

    if (existingVotes) {
      if (existingVotes.voteType === voteType) {
        // todo: if the user already voted with the same voteType, then remove the vote
        await Vote.deleteOne({
          _id: existingVotes._id,
        }).session(session);
        await updateVoteCount({ targetId, targetType, voteType, change: -1 }, session);
      } else {
        // todo: if use already voted with a different voteType, update the vote.
        await Vote.findByIdAndUpdate(
          existingVotes._id,
          { voteType },
          {
            new: true,
            session,
          }
        );
        await updateVoteCount(
          {
            targetId,
            targetType,
            voteType: existingVotes.voteType,
            change: -1,
          },
          session
        );

        await updateVoteCount(
          {
            targetId,
            targetType,
            voteType,
            change: 1,
          },
          session
        );
      }
    } else {
      // todo: if user never voted, then create a vote
      await Vote.create(
        [
          {
            author: userId,
            actionId: targetId,
            actionType: targetType,
            voteType,
          },
        ],
        { session }
      );
      await updateVoteCount({ targetId, targetType, voteType, change: 1 }, session);
    }

    await session.commitTransaction();
    session.endSession();

    revalidatePath(ROUTES.QUESTION(targetId));
    return { success: true };
  } catch (e) {
    await session.abortTransaction();
    return handleError(e) as ErrorResponse;
  }
}

export async function hasVoted(params: HasVotedParams): Promise<ActionResponse<HasVotedResponse>> {
  const validationResult = await serverAction({
    params,
    schema: HasVotedSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { targetId, targetType } = validationResult.params;
  const userId = validationResult.session?.user?.id;

  if (!userId) {
    return handleError(new Error("Unauthorized")) as ErrorResponse;
  }

  try {
    const vote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    });

    if (!vote) {
      return {
        success: true,
        data: { hasUpvoted: false, hasDownvoted: false },
      };
    }

    return {
      success: true,
      data: {
        hasUpvoted: vote.voteType === VOTE_TYPE.UPVOTE,
        hasDownvoted: vote.voteType === VOTE_TYPE.DOWNVOTE,
      },
    };
  } catch (e) {
    return handleError(e) as ErrorResponse;
  }
}
