import { ActionResponse } from "@/types/global";
import logger from "../logger";
import handleError from "./error";
import { RequestError } from "../http-errors";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export async function handleFetch<T>(url: string, options: FetchOptions = {}): Promise<ActionResponse<T>> {
  const { timeout = 5000, headers: customHeaders = {}, ...restOptions } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const headers: HeadersInit = { ...defaultHeaders, ...customHeaders };

  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal,
  };

  try {
    const res = await fetch(url, config);

    if (!res.ok) {
      throw new RequestError(res.status, `Http error: ${res.status}`);
    }

    const data = await res.json();
    logger.info(`Fetch request to ${url} successful`);

    return { success: true, data };
  } catch (e) {
    const err = isError(e) ? e : new Error("An unknown error occurred");

    if (err.name === "AbortError") {
      logger.warn(`Fetch request to ${url} timed out`);
    } else {
      logger.error(`Fetch request to ${url} failed: ${err.message}`);
    }

    return handleError(err) as ActionResponse<T>;
  } finally {
    clearTimeout(id);
  }
}
