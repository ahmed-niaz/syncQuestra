"use client";
import { SheetClose } from "@/components/ui/sheet";
import { SideBarLink } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavigationLinks = ({ isMobileNav = false, userId }: { isMobileNav?: boolean; userId?: string }) => {
  const pathname = usePathname();
  return (
    <>
      {SideBarLink.map((item) => {
        let route = item.route;

        if (item.route === "/profile") {
          if (userId) {
            route = `${item.route}/${userId}`;
          } else {
            return null;
          }
        }

        const isActive = (pathname.includes(route) && route.length > 1) || pathname === route;

        const LinkComponent = (
          <Link
            href={route}
            key={item.label}
            className={cn(
              isActive ? "primary-gradient rounded-lg" : "text-dark300_light900",
              "flex items-center justify-start gap-4 bg-transparent p-4"
            )}
          >
            <Image src={item.imgUrl} alt={item.label} width={20} height={20} className={cn(isActive ? "" : "")} />
            <p className={cn(isActive ? "base-bold" : "base-medium", !isMobileNav && "max-lg:hidden")}>{item.label}</p>
          </Link>
        );

        return isMobileNav ? (
          <SheetClose render={LinkComponent} key={route} nativeButton={false} />
        ) : (
          <React.Fragment key={route}>{LinkComponent}</React.Fragment>
        );
      })}
    </>
  );
};

export default NavigationLinks;
