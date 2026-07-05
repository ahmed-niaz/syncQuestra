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
          <SheetClose render={<section className="flex h-full cursor-pointer flex-col gap-4" />} nativeButton={false}>
            <NavigationLinks isMobileNav />
          </SheetClose>

          <div className="flex flex-col gap-3">
            {userId ? (
              <SheetClose>
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
                    <span>Logout</span>
                  </Button>
                </form>
              </SheetClose>
            ) : (
              <>
                <SheetClose render={<Link href={ROUTES.LOGIN} />} nativeButton={false}>
                  <Button className="base-bold text-dark-400_light700 rounded-2 mt-4 h-12 w-full cursor-pointer px-4 py-3 font-bold text-black">
                    Login
                  </Button>
                </SheetClose>

                <SheetClose render={<Link href={ROUTES.REGISTER} />} nativeButton={false}>
                  <Button className="primary-gradient text-dark-400_light700 rounded-2 base-bold mt-4 h-12 w-full cursor-pointer px-4 py-3">
                    Register
                  </Button>
                </SheetClose>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
