import * as z from "zod";
import { ZodSchema } from "zod";
import logger from "../logger";
import { UnauthorizedError, ValidationError } from "../http-errors";
import { Session } from "next-auth";
import { auth } from "@/auth";
import connectToDatabase from "../mongoose";

type ServerActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

type ServerActionResult<T> = {
  params: T;
  session: Session | null;
};

// create the safe handler for the server action
async function serverAction<T>({
  params,
  schema,
  authorize,
}: ServerActionOptions<T>): Promise<ServerActionResult<T> | Error> {
  // checking  the schema & params are provided and  doing validation
  if (schema && params) {
    try {
      params = schema.parse(params) as T;
    } catch (e) {
      logger.error("Server action failed");
      if (e instanceof z.ZodError) {
        return new ValidationError(z.flattenError(e).fieldErrors);
      } else {
        return new Error("Server action failed");
      }
    }
  }

  // checking  the user is authorize and take the session
  let session: Session | null = null;

  if (authorize) {
    session = await auth();
    if (!session) {
      return new UnauthorizedError();
    }
  }

  // connecting to database
  await connectToDatabase();
  return { params: params as T, session };
}

export default serverAction;
