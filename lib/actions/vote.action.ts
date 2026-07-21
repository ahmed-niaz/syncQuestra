"use server";

import { CreateVoteParams, UpdateVoteCountParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";
import serverAction from "../handlers/server-action";
import { CreateVotesSchema, UpdateVoteCountSchema } from "../zod/validation";
import handleError from "../handlers/error";
import mongoose, { ClientSession } from "mongoose";
import { Answer, Question, Vote } from "@/database";

export async function UpdateVoteCount(params: UpdateVoteCountParams, session?: ClientSession): Promise<ActionResponse> {
  const validationResult = await serverAction({
    params,
    schema: UpdateVoteCountSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { targetId, targetType, voteType, change } = validationResult.params;

  const Model = targetType === "question" ? Question : Answer;
  const voteFieldType = voteType === "upvotes" ? "upvotes" : "downvotes";

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

export async function CreateVotes(params: CreateVoteParams): Promise<ActionResponse> {
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

  if (!userId) handleError(new Error("Unauthorized")) as ErrorResponse;

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
        await UpdateVoteCount({ targetId, targetType, voteType, change: -1 }, session);
      } else {
        // todo: if use already voted with a different voteType, update the vote.
        await Vote.findByIdAndUpdate(existingVotes._id, { voteType }, { new: true, session });
        await UpdateVoteCount({ targetId, targetType, voteType, change: 1 }, session);
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
      await UpdateVoteCount({ targetId, targetType, voteType, change: 1 }, session);
    }

    await session.commitTransaction();
    return { success: true };
  } catch (e) {
    await session.abortTransaction();
    return handleError(e) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
