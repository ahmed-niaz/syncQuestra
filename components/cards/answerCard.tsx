import { AnswerType } from "@/types/global";
import UserAvatar from "../user-avatar";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";
import Preview from "../editor/preview";

const AnswerCard = ({ _id, author, content, createdAt }: AnswerType) => {
  return (
    <article className="light-border border-b py-10">
      <span id={JSON.stringify(_id)} className="hash-span" />
      <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-start gap-1 sm:items-center">
          <UserAvatar
            id={author._id}
            name={author.name}
            imageSrc={author.image}
            className="size-5 rounded-full object-cover max-sm:mt-1.5"
          />
          <Link href={ROUTES.PROFILE(author._id)} className="flex flex-col max-sm:ml-1 sm:flex-row sm:items-center">
            <p className="body-semibold text-dark400_light700">{author.name ?? "Anonymous"}</p>
            <p className="small-regular text-light400_light500 mt-0.5 ml-0.5 line-clamp-1">
              <span className="max-sm:hidden">•</span> answered {getTimeStamp(createdAt)}
            </p>
          </Link>
        </div>
        <div className="flex justify-end">
          <p>Votes</p>
        </div>
      </div>
      <Preview content={content} />
    </article>
  );
};

export default AnswerCard;
