import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

console.log("NextAuth Configuration check:", {
  clientId: process.env.AUTH_GITHUB_CLIENT_ID,
  clientSecret: process.env.AUTH_GITHUB_SECRET_KEY ? "[EXISTS]" : "[MISSING]",
  secret: process.env.AUTH_SECRET || process.env.BETTER_AUTH_SECRET ? "[EXISTS]" : "[MISSING]",
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET_KEY,
    }),
  ],
  secret: process.env.AUTH_SECRET || process.env.BETTER_AUTH_SECRET,
  trustHost: true,
});
