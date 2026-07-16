"use server";

import { CreateQuestionParams, EditQuestionParams, GetQuestionParams, IncreaseViewCountParams } from "@/types/action";
import serverAction from "../handlers/server-action";
import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  IncreaseViewCountSchema,
  PaginationSchema,
} from "../zod/validation";
import handleError from "../handlers/error";
import mongoose, { QueryFilter } from "mongoose";
import { Question, Question as QuestionModel, Tag, TagQuestion } from "@/database";
import { ActionResponse, ErrorResponse, PaginationParams, Question as QuestionType } from "@/types/global";
import { ITagDoc } from "@/database/tag.model";
import { IQuestionDoc } from "@/database/question.model";

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

export async function editQuestion(params: EditQuestionParams): Promise<ActionResponse<IQuestionDoc>> {
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

    if (!question) {
      throw new Error("Question not found");
    }

    if (question.author.toString() !== userId) {
      throw new Error("Unauthorized");
    }

    if (title !== question.title || content !== question.content) {
      question.title = title;
      question.content = content;

      await question.save({ session });
    }

    // Determine which tags to add/remove using the populated tag documents
    const addTags = tags.filter(
      (tag) => !question.tags.some((tg: ITagDoc) => tg.name.toLowerCase() === tag.toLowerCase())
    );

    const removeTags = question.tags.filter(
      (tag: ITagDoc) => !tags.some((tg) => tg.toLowerCase() === tag.name.toLowerCase())
    );

    const newTagDocuments = [];

    // Depopulate tags to get a clean ObjectId array before mutating
    question.depopulate("tags");

    if (addTags.length > 0) {
      for (const tg of addTags) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: `^${tg}$`, $options: "i" } },
          { $setOnInsert: { name: tg }, $inc: { questions: 1 } },
          { upsert: true, new: true, session }
        );

        if (!existingTag) {
          throw new Error(`failed to create tag ${tg}`);
        }

        newTagDocuments.push({
          tag: existingTag._id,
          question: questionId,
        });

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

      question.tags = question.tags.filter(
        (tag: mongoose.Types.ObjectId) => !removeTagIds.some((id: mongoose.Types.ObjectId) => id.equals(tag))
      );
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
    const quesion = await Question.findById(questionId).populate("tags").populate("author", "_id name image");

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

export async function getQuestions(
  params: PaginationParams
): Promise<ActionResponse<{ questions: QuestionType[]; isNext: boolean }>> {
  const validateResult = await serverAction({
    params,
    schema: PaginationSchema,
  });

  if (validateResult instanceof Error) {
    return handleError(validateResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 1, query, filter } = params;
  const skip = Number(page - 1) * pageSize;
  const limit = Number(pageSize);

  const queryFilter: QueryFilter<typeof Question> = {};

  if (filter === "recommended") return { success: true, data: { questions: [], isNext: false } };

  if (query) {
    queryFilter.$or = [{ title: { $regex: query, $options: "i" } }, { content: { $regex: query, $options: "i" } }];
  }

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "unanswered":
      queryFilter.answers = 0;
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalQuestions = await Question.countDocuments(queryFilter);

    const questions = await Question.find(queryFilter)
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    // next Page
    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
    };
  } catch (e) {
    return handleError(e) as ErrorResponse;
  }
}

export async function increaseViewCount(params: IncreaseViewCountParams): Promise<ActionResponse<{ views: number }>> {
  const validateResult = await serverAction({
    params,
    schema: IncreaseViewCountSchema,
  });

  if (validateResult instanceof Error) {
    return handleError(validateResult) as ErrorResponse;
  }

  const { questionId } = validateResult.params;

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    question.views += 1;

    await question.save();

    return { success: true, data: { views: question.views } };
  } catch (e) {
    return handleError(e) as ErrorResponse;
  }
}
