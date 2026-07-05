import { ROUTES } from "@/constants/routes";
import { Button } from "@base-ui/react";
import login from "@/public/icons/login.svg";
import register from "@/public/icons/register.svg";

import NavigationLinks from "./navbar/navLinks";
import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/auth";
import { LogOut } from "lucide-react";

const LeftSideNavigation = async () => {
  const session = await auth();

  const userId = session?.user?.id;

  return (
    <section className="custom-scrollbar background-light900_dark200 light-border shadow-light-300 sticky top-0 left-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 max-sm:hidden lg:w-[290px] dark:shadow-none">
      <div className="flex flex-1 flex-col gap-6">
        <NavigationLinks userId={userId} />
      </div>
      <div className="flex flex-col gap-3">
        {userId ? (
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button
              type="submit"
              className="primary-gradient paragraph-semibold text-dark-400_light700 rounded-2 mt-4 flex h-12 w-full cursor-pointer items-center justify-center gap-2 px-4 py-3"
            >
              <LogOut className="size-4 text-black dark:text-white" />
              <span className="max-lg:hidden">Logout</span>
            </Button>
          </form>
        ) : (
          <>
            <Button className="base-bold text-dark-400_light700 rounded-2 mt-4 h-12 w-full cursor-pointer px-4 py-3 font-bold">
              <Link href={ROUTES.LOGIN}>
                <Image className="invert lg:hidden" src={login} width={20} height={20} alt="login" />
                <span className="max-lg:hidden">Login</span>
              </Link>
            </Button>

            <Button className="primary-gradient paragraph-semibold text-dark-400_light700 rounded-2 mt-4 h-12 w-full cursor-pointer px-4 py-3">
              <Link href={ROUTES.REGISTER}>
                <Image className="invert lg:hidden" src={register} width={20} height={20} alt="register" />
                <span className="max-lg:hidden">Register</span>
              </Link>
            </Button>
          </>
        )}
      </div>
    </section>
  );
};

export default LeftSideNavigation;
