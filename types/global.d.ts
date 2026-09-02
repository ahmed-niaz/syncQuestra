export interface Tags {
  _id: string;
  name: string;
  questions?: number;
}

export interface Author {
  _id: string;
  name: string;
  image?: string;
}

export interface Question {
  _id: string;
  title: string;
  content: string;
  tags: Tags[];
  author: Author;
  upvotes: number;
  downvotes: number;
  answers: number;
  views: number;
  createdAt: Date;
}

export type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

export type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
export type ErrorResponse = ActionResponse<undefined> & { success: false };

export type APIErrorResponse = NextResponse<ErrorResponse>;
export type APISuccessResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

export interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  filter?: string;
  query?: string;
}

export interface AnswerType {
  _id: string;
  author: Author;
  content: string;
  createdAt: Date;
  downvotes: number;
  upvotes: number;
}

export interface UserType {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}

export interface Collection {
  _id: string;
  author: Author;
  question: Question;
}
