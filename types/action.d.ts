import { PaginationParams, TargetType, VoteType } from "./global";

export interface LoginOAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: {
    name: string;
    username: string;
    email: string;
    image: string;
  };
}

export interface AuthCredintials {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

export interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}

export interface GetQuestionParams {
  questionId: string;
}

export interface GetTagQuestionParams extends Omit<PaginationParams, "filter"> {
  tagId: string;
}

export interface IncreaseViewCountParams {
  questionId: string;
}

export interface CreateAnswerParams {
  questionId: string;
  content: string;
}

export interface GetAnswerParams extends PaginationParams {
  questionId: string;
}

export interface CreateVoteParams {
  targetId: string;
  targetType: TargetType;
  voteType: VoteType;
}

export interface UpdateVoteCountParams extends CreateVoteParams {
  change: 1 | -1;
}

export type HasVotedParams = Pick<CreateVoteParams, "targetId" | "targetType">;

export interface HasVotedResponse {
  hasUpvoted: boolean;
  hasDownvoted: boolean;
}

export interface BookmarkParams {
  questionId: string;
}

export interface GetUserParams {
  userId: string;
}

export interface GetUserQuestionsParams extends Omit<PaginationParams, "filter" | "query" | "sort"> {
  userId: string;
}

export interface GetUserAnswersParams extends PaginationParams {
  userId: string;
}

export interface GetUserTagsParams {
  userId: string;
}

export interface DeleteQuestionParams {
  questionId: string;
}
