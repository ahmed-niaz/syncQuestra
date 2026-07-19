"use server";

import { CreateAnswerSchema, GetAnswersSchema } from "../zod/validation";

import serverAction from "../handlers/server-action";
import handleError from "../handlers/error";
import { ActionResponse, AnswerType, ErrorResponse } from "@/types/global";
import mongoose from "mongoose";
import { Answer, Question } from "@/database";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";
import { IAnswerDoc } from "@/database/answer.model";
import { CreateAnswerParams, GetAnswerParams } from "@/types/action";

export async function createAnswer(params: CreateAnswerParams): Promise<ActionResponse<IAnswerDoc>> {
  const validateResult = await serverAction({
    params,
    schema: CreateAnswerSchema,
    authorize: true,
  });

  if (validateResult instanceof Error) {
    return handleError(validateResult) as ErrorResponse;
  }

  const { content, questionId } = validateResult.params;
  const userId = validateResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    const [newAnswer] = await Answer.create([{ author: userId, question: questionId, content }], { session });

    if (!newAnswer) {
      throw new Error("Failed to create answer");
    }

    question.answers += 1;
    await question.save({ session });

    await session.commitTransaction();
    revalidatePath(ROUTES.QUESTION(questionId));

    return { success: true, data: JSON.parse(JSON.stringify(newAnswer)) };
  } catch (e) {
    await session.abortTransaction();
    return handleError(e) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getAnswers(params: GetAnswerParams): Promise<
  ActionResponse<{
    answers: AnswerType[];
    isNext: boolean;
    totalAnswers: number;
  }>
> {
  const validateResult = await serverAction({
    params,
    schema: GetAnswersSchema,
  });

  if (validateResult instanceof Error) {
    return handleError(validateResult) as ErrorResponse;
  }

  const { questionId, page = 1, pageSize = 10, filter } = validateResult.params;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = pageSize;

  let sortCriteria = {};

  switch (filter) {
    case "latest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "most_upvoted":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalAnswers = await Answer.countDocuments({ question: questionId });

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id name image")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalAnswers > skip + answers.length;

    return {
      success: true,
      data: { answers: JSON.parse(JSON.stringify(answers)), isNext, totalAnswers },
    };
  } catch (e) {
    return handleError(e) as ErrorResponse;
  }
}
