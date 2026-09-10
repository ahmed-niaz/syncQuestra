"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { removeKeysFromQuery, urlQueryForm } from "@/lib/url";

const filters = [
  {
    name: "Newest",
    value: "newest",
  },
  {
    name: "Popular",
    value: "popular",
  },
  {
    name: "Unanswered",
    value: "unanswered",
  },
  {
    name: "Recommended",
    value: "recommended",
  },
];

const HomeFilter = () => {
  const searchParams = useSearchParams();
  const filterParams = searchParams.get("filter");
  const routerQuery = useRouter();
  const [isActive, setIsActive] = useState(filterParams || "");

  const handleClick = (filter: string) => {
    let urlQuires = "";
    if (filter === isActive) {
      setIsActive("");

      urlQuires = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["filter"],
      });
    } else {
      setIsActive(filter);
      urlQuires = urlQueryForm({
        params: searchParams.toString(),
        key: "filter",
        value: filter.toLowerCase(),
      });
    }

    routerQuery.push(urlQuires, { scroll: false });
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
      {filters.map((filter) => (
        <Button
          className={cn(
            `body-medium cursor-pointer rounded-lg px-6 py-3 capitalize shadow-none`,
            isActive === filter.value
              ? "bg-primary-100 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 primary-gradient text-light-900"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
          )}
          key={filter.value}
          onClick={() => handleClick(filter.value)}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;
