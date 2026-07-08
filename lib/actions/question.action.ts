"use server";

import { CreateQuestionParams, EditQuestionParams, GetQuestionParams } from "@/types/action";
import serverAction from "../handlers/server-action";
import { AskQuestionSchema, EditQuestionSchema, GetQuestionSchema } from "../zod/validation";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import { Question, Question as QuestionModel, Tag, TagQuestion } from "@/database";
import { ActionResponse, ErrorResponse, Question as QuestionType } from "@/types/global";
import { ITagDoc } from "@/database/tag.model";

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

export async function editQuestion(params: EditQuestionParams): Promise<ActionResponse<QuestionType>> {
  const validateResult = await serverAction({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });

  if (validateResult instanceof Error) {
    return handleError(validateResult) as ErrorResponse;
  }

  const { title, content, tags, questionId } = validateResult.params;

  const userId = validateResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // access to the question
    const question = await QuestionModel.findById(questionId).populate("tags");

    if (question.author.toString() !== userId) {
      throw new Error("Unauthorized");
    }

    if (title !== question.title || content !== question.content) {
      question.title = title;
      question.content = content;

      await question.save({ session });
    }

    const addTags = tags.filter((tg) => !question.tags.includes(tg.toLowerCase()));

    const removeTags = question.tags.filter((tg: ITagDoc) => !tags.includes(tg.name.toLowerCase()));

    const newTagDocuments = [];

    if (addTags.length > 0) {
      for (const tg of addTags) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${tg}$`, "i") } },
          { $setOnInsert: { name: tg }, $inc: { questions: 1 } },
          { upsert: true, new: true, session }
        );

        if (!existingTag) {
          throw new Error(`failed to create tag ${tg}`);
        }

        if (existingTag) {
          newTagDocuments.push({
            tag: existingTag._id,
            question: questionId,
          });
        }

        question.tags.push(existingTag._id);
      }
    }

    if (removeTags.length > 0) {
      const removeTagIds = removeTags.map((tg: ITagDoc) => tg._id);

      await Tag.updateMany({ _id: { $in: removeTagIds } }, { $inc: { questions: -1 } }, { session });

      await TagQuestion.deleteMany(
        {
          tag: { $in: removeTagIds },
          question: questionId,
        },
        { session }
      );

      question.tags = question.tags.filter((tgId: mongoose.Types.ObjectId) => !removeTagIds.includes(tgId));
    }

    if (newTagDocuments.length > 0) {
      await TagQuestion.insertMany(newTagDocuments, { session });
    }

    await question.save({ session });
    await session.commitTransaction();
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (e) {
    await session.abortTransaction();
    return handleError(e) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function getQuestion(params: GetQuestionParams) {
  const validateResult = await serverAction({
    params,
    schema: GetQuestionSchema,
    authorize: false,
  });

  if (validateResult instanceof Error) {
    return handleError(validateResult) as ErrorResponse;
  }

  const { questionId } = validateResult.params;

  try {
    const quesion = await Question.findById(questionId).populate("tags");

    if (!quesion) {
      throw new Error("Question not found");
    }

    return { success: true, data: JSON.parse(JSON.stringify(quesion)) };
  } catch (e) {
    return handleError(e) as ErrorResponse;
  }
}

// server actions are designed to be used in different contexts:

// in server components they act like regualr async funciton
// in client components : when used in form actions or event handlers they are invoked via POST request.
