import { User } from "@/database";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import connectToDatabase from "@/lib/mongoose";
import { UserSchema } from "@/lib/zod/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";
import * as z from "zod";

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    const userValidation = UserSchema.partial().safeParse({ email });
    if (!userValidation.success) {
      throw new ValidationError(z.flattenError(userValidation.error).fieldErrors);
    }

    await connectToDatabase();

    const userExists = await User.findOne({ email });
    if (!userExists) {
      throw new NotFoundError("User");
    }

    return NextResponse.json({ success: true, data: userExists }, { status: 200 });
  } catch (e) {
    return handleError(e, "api") as APIErrorResponse;
  }
}
