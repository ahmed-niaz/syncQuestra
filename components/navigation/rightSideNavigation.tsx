import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import rightArrow from "@/public/icons/chevron-right (1).svg";
import { getHotQuestions } from "@/lib/actions/question.action";
import DataRenderer from "../data-renderer";
import { EMPTY_ANSWERS, EMPTY_TAGS } from "@/constants/states";
import { getPopularTags } from "@/lib/actions/tag.action";
import CardTags from "../cards/cardTags";

const RightSideNavigation = async () => {
  // const { success: isHotQuestionsSuccess, data: hotQuestionsData, error: hotQuestionsError } = await getHotQuestions();
  // const { success: isPopularTagsSuccess, data: popularTagsData, error: popularTagsError } = await getPopularTags();

  // const { questions } = hotQuestionsData || {};
  // const { tags } = popularTagsData || {};

  // optimization
  const [
    { success: isHotQuestionsSuccess, data: hotQuestionsData, error: hotQuestionsError },
    { success: isPopularTagsSuccess, data: popularTagsData, error: popularTagsError },
  ] = await Promise.all([getHotQuestions(), getPopularTags()]);

  const { questions } = hotQuestionsData || {};
  const { tags } = popularTagsData || {};
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border shadow-light-300 sticky top-0 right-0 flex h-screen w-87.5 flex-col gap-6 overflow-y-auto border-l p-6 pt-36 max-xl:hidden dark:shadow-none">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Question</h3>
        <DataRenderer
          data={questions}
          success={isHotQuestionsSuccess}
          error={hotQuestionsError}
          empty={EMPTY_ANSWERS}
          render={(questions) => (
            <div className="mt-7 flex w-full flex-col gap-7.5">
              {questions?.map(({ _id, title }) => (
                <Link
                  className="flex cursor-pointer items-center justify-between gap-7"
                  key={_id}
                  href={ROUTES.QUESTION(_id)}
                >
                  <p className="body-medium text-dark500_light700 line-clamp-1">{title}</p>
                  <Image src={rightArrow} alt="arrow" width={20} height={20} className="invert-colors" />
                </Link>
              ))}
            </div>
          )}
        />
      </div>

      <div className="mt-12">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <DataRenderer
          data={tags}
          success={isPopularTagsSuccess}
          error={popularTagsError}
          empty={EMPTY_TAGS}
          render={(tags) => (
            <div className="mt-7 flex flex-col gap-4">
              {tags?.map(({ _id, name, questions }) => (
                <CardTags key={_id} _id={_id} name={name} questions={questions} showCount compact />
              ))}
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default RightSideNavigation;
