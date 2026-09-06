"use server";

import { ActionResponse, ErrorResponse, PaginationParams, UserType } from "@/types/global";
import serverAction from "../handlers/server-action";
import { GetUserQuestionsSchema, GetUserSchema, PaginationSchema } from "../zod/validation";
import handleError from "../handlers/error";
import { QueryFilter } from "mongoose";
import { Answer, Question, User } from "@/database";
import { Question as QuestionType } from "@/types/global";
import { GetUserParams, GetUserQuestionsParams } from "@/types/action";

export async function getUsers(
  params: PaginationParams
): Promise<ActionResponse<{ users: UserType[]; isNext: boolean }>> {
  const validationResult = await serverAction({
    params,
    schema: PaginationSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 1, query, filter } = validationResult.params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  const filterQuery: QueryFilter<typeof User> = {};

  if (query) {
    filterQuery.$or = [{ name: { $regex: query, $options: "i" } }, { email: { $regex: query, $options: "i" } }];
  }

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "popular":
      sortCriteria = { reputation: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalUsers = await User.countDocuments(filterQuery);

    const users = await User.find(filterQuery).sort(sortCriteria).skip(skip).limit(limit);

    const isNext = totalUsers > skip + users.length;

    return { success: true, data: { users: JSON.parse(JSON.stringify(users)), isNext } };
  } catch (e) {
    return handleError(e) as ErrorResponse;
  }
}

export async function getUser(params: GetUserParams): Promise<
  ActionResponse<{
    user: UserType;
    totalQuestions: number;
    totalAnswers: number;
  }>
> {
  const validationResult = await serverAction({
    params,
    schema: GetUserSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { userId } = validationResult.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }
    const totalQuestions = await Question.countDocuments({ author: userId });
    const totalAnswers = await Answer.countDocuments({ author: userId });

    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
        totalQuestions,
        totalAnswers,
      },
    };
  } catch (e) {
    return handleError(e) as ErrorResponse;
  }
}

export async function getUserQuestions(params: GetUserQuestionsParams): Promise<
  ActionResponse<{
    questions: QuestionType[];
    isNext: boolean;
  }>
> {
  const validationResult = await serverAction({
    params,
    schema: GetUserQuestionsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, userId } = params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  try {
    const totalQuestions = await Question.countDocuments({ author: userId });

    const questions = await Question.find({ author: userId })
      .populate("tags", "name")
      .populate("author", "name image")
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
