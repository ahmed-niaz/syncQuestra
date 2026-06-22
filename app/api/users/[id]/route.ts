import { User } from "@/database";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import connectToDatabase from "@/lib/mongoose";
import { UserSchema } from "@/lib/zod/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";
import * as z from "zod";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError("User");
  }

  try {
    await connectToDatabase();

    const user = await User.findById(id);

    if (!user) {
      throw new NotFoundError("User");
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (e) {
    return handleError(e, "api") as APIErrorResponse;
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    throw new NotFoundError("User");
  }

  try {
    await connectToDatabase();

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundError("User");
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (e) {
    return handleError(e, "api") as APIErrorResponse;
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      throw new NotFoundError("User");
    }

    await connectToDatabase();
    const body = await req.json();

    const userValidation = UserSchema.partial().safeParse(body);

    if (!userValidation.success) {
      throw new ValidationError(z.flattenError(userValidation.error).fieldErrors as Record<string, string[]>);
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      throw new NotFoundError("User");
    }

    const updatedUser = await User.findByIdAndUpdate(id, userValidation.data, {
      new: true,
    });

    return NextResponse.json({ success: true, data: updatedUser }, { status: 200 });
  } catch (e) {
    return handleError(e, "api") as APIErrorResponse;
  }
}
