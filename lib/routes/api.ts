import { IUser } from "@/database/user.model";
import { IAccount } from "@/database/account.model";
import { handleFetch } from "../handlers/fetch";
import logger from "../logger";
import { LoginOAuthParams } from "@/types/action";
import { ROUTES } from "@/constants/routes";
import { ActionResponse } from "@/types/global";

const base_url = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

if (!base_url) {
  logger.error("NEXT_PUBLIC_API_BASE_URL not set");
}

export const api = {
  auth: {
    oAuthLogin: ({ user, provider, providerAccountId }: LoginOAuthParams) =>
      handleFetch(`${base_url}/auth/${ROUTES.OAUTH_LOG_IN}`, {
        method: "POST",
        body: JSON.stringify({ user, provider, providerAccountId }),
      }),
  },
  users: {
    getAll: () => handleFetch(`${base_url}/users`),
    getById: (id: string) => handleFetch(`${base_url}/users/${id}`),
    getByEmail: (email: string) =>
      handleFetch(`${base_url}/users/lookup-email`, {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    create: (userData: Partial<IUser>) =>
      handleFetch(`${base_url}/users`, {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    update: (id: string, updateData: Partial<IUser>) =>
      handleFetch(`${base_url}/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      }),
    delete: (id: string) =>
      handleFetch(`${base_url}/users/${id}`, {
        method: "DELETE",
      }),
  },

  accounts: {
    getAll: () => handleFetch(`${base_url}/accounts`),
    getById: (id: string) => handleFetch(`${base_url}/accounts/${id}`),
    getByProvider: (providerAccountId: string) =>
      handleFetch(`${base_url}/accounts/provider`, {
        method: "POST",
        body: JSON.stringify({ providerAccountId }),
      }),
    create: (accountData: Partial<IAccount>) =>
      handleFetch(`${base_url}/accounts`, {
        method: "POST",
        body: JSON.stringify(accountData),
      }),
    update: (id: string, updateData: Partial<IAccount>) =>
      handleFetch(`${base_url}/accounts/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      }),
    delete: (id: string) =>
      handleFetch(`${base_url}/accounts/${id}`, {
        method: "DELETE",
      }),
  },

  ai: {
    getAnswer: (question: string, content: string): Promise<ActionResponse<{ text: string }>> =>
      handleFetch(`${base_url}/ai/answers`, {
        method: "POST",
        body: JSON.stringify({ question, content }),
        timeout: 60000,
      }),
  },
};
