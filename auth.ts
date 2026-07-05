import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { ActionResponse } from "./types/global";
import { api } from "./lib/routes/api";
import { IAccount, IAccountDoc } from "./database/account.model";
import { LoginSchema } from "./lib/zod/validation";
import { IUserDoc } from "./database/user.model";

// TODO: we'll check if the login account type is credentials (password based) : if yes [we skip]
// TODO: acccount type is not credentials, then call it 'oauth-login' app and create oauth accounts.

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET_KEY,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      // authorize fn is a part of the credentials provider for next auth which is specifically used for
      // verifying credentials during login, validate email password pair & return details if needed.
      async authorize(credentials) {
        // here we need to validate credentials & create token for next-auth.
        const validateFields = LoginSchema.safeParse(credentials);
        if (!validateFields.success) return null;

        const { email, password } = validateFields.data;

        const { data: existingAccount } = (await api.accounts.getByProvider(
          email
        )) as ActionResponse<IAccountDoc | null>;

        if (!existingAccount) return null;

        const { data: existingUser } = (await api.users.getById(
          existingAccount.userId.toString()
        )) as ActionResponse<IUserDoc | null>;

        if (!existingUser) return null;

        // validate password
        const validPassword = await bcrypt.compare(password, existingAccount.password!);

        if (validPassword) {
          return {
            id: existingUser._id.toString(),
            name: existingUser.name,
            email: existingUser.email,
            image: existingUser.image,
          };
        }

        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: true,
  // the callback decides what happens after using login with oauth credentials, help to decide further
  // verification or auth flow should continue or not
  callbacks: {
    //  token
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },

    // jwt
    async jwt({ token, account }) {
      if (account) {
        const { data: existingAccount, success } = (await api.accounts.getByProvider(
          account.type === "credentials" ? token.email! : account.providerAccountId
        )) as ActionResponse<IAccount>;

        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;
        if (userId) token.sub = userId.toString();
      }

      return token;
    },
    async signIn({ user, profile, account }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username: account.provider === "github" ? (profile?.login as string) : (user.name?.toLowerCase() as string),
      };

      const { success } = (await api.auth.oAuthLogin({
        user: userInfo,
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
      })) as ActionResponse;

      if (!success) return false;

      return true;
    },
  },
});
