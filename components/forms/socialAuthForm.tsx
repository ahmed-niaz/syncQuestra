"use client";

import { Button } from "@base-ui/react";
import Image from "next/image";
import git from "@/public/icons/git.png";
import google from "@/public/icons/google.png";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { ROUTES } from "@/constants/routes";

const SocialAuthForm = () => {
  const buttonClass =
    "background-dark400_light900 body-medium text-dark200_light800 rounded-2 min-h-12 flex px-4 py-3.5 items-center justify-center cursor-pointer";

  const handleLogin = async (provider: "github" | "google") => {
    try {
      await signIn(provider, {
        redirectTo: ROUTES.HOME,
      });
    } catch (e) {
      console.log(`Login failed for ${provider}:`, e);
      toast.error("Sign in failed");
    }
  };

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
      <Button className={buttonClass} onClick={() => handleLogin("github")}>
        <Image src={git} alt="github" width={20} height={20} className="mr-2.5 object-contain dark:invert" />
        <span>Login with GitHub</span>
      </Button>
      <Button className={buttonClass} onClick={() => handleLogin("google")}>
        <Image src={google} alt="google" width={20} height={20} className="mr-2.5 object-contain" />
        <span>Login with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
