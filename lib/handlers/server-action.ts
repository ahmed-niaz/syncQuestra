import { ZodSchema } from "zod/v3";
import logger from "../logger";
import * as z from "zod";
import { UnauthorizedError, ValidationError } from "../http-errors";
import { Session } from "next-auth";
import { auth } from "@/auth";
import connectToDatabase from "../mongoose";

type ServerActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

// create the safe handler for the server action
async function serverAction<T>({ params, schema, authorize }: ServerActionOptions<T>) {
  // checking  the schema & params are porvided and  doing validation
  if (schema && params) {
    try {
      schema.safeParse(params);
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
  return { params, schema };
}

export default serverAction;
