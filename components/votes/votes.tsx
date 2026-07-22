"use client";
import Image from "next/image";
import upvoteIcon from "@/public/icons/upvotes.svg";
import upVoted from "@/public/icons/green-up-arrow.svg";
import downvoteIcon from "@/public/icons/downvotes.svg";
import downVoted from "@/public/icons/red-down-arrow.svg";

import { use, useState } from "react";
import { formatNumber } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { HasVotedResponse } from "@/types/action";
import { ActionResponse } from "@/types/global";
import { TARGET_TYPE } from "@/constants/vote";
import { createVotes } from "@/lib/actions/vote.action";

interface VoteProps {
  targetType: (typeof TARGET_TYPE)[keyof typeof TARGET_TYPE];
  targetId: string;
  upvotes: number;
  downvotes: number;
  hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
}

const Votes = ({ targetId, targetType, upvotes, downvotes, hasVotedPromise }: VoteProps) => {
  const session = useSession();
  const userId = session.data?.user?.id;
  const { success, data } = use(hasVotedPromise);
  const [isLoading, setIsLoading] = useState(false);

  const { hasDownvoted, hasUpvoted } = data || {};

  const handleVote = async (voteType: "upvotes" | "downvotes") => {
    if (!userId) return toast.error("Please login to vote");
    setIsLoading(true);
    try {
      const result = await createVotes({
        targetId,
        targetType,
        voteType,
      });

      if (!result.success) {
        toast.error(result.error?.message || "Failed to vote");
        return;
      }

      const successMessage =
        voteType === "upvotes"
          ? `Upvote ${!hasUpvoted ? "added" : "removed"} successfully`
          : `Downvote ${!hasDownvoted ? "added" : "removed"} successfully`;

      toast.success(successMessage);
    } catch {
      toast.error("Failed to vote");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={success && hasUpvoted ? upVoted : upvoteIcon}
          alt="upvote"
          width={18}
          height={18}
          className={`cursor-pointer ${isLoading ? "opacity-50" : ""} ${
            success && hasUpvoted ? "bg-primary-500/20 rounded-full p-0.5" : ""
          }`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvotes")}
        />

        <div className="flex-center background-light850_dark100 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">{formatNumber(upvotes)}</p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={success && hasDownvoted ? downVoted : downvoteIcon}
          alt="downvote"
          width={18}
          height={18}
          className={`cursor-pointer ${isLoading ? "opacity-50" : ""} ${
            success && hasDownvoted ? "bg-primary-500/20 rounded-full p-0.5" : ""
          }`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvotes")}
        />

        <div className="flex-center background-light850_dark100 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">{formatNumber(downvotes)}</p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
