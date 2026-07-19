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
  answers: number;
  views: number;
  createdAt: Date;
}

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APISuccessResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

interface PaginationParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  filter?: string;
  query?: string;
}

interface AnswerType {
  _id: string;
  author: Author;
  content: string;
  createdAt: Date;
}
