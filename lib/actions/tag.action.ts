"use server";

import { ActionResponse, ErrorResponse, PaginationParams, Tags as TagType } from "@/types/global";
import serverAction from "../handlers/server-action";
import { QueryFilter } from "mongoose";
import { PaginationSchema } from "../zod/validation";
import handleError from "../handlers/error";
import { Tag } from "@/database";

export const getTags = async (
  params: PaginationParams
): Promise<ActionResponse<{ tags: TagType[]; isNext: boolean }>> => {
  const validateResult = await serverAction({
    params,
    schema: PaginationSchema,
  });

  if (validateResult instanceof Error) {
    return handleError(validateResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = Number(page - 1) * pageSize;
  const limit = Number(pageSize);

  const queryFilter: QueryFilter<typeof Tag> = {};

  if (query) {
    queryFilter.$or = [
      {
        name: { $regex: query, $options: "i" },
      },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "popular":
      sortCriteria = { questions: -1 };
      break;
    case "recent":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "name":
      sortCriteria = { name: 1 };
      break;
    default:
      sortCriteria = { questions: -1 };
      break;
  }

  try {
    const totalTags = await Tag.countDocuments(queryFilter);

    const tags = await Tag.find(queryFilter).sort(sortCriteria).skip(skip).limit(limit);
    const isNext = totalTags > page * pageSize;

    return {
      success: true,
      data: { tags: JSON.parse(JSON.stringify(tags)), isNext },
    };
  } catch (e) {
    return handleError(e) as ErrorResponse;
  }
};
