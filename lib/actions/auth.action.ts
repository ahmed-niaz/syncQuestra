"use server";

import { ActionResponse, ErrorResponse } from "@/types/global";
import handleError from "../handlers/error";
import serverAction from "../handlers/server-action";
import { LoginSchema, RegisterSchema } from "../zod/validation";
import { AuthCredintials } from "@/types/action";
import mongoose from "mongoose";
import { Account, User } from "@/database";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { NotFoundError } from "../http-errors";

export async function registerWithCredintials(params: AuthCredintials): Promise<ActionResponse> {
  const validateRequest = await serverAction({ params, schema: RegisterSchema });

  if (validateRequest instanceof Error) {
    return handleError(validateRequest) as ErrorResponse;
  }

  const { name, username, email, password } = validateRequest.params;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingUser = await User.findOne({ email }).session(session);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const isUsernameTaken = await User.findOne({ username }).session(session);

    if (isUsernameTaken) {
      throw new Error("Username is already taken");
    }

    // hashed password
    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await User.create([{ username, name, email }], { session });

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    try {
      await signIn("credentials", { email, password, redirect: false });
    } catch (signInError) {
      // signIn may throw (e.g. NEXT_REDIRECT), but the user is already created
      // Only re-throw if it's not a redirect (Next.js signIn throws on redirect)
      if (signInError instanceof Error && signInError.message === "NEXT_REDIRECT") {
        throw signInError;
      }
      // Log but don't fail — registration itself succeeded
    }

    return { success: true };
  } catch (e) {
    await session.abortTransaction();
    return handleError(e) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function loginWithCredintials(
  params: Pick<AuthCredintials, "email" | "password">
): Promise<ActionResponse> {
  const validateRequest = await serverAction({ params, schema: LoginSchema });

  if (validateRequest instanceof Error) {
    return handleError(validateRequest) as ErrorResponse;
  }

  const { email, password } = validateRequest.params;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new NotFoundError("User");
    }
    const existingAccount = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    });

    if (!existingAccount) throw new NotFoundError("Account");

    const isPasswordValid = await bcrypt.compare(password, existingAccount.password!);

    if (!isPasswordValid) throw new Error("password not matched");

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (e) {
    return handleError(e) as ErrorResponse;
  }
}
