import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { AiAnswerSchema } from "@/lib/zod/validation";
import { APIErrorResponse } from "@/types/global";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import * as z from "zod";

const opencode = createOpenAI({
  baseURL: "https://opencode.ai/zen/v1",
  apiKey: process.env.OPENCODE_API_KEY,
});

export async function POST(req: Request) {
  const { question, content } = await req.json();

  try {
    const validatedData = AiAnswerSchema.safeParse({ question, content });

    if (!validatedData.success) {
      throw new ValidationError(z.flattenError(validatedData.error).fieldErrors);
    }

    const { text } = await generateText({
      model: opencode("deepseek-v4-flash-free"),
      prompt: `Generate a markdown-formatted response to the following question: ${question}. Based it on the following content: ${content} `,
      system:
        "You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary. For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.).",
    });

    return NextResponse.json(
      { success: true, message: "Markdown response generated successfully", data: { text } },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, "api") as APIErrorResponse;
  }
}
