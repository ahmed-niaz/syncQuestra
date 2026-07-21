"use client";
import Image from "next/image";
import upvoteIcon from "@/public/icons/upvotes.svg";
import downvoteIcon from "@/public/icons/downvotes.svg";
import { useState } from "react";
import { formatNumber } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface VoteProps {
  upvotes: number;
  downvotes: number;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  questionId: string;
}

const Votes = ({ upvotes, downvotes, hasupVoted, hasdownVoted, questionId }: VoteProps) => {
  const session = useSession();
  const userId = session.data?.user?.id;
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (voteType: "upvotes" | "downvotes") => {
    if (!userId) return toast.error("Please login to vote");
    setIsLoading(true);
    try {
      const successMessage =
        voteType === "upvotes"
          ? `Upvote ${!hasupVoted ? "added" : "removed"} successfully`
          : `Downvote ${!hasdownVoted ? "added" : "removed"} successfully`;

      toast.success("your vote has been recorded");
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
          src={hasupVoted ? upvoteIcon : downvoteIcon}
          alt="upvote"
          width={18}
          height={18}
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvotes")}
        />

        <div className="flex-center background-light850_dark100 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">{formatNumber(upvotes)}</p>
        </div>
      </div>
      <div className="flex-center gap-1.5">
        <Image
          src={hasdownVoted ? downvoteIcon : upvoteIcon}
          alt="downvote"
          width={18}
          height={18}
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
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
