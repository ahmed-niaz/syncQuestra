import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { cn, devIconClassName, getTechDescription } from "@/lib/utils";
import close from "@/public/icons/x.svg";
import Image from "next/image";

interface Props {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  remove?: boolean;
  isButton?: boolean;
  handleTagRemoveBtn?: (e: React.MouseEvent<HTMLImageElement>) => void;
}

const CardTags = ({ _id, name, questions, showCount, compact, remove, isButton, handleTagRemoveBtn }: Props) => {
  const iconsClass = devIconClassName(name);
  const iconDescription = getTechDescription(name);

  const content = (
    <>
      <Badge className="background-light800_dark300 text-light-400 flex flex-row items-center gap-2 rounded-md border-none px-2 py-3 uppercase">
        <div className="flex-center space-x-2">
          <i className={`${iconsClass} text-sm`}></i>
          <span>{name}</span>
        </div>
        {remove && (
          <Image
            src={close}
            alt="close"
            width={14}
            height={14}
            className="cursor-pointer object-contain invert-0 dark:invert-1"
            onClick={(e) => {
              e.stopPropagation();
              handleTagRemoveBtn?.(e);
            }}
          />
        )}
      </Badge>
      {showCount && <p className="small-medium text-dark500_light700">{questions}</p>}
    </>
  );

  if (compact) {
    return isButton ? (
      <button className="flex justify-between gap-2">{content}</button>
    ) : (
      <Link href={ROUTES.TAG(_id)} className="flex justify-between gap-2 rounded-md">
        {content}
      </Link>
    );
  }

  return (
    <Link href={ROUTES.TAG(_id)} className="shadow-light100_darknone">
      <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
        <div className="flex items-center justify-between gap-3">
          <div className="background-light800_dark400 w-fit px-5 py-1.5">
            <p className="paragraph-semibold text-dark400_light900">{name}</p>
          </div>
          <i className={cn(iconsClass, "text-2xl")} aria-hidden="true" />
        </div>
        <p className="small-regular text-dark500_light700 mt-5 line-clamp-3 w-full">{iconDescription}</p>
        <p className="small-medium text-dark400_light500 mt-3.5">
          <span className="body-semibold primary-text-gradient">{questions}+ </span>
          Questions
        </p>
      </article>
    </Link>
  );
};

export default CardTags;
