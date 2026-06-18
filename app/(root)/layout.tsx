import LeftSideNavigation from "@/components/navigation/leftSideNavigation";
import Navbar from "@/components/navigation/navbar";
import RightSideNavigation from "@/components/navigation/rightSideNavigation";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light800_dark200 relative">
      <Navbar />
      <div className="flex">
        <LeftSideNavigation />
        <section className="mx-md:pb-14 flex min-h-screen flex-1 flex-col px-6 pt-36 pb-6 sm:px-14">
          <div className="mx-auto w-full max-w-6xl"> {children}</div>
        </section>
        <RightSideNavigation />
      </div>
    </main>
  );
};

export default RootLayout;
