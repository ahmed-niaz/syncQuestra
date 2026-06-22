import { User } from "@/database";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import connectToDatabase from "@/lib/mongoose";
import { UserSchema } from "@/lib/zod/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";
import * as z from "zod";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // client side validation
    const userValidation = UserSchema.safeParse(body);
    if (!userValidation.success) {
      throw new ValidationError(z.flattenError(userValidation.error).fieldErrors);
    }

    const { email, username } = userValidation.data;

    const isUserExists = await User.findOne({ email });
    if (isUserExists) throw new Error("user is alrady exists");

    const isUserNameExists = await User.findOne({ username });
    if (isUserNameExists) throw new Error("username is alrady exists");

    const newUser = await User.create(userValidation.data);

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (e) {
    return handleError(e, "api") as APIErrorResponse;
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find();

    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (e) {
    return handleError(e, "api") as APIErrorResponse;
  }
}
