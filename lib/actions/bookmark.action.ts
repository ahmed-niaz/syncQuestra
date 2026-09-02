"use server";

import { BookmarkParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";
import serverAction from "../handlers/server-action";
import { BookmarkSchema } from "../zod/validation";
import handleError from "../handlers/error";
import { Collection, Question } from "@/database";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";

export async function toggleSaveBookMark(params: BookmarkParams): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await serverAction({
    params,
    schema: BookmarkSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      throw new Error("Question is not found");
    }

    const bookmark = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    if (bookmark) {
      await Collection.findByIdAndDelete(bookmark._id);
      revalidatePath(ROUTES.QUESTION(questionId));
      return { success: true, data: { saved: false } };
    }

    await Collection.create({
      question: questionId,
      author: userId,
    });

    revalidatePath(ROUTES.QUESTION(questionId));
    return { success: true, data: { saved: true } };
  } catch (e) {
    return handleError(e) as ErrorResponse;
  }
}

export async function hasSaveBookmark(params: BookmarkParams): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await serverAction({
    params,
    schema: BookmarkSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const bookmark = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    return {
      success: true,
      data: {
        saved: !!bookmark,
      },
    };
  } catch (e) {
    return handleError(e) as ErrorResponse;
  }
}
