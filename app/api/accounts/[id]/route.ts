import { Account } from "@/database";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import connectToDatabase from "@/lib/mongoose";
import { AccountSchema } from "@/lib/zod/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";
import * as z from "zod";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) throw new NotFoundError("Account");

  try {
    await connectToDatabase();
    const account = await Account.findById(id);

    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) throw new NotFoundError("Account");

  try {
    await connectToDatabase();
    const account = await Account.findByIdAndDelete(id);

    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) throw new NotFoundError("Account");

  try {
    await connectToDatabase();

    const { body } = await request.json();

    const accountValidation = AccountSchema.partial().safeParse(body);

    if (!accountValidation.success) {
      throw new ValidationError(z.flattenError(accountValidation.error).fieldErrors as Record<string, string[]>);
    }

    const updatedAccount = await Account.findByIdAndUpdate(id, accountValidation, { new: true });

    if (!updatedAccount) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: updatedAccount }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
