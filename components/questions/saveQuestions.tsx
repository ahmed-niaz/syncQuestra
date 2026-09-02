"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { use, useState } from "react";
import star from "@/public/icons/star_icon.svg";
import fillStar from "@/public/icons/fill_star.png";
import { toast } from "sonner";
import { toggleSaveBookMark } from "@/lib/actions/bookmark.action";
import { ActionResponse } from "@/types/global";

export const SaveQuestions = ({
  questionId,
  hasSavedBookmarkPromise,
}: {
  questionId: string;
  hasSavedBookmarkPromise: Promise<ActionResponse<{ saved: boolean }>>;
}) => {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const [isLoading, setIsLoading] = useState(false);

  const { data } = use(hasSavedBookmarkPromise);
  const [hasSaved, setHasSaved] = useState<boolean | undefined>(undefined);

  const isSaved = hasSaved !== undefined ? hasSaved : data?.saved;

  const handleSaveQuestion = async () => {
    if (isLoading) return;
    if (!userId) {
      return toast.error("please login to save the question");
    }
    setIsLoading(true);

    try {
      const { success, data, error } = await toggleSaveBookMark({ questionId });
      if (!success || !data) {
        throw new Error(error?.message || "Failed to save question");
      }

      setHasSaved(data.saved);
      toast.success(data.saved ? "Question saved successfully" : "Question unsaved successfully");
    } catch {
      toast.error("Failed to save question");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Image
      src={isSaved ? fillStar : star}
      width={18}
      height={18}
      alt="save"
      className={`cursor-pointer ${isLoading ? `opacity-50` : ""}`}
      aria-label="Bookmarked"
      onClick={handleSaveQuestion}
    />
  );
};
