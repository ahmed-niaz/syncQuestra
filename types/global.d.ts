import { NextResponse } from "next/server";

export interface Tags {
  _id: string;
  name: string;
}

export interface Author {
  _id: string;
  name: string;
  image?: string;
}

export interface Question {
  _id: string;
  title: string;
  description: string;
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
