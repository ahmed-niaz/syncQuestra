"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { removeKeysFromQuery, urlQueryForm } from "@/lib/url";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  page?: number | string;
  isNext?: boolean;
  containerClasses?: string;
}

const Pagination = ({ page = 1, isNext = false, containerClasses = "" }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(page) || 1;

  const handleNavigation = (type: "prev" | "next") => {
    const nextPageNumber = type === "next" ? currentPage + 1 : currentPage - 1;

    const newURL =
      nextPageNumber > 1
        ? urlQueryForm({
            params: searchParams.toString(),
            key: "page",
            value: nextPageNumber.toString(),
          })
        : removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["page"],
          });

    router.push(newURL);
  };

  return (
    <div className={cn("mt-4 flex w-full items-center justify-center gap-2", containerClasses)}>
      {currentPage > 1 && (
        <Button
          onClick={() => handleNavigation("prev")}
          className="light-border-2 btn flex min-h-9 items-center justify-center gap-2 border"
        >
          <p className="body-medium text-dark200_light800">Prev</p>
        </Button>
      )}
      <div className="primary-gradient flex items-center justify-center rounded-md px-3.5 py-2">
        <p className="body-semibold text-light-900">{currentPage}</p>
      </div>

      {isNext && (
        <Button
          onClick={() => handleNavigation("next")}
          className="light-border-2 btn flex min-h-9 items-center justify-center gap-2 border"
        >
          <p className="body-medium text-dark200_light800">Next</p>
        </Button>
      )}
    </div>
  );
};

export default Pagination;
