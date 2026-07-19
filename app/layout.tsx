import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { cn } from "@/lib/utils";
import ThemeProvider from "@/context/theme";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { auth } from "@/auth";

const dmSans = localFont({
  src: [
    {
      path: "./fonts/DMSansR-VF.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/DMSans-Medium-VF.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/DMSans-Bold-VF.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "syncQuestra",
  description:
    "syncQuestra is a community-driven platform where developers ask questions, share knowledge, and collaborate with programmers worldwide.Explore topics like web development, mobile app development, algorithms, and data structures. Get help when you`re stuck, share your expertise, and grow together with a global developer community.",
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  // session
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning className={cn("h-full", "antialiased", "font-sans", dmSans.variable)}>
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <SessionProvider session={session}>
        <body suppressHydrationWarning>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <main>{children}</main>
          </ThemeProvider>
          <Toaster position="top-center" />
        </body>
      </SessionProvider>
    </html>
  );
};

export default RootLayout;
