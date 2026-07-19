import UserAvatar from "@/components/user-avatar";
import { RouteParams, Tags } from "@/types/global";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import clock from "@/public/icons/clock.svg";
import Metric from "@/components/metric";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import comments from "@/public/icons/comments.svg";
import view from "@/public/icons/view.svg";
import CardTags from "@/components/cards/cardTags";
import Preview from "@/components/editor/preview";
import { getQuestion, increaseViewCount } from "@/lib/actions/question.action";
import { redirect } from "next/navigation";
import { after } from "next/server";
import AnswerForm from "@/components/forms/answerForm";
import { getAnswers } from "@/lib/actions/answer.action";
import AllAnswers from "@/components/answers/answers";

const QuestionDetails = async ({ params }: RouteParams) => {
  const { id: questionId } = await params;
  const { success, data: quesitonData } = await getQuestion({ questionId });
  after(async () => {
    await increaseViewCount({ questionId });
  });

  if (!success || !quesitonData) return redirect("/404");

  // fetch answer from the database using server action
  const {
    success: answerSuccess,
    data: answerResult,
    error: answerError,
  } = await getAnswers({
    questionId,
    page: 1,
    pageSize: 10,
  });

  if (!answerSuccess || !answerResult) return redirect("/404");

  const { content, author, createdAt, answers, views, tags, title } = quesitonData;
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between sm:flex-row">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author._id}
              name={author.name}
              imageSrc={author.image}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light900">{author.name}</p>
            </Link>
          </div>
          <div className="flex justify-end">
            <p>Votes</p>
          </div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">{title}</h2>
      </div>
      <div className="mt-5 mb-8 flex flex-wrap gap-4">
        <Metric
          imgUrl={clock}
          alt="Clock"
          value={`asked ${getTimeStamp(new Date(createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl={comments}
          alt="message"
          value={answers}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl={view}
          alt="view"
          value={formatNumber(views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
      </div>
      <Preview content={content} />
      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: Tags) => (
          <CardTags key={tag._id} _id={tag._id} name={tag.name} compact />
        ))}
      </div>
      <section className="my-5">
        <AllAnswers
          data={answerResult?.answers}
          error={answerError}
          success={answerSuccess}
          totalAnswers={answerResult?.totalAnswers || 0}
        />
      </section>
      <section className="my-5">
        <AnswerForm questionId={quesitonData._id} />
      </section>
    </>
  );
};
export default QuestionDetails;
