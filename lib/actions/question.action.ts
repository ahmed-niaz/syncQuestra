"use server";

import { CreateQuestionParams } from "@/types/action";
import serverAction from "../handlers/server-action";
import { AskQuestionSchema } from "../zod/validation";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import { Question as QuestionModel, Tag, TagQuestion } from "@/database";
import { ActionResponse, ErrorResponse, Question as QuestionType } from "@/types/global";

export async function createQuestion(params: CreateQuestionParams): Promise<ActionResponse<QuestionType>> {
  const validateResult = await serverAction({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validateResult instanceof Error) {
    return handleError(validateResult) as ErrorResponse;
  }

  const { title, content, tags } = validateResult.params;
  const userId = validateResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // create question
    const [question] = await QuestionModel.create([{ title, content, author: userId }], { session });

    if (!question) {
      throw new Error("failed to create question");
    }

    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    for (const tg of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tg}$`, "i") } },
        { $setOnInsert: { name: tg }, $inc: { questions: 1 } },
        { upsert: true, new: true, session }
      );

      if (!existingTag) {
        throw new Error(`failed to create tag ${tg}`);
      }

      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    // update the question with tags id
    await QuestionModel.findByIdAndUpdate(question._id, { $push: { tags: { $each: tagIds } } }, { session });

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (e) {
    await session.abortTransaction();
    return handleError(e) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
