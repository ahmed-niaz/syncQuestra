import { formatNumber } from "@/lib/utils";
import gold from "@/public/icons/gold-medal.svg";
import silver from "@/public/icons/silver-medal.svg";
import bronze from "@/public/icons/bronze-medal.svg";
import Image from "next/image";

interface StatsProps {
  totalAnswers: number;
  totalQuestions: number;
  badges: {
    GOLD: number;
    SILVER: number;
    BRONZE: number;
  };
}

interface StatsCardProps {
  imgUrl: string;
  value: number;
  title: string;
}

const StatsCard = ({ imgUrl, value, title }: StatsCardProps) => {
  return (
    <div className="primary-gradient item-center shadow-light-300 dark:shadow-dark-200 flex flex-wrap justify-evenly gap-4 rounded-md border p-6">
      <Image src={imgUrl} alt={title} width={40} height={40} />
      <div>
        <p className="paragraph-semibold text-dark200_light800">{formatNumber(value)}</p>
        <p className="body-medium text-dark400_light700">{title}</p>
      </div>
    </div>
  );
};
const Stats = ({ totalAnswers, totalQuestions, badges }: StatsProps) => {
  return (
    <div className="mt-3">
      <h4 className="h3-semibold text-dark200_light900">Stats</h4>
      <div className="xs:grid-cols-2 mt-5 grid grid-cols-1 gap-5 md:grid-cols-4">
        {/* card 1 */}
        <div className="primary-gradient item-center shadow-light-300 dark:shadow-dark-200 flex flex-wrap justify-evenly gap-4 rounded-md border p-6">
          <div>
            <p className="paragraph-semibold text-dark-200_light900">{formatNumber(totalQuestions)}</p>
            <p className="body-medium text-dark-200_light900">Questions</p>
          </div>
          <div>
            <p className="paragraph-semibold text-dark-200_light900">{formatNumber(totalAnswers)}</p>
            <p className="body-medium text-dark-200_light900">Answers</p>
          </div>
        </div>
        {/* stats card 3 */}
        <StatsCard imgUrl={gold} value={badges.GOLD} title="Gold" />
        <StatsCard imgUrl={silver} value={badges.SILVER} title="Silver" />
        <StatsCard imgUrl={bronze} value={badges.BRONZE} title="Bronze" />
      </div>
    </div>
  );
};

export default Stats;
