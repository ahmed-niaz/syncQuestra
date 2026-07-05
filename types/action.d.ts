export interface LoginOAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: {
    name: string;
    username: string;
    email: string;
    image: string;
  };
}

export interface AuthCredintials {
  name: string;
  username: string;
  email: string;
  password: string;
}
