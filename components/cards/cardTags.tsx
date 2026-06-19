import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { devIconClassName } from "@/lib/utils";

interface Props {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
}

const CardTags = ({ _id, name, questions, showCount }: Props) => {
  const iconsClass = devIconClassName(name);

  return (
    <Link href={ROUTES.TAGS(_id)} className="flex justify-between gap-2 rounded-md">
      <Badge className="background-light800_dark300 text-light-400 rounded-md border-none px-2 py-3 uppercase">
        <div className="flex-center space-x-2">
          <i className={`${iconsClass} text-sm`}></i>
          <span>{name}</span>
        </div>
      </Badge>
      {showCount && <p className="small-medium text-dark500_light700">{questions}</p>}
    </Link>
  );
};

export default CardTags;
