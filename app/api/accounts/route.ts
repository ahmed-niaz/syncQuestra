import { Account } from "@/database";
import handleError from "@/lib/handlers/error";
import { ForbiddenError } from "@/lib/http-errors";
import connectToDatabase from "@/lib/mongoose";
import { AccountSchema } from "@/lib/zod/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const accounts = await Account.find();

    return NextResponse.json({ success: true, data: accounts }, { status: 200 });
  } catch (e) {
    return handleError(e, "api") as APIErrorResponse;
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const accountValidation = AccountSchema.parse(body);

    const isUserExists = await Account.findOne({
      provider: accountValidation.provider,
      providerAccountId: accountValidation.providerAccountId,
    });

    if (isUserExists) throw new ForbiddenError("an account with provider already exits");

    const newAccount = await Account.create(accountValidation);

    return NextResponse.json({ success: true, data: newAccount }, { status: 201 });
  } catch (e) {
    return handleError(e, "api") as APIErrorResponse;
  }
}
