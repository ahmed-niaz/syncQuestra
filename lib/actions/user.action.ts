"use server";

import { ActionResponse, ErrorResponse, PaginationParams, UserType } from "@/types/global";
import serverAction from "../handlers/server-action";
import { PaginationSchema } from "../zod/validation";
import handleError from "../handlers/error";
import { QueryFilter } from "mongoose";
import { User } from "@/database";

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
