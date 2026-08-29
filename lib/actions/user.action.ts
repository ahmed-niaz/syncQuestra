"use server"

import { ActionResponse, ErrorResponse, PaginationParams, UserType } from "@/types/global"
import serverAction from "../handlers/server-action"
import { PaginationSchema } from "../zod/validation"
import handleError from "../handlers/error"



export async function getUsers(params: PaginationParams): ActionResponse<{ users: UserType[], isNext: boolean }> {

  const validationResult = await serverAction({
    params,
    schema: PaginationSchema
  })

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 1, query, filter } = validationResult.params;


}