import { ROUTES } from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";
import { Question, Tags } from "@/types/global";
import Link from "next/link";
import CardTags from "./cardTags";
import Metric from "../metric";

import like from "@/public/icons/likes.svg";
import comments from "@/public/icons/comments.svg";
import viewsImg from "@/public/icons/view.svg";

interface Props {
  question: Question;
}

const QuestionCard = ({ question }: Props) => {
  const { _id, title, createdAt, tags, author, upvotes, answers, views } = question;
  return (
    <div className="card-wrapper rounded-[10px] border-gray-300 p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={ROUTES.QUESTION(_id)}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex">{title}</h3>
          </Link>
        </div>
      </div>
      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {tags.map((tag: Tags) => (
          <CardTags key={tag._id} _id={tag._id} name={tag.name} compact />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.image}
          alt={author.name}
          value={author.name}
          title={`| asked ${getTimeStamp(createdAt)}`}
          href={ROUTES.PROFILE(author._id as string)}
          textStyles="small-medium text-dark400_light700"
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl={like}
            alt="likes"
            value={upvotes}
            title="Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl={comments}
            alt="Message"
            value={answers}
            title="Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl={viewsImg}
            alt="Views"
            value={views}
            title="Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
