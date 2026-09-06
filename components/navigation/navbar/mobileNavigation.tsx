import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

import menuIcon from "@/public/icons/-menu.svg";
import lightLogo from "@/public/icons/modified-logo.png";
import darkLogo from "@/public/icons/sync-black.svg";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import NavigationLinks from "./navLinks";
import { auth, signOut } from "@/auth";
import { LogOut } from "lucide-react";

const MobileNavigation = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <Sheet>
      <SheetTrigger>
        <Image
          src={menuIcon}
          width={20}
          height={20}
          alt="Menu"
          className="dark:no-invert light:invert cursor-pointer"
        />
      </SheetTrigger>
      <SheetContent className="background-light900_dark200 border-none">
        <SheetTitle className="hidden">Navigation</SheetTitle>
        <Link href="/" className="mt-2 flex items-center gap-1">
          <Image src={darkLogo} width={80} height={80} alt="syncQuestra" className="block dark:hidden" />
          <Image src={lightLogo} width={80} height={80} alt="syncQuestra" className="hidden dark:block" />
        </Link>
        <div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto px-4">
          <section className="flex h-full cursor-pointer flex-col gap-4">
            <NavigationLinks isMobileNav userId={userId} />
          </section>

          <div className="flex flex-col gap-3">
            {userId ? (
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <SheetClose
                  render={
                    <Button
                      type="submit"
                      className="primary-gradient paragraph-semibold text-dark-400_light700 rounded-2 mt-4 flex h-12 w-full cursor-pointer items-center justify-center gap-2 px-4 py-3"
                    >
                      <LogOut className="size-4 text-black dark:text-white" />
                      <span>Logout</span>
                    </Button>
                  }
                />
              </form>
            ) : (
              <>
                <SheetClose
                  nativeButton={false}
                  render={
                    <Link
                      href={ROUTES.LOGIN}
                      className="base-bold text-dark-400_light700 rounded-2 mt-4 flex h-12 w-full cursor-pointer items-center justify-center border px-4 py-3 font-bold text-black"
                    >
                      Login
                    </Link>
                  }
                />

                <SheetClose
                  nativeButton={false}
                  render={
                    <Link
                      href={ROUTES.REGISTER}
                      className="primary-gradient paragraph-semibold text-dark-400_light700 rounded-2 mt-4 flex h-12 w-full cursor-pointer items-center justify-center px-4 py-3"
                    >
                      Register
                    </Link>
                  }
                />
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
