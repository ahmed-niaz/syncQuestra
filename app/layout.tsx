import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/context/theme";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { auth } from "@/auth";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const spaceMono = localFont({
  variable: "--font-space-mono",
  src: "./fonts/SpaceMonoVF.ttf",
  weight: "400 700",
  style: "normal",
  display: "swap",
});

const shareTechMono = localFont({
  variable: "--font-sharetechmono",
  src: "./fonts/ShareTechMonoVF.ttf",
  weight: "400",
  style: "normal",
  display: "swap",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", spaceMono.variable, shareTechMono.variable, "font-sans", geist.variable)}
    >
      <SessionProvider session={session}>
        <body>
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
