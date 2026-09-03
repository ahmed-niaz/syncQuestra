"use server";

import { BookmarkParams } from "@/types/action";
import { ActionResponse, CollectionType, ErrorResponse, PaginationParams } from "@/types/global";
import serverAction from "../handlers/server-action";
import { BookmarkSchema, PaginationSchema } from "../zod/validation";
import handleError from "../handlers/error";
import { Collection, Question } from "@/database";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";
import mongoose, { PipelineStage, QueryFilter } from "mongoose";

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

export async function getSaveBookMark(
  params: PaginationParams
): Promise<ActionResponse<{ collection: CollectionType[]; isNext: boolean }>> {
  const validationResult = await serverAction({
    params,
    schema: PaginationSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const userId = validationResult.session?.user?.id;
  if (!userId) {
    return handleError(new Error("Unauthorized")) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const queryFilter: QueryFilter<typeof Collection> = {
    author: userId,
  };

  if (query) {
    queryFilter.$or = [{ title: { $regex: new RegExp(query, "i") } }, { content: { $regex: new RegExp(query, "i") } }];
  }

  const sortOpitons: Record<string, Record<string, 1 | -1>> = {
    mostRecent: { "question.createdAt": -1 },
    oldest: { "question.createdAt": 1 },
    mostVoted: { "question.upvotes": -1 },
    leastVoted: { "question.downvotes": -1 },
    mostViewed: { "question.views": -1 },
    mostAnswered: { "question.answers": -1 },
  };

  const sortCriteria = sortOpitons[filter as keyof typeof sortOpitons] || { "question.createdAt": -1 };
  // const questionQuery = query ? {title:{$regex:query,$options:"i"}} : {};
  try {
    // monogdb aggregation or call it pipeline
    const pipeline: PipelineStage[] = [
      {
        $match: { author: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      {
        $unwind: "$question",
      },
      {
        $lookup: {
          from: "users",
          localField: "question.author",
          foreignField: "_id",
          as: "question.author",
        },
      },
      {
        $unwind: "$question.author",
      },
      {
        $lookup: {
          from: "tags",
          localField: "question.tags",
          foreignField: "_id",
          as: "question.tags",
        },
      },
      // {
      //   $unwind: "$question.tags"
      // }
    ];

    if (query) {
      pipeline.push({
        $match: {
          $or: [
            { "question.title": { $regex: query, $options: "i" } },
            { "question.content": { $regex: query, $options: "i" } },
          ],
        },
      });
    }

    const [totalCount] = await Collection.aggregate([...pipeline, { $count: "count" }]);

    pipeline.push({ $sort: sortCriteria }, { $skip: skip }, { $limit: limit });
    pipeline.push({ $project: { question: 1, author: 1 } });

    const bookmarks = await Collection.aggregate(pipeline);
    const isNext = (totalCount?.count || 0) > skip + limit;

    return {
      success: true,
      data: {
        collection: JSON.parse(JSON.stringify(bookmarks)),
        isNext,
      },
    };
  } catch (e) {
    return handleError(e) as ErrorResponse;
  }
}
