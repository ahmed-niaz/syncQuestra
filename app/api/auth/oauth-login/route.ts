// if a user uses GitHub oAuth, we'll create an account contianing GitHub oAuth info and then create a user with GitHub name,username & image.
// if a user uses Google oAuth, we'll create an account contianing Google oAuth info and then create a user with Google name,username & image.
// if a user uses Github oAuth first or google oAuth frist and then other later we'll create that oAuth account and update user info to show the
// latest oAuth name and image.

import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import connectToDatabase from "@/lib/mongoose";
import { LoginOAuthSchema } from "@/lib/zod/validation";
import * as z from "zod";
import slugify from "slugify";

import { APIErrorResponse } from "@/types/global";
import mongoose from "mongoose";
import { Account, User } from "@/database";
import { NextResponse } from "next/server";

// todo: create an account using oAuth provider.
export async function POST(request: Request) {
  const { provider, providerAccountId, user } = await request.json();

  await connectToDatabase();

  // implemented transaction (or we can call it atomic fn)
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const validatedData = LoginOAuthSchema.safeParse({ provider, providerAccountId, user });

    if (!validatedData.success) {
      throw new ValidationError(z.flattenError(validatedData.error).fieldErrors as Record<string, string[]>);
    }

    const { name, username, email, image } = user;

    // using slugify for the valid username
    const modifiedUserName = slugify(username, {
      lower: false,
      strict: false,

      trim: true,
    });

    // TODO : user part

    let existingUser = await User.findOne({ email }).session(session);
    if (!existingUser) {
      [existingUser] = await User.create([{ name, username: modifiedUserName, email, image }], { session });
    } else {
      const updatedData: { name?: string; image?: string } = {};
      if (existingUser.name !== name) updatedData.name = name;
      if (existingUser.image !== image) updatedData.image = image;

      if (Object.keys(updatedData).length > 0) {
        await User.updateOne(
          {
            _id: existingUser.id,
          },
          {
            $set: updatedData,
          }
        ).session(session);
      }
    }

    // TODO: account part.

    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(session);

    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser._id,
            name,
            image,
            provider,
            providerAccountId,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    await session.abortTransaction();
    return handleError(e, "api") as APIErrorResponse;
  } finally {
    session.endSession();
  }
}

// what is atomic fn?
