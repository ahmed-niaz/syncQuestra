import Image from "next/image";
import Link from "next/link";
import React from "react";
import lightLogo from "@/public/icons/modified-logo.png";
import darkLogo from "@/public/icons/sync-black.svg";
import Theme from "./theme";

const Navbar = () => {
  return (
    <nav className="flex-between background-light850_dark100 shadow-light-300 fixed z-50 w-full gap-5 p-6 sm:px-12 dark:shadow-none">
      <Link href="/" className="flex items-center gap-1">
        <Image src={darkLogo} width={80} height={80} alt="syncQuestra" className="block dark:hidden" />
        <Image src={lightLogo} width={80} height={80} alt="syncQuestra" className="hidden dark:block" />
      </Link>
      <p>Global Search</p>
      <div className="flex-between font-shareTechMono gap-5">
        <Theme />
      </div>
    </nav>
  );
};

export default Navbar;
