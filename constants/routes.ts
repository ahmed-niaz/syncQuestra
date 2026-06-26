export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: (id: string) => `/profile/${id}`,
  TAGS: (id: string) => `/tag/${id}`,
  ASK_QUESTION: "/ask-question",
  QUESTION: (id: string) => `/question/${id}`,
  OAUTH_LOG_IN: `oauth-login`,
};
