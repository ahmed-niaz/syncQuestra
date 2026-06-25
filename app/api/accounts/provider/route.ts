import { Account } from "@/database";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import connectToDatabase from "@/lib/mongoose";
import { AccountSchema } from "@/lib/zod/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";
import * as z from "zod";

export async function POST(request: Request) {
  const { providerAccountId } = await request.json();

  try {
    const accountValidation = AccountSchema.partial().safeParse({ providerAccountId });
    if (!accountValidation.success) {
      throw new ValidationError(z.flattenError(accountValidation.error).fieldErrors);
    }

    await connectToDatabase();

    const accountExists = await Account.findOne({ providerAccountId });
    if (!accountExists) {
      throw new NotFoundError("Account");
    }

    return NextResponse.json({ success: true, data: accountExists }, { status: 200 });
  } catch (e) {
    return handleError(e, "api") as APIErrorResponse;
  }
}
