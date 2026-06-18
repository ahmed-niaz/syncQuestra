"use client";
import Image from "next/image";
import { Input } from "../ui/input";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { removeKeysFromQuery, urlQueryForm } from "@/lib/url";

interface Props {
  imgSrc: string;
  route: string;
  placeholder: string;
  additionalClassName?: string;
}

const LocalSearch = ({ imgSrc, route, placeholder, additionalClassName }: Props) => {
  const pathName = usePathname();
  const routerQuery = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [searchQuery, setSearchQuery] = useState(query || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const currentQuery = searchParams.get("query") || "";

      if (searchQuery) {
        if (searchQuery !== currentQuery) {
          const newUrl = urlQueryForm({
            params: searchParams.toString(),
            key: "query",
            value: searchQuery,
          });

          routerQuery.push(newUrl, { scroll: false });
        }
      } else {
        if (currentQuery && pathName === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["query"],
          });

          routerQuery.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchParams, routerQuery, route, pathName]);

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${additionalClassName}`}
    >
      <Image src={imgSrc} alt="search icon" width={20} height={20} className="cursor-pointer" />
      <Input
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-0 bg-transparent shadow-none outline-none dark:bg-transparent"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
      />
    </div>
  );
};

export default LocalSearch;
