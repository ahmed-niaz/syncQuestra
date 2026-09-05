import { ActionResponse, AnswerType } from "@/types/global";
import DataRenderer from "../data-renderer";
import { EMPTY_ANSWERS } from "@/constants/states";
import AnswerCard from "../cards/answerCard";
import CommonFilter from "../filters/common-filter";
import { AnswerFilters } from "@/constants/filters";
import Pagination from "../pagination";

interface Props extends ActionResponse<AnswerType[]> {
  page?: number;
  isNext?: boolean;
  totalAnswers: number;
}

const AllAnswers = ({ data, success, error, totalAnswers, page, isNext }: Props) => {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>
        <CommonFilter filters={AnswerFilters} otherClasses="sm:min-w-32" containerClasses="max-xs:w-full" />
      </div>

      <DataRenderer
        data={data}
        success={success}
        error={error}
        empty={EMPTY_ANSWERS}
        render={(answers) => answers.map((answer) => <AnswerCard key={answer._id} {...answer} />)}
      />

      <Pagination page={Number(page) || 1} isNext={!!isNext} />
    </div>
  );
};

export default AllAnswers;
