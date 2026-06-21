import { NextResponse } from "next/server";
import { RequestError, ValidationError } from "../http-errors";
import * as z from "zod";


export type ResponseType = "api" | "server";

const formatResponse = (
    responseType: ResponseType,
    status: number,
    message: string,
    errors?: Record<string, string[]> | undefined,

) => {

    const responseErrorContent = {
        success: false,
        error: {
            message,
            details: errors
        }
    }

    return (responseType === 'api') ? NextResponse.json(responseErrorContent, { status }) : { status, ...responseErrorContent }
}

const handleError = (error: unknown, responseType: ResponseType = 'server') => {

    if (error instanceof RequestError) {
        const { message, statusCode, errors } = error;
        return formatResponse(responseType, statusCode, message, errors);

    }


    if (error instanceof z.ZodError) {
        const flattenedErrors = z.flattenError(error);
        const validationError = new ValidationError(
            flattenedErrors.fieldErrors as Record<string, string[]>
        );

        return formatResponse(
            responseType,
            validationError.statusCode,
            validationError.message,
            validationError.errors
        );
    }

    if (error instanceof Error) {
        return formatResponse(responseType, 500, error.message);
    }

    return formatResponse(responseType, 500, "Internal Server Error");
}

export default handleError;