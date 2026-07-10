export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: (id: string) => `/profile/${id}`,
  TAG: "/tags",
  TAGS: (id: string) => `/tag/${id}`,
  ASK_QUESTION: "/ask-question",
  QUESTION: (id: string) => `/questions/${id}`,
  COLLECTION: "/collection",
  COMMUNITY: "/community",
  JOBS: "/jobs",
  OAUTH_LOG_IN: `oauth-login`,
};
