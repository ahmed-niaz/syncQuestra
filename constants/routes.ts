export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: (id: string) => `/profile/${id}`,
  TAGS: (id: string) => `/tag/${id}`,
};
