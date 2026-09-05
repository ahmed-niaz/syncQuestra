import LocalSearch from "@/components/search/localSearch";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import search from "@/public/icons/search.svg";
import HomeFilter from "@/components/filters/homeFiltering";
import QuestionCard from "@/components/cards/questionCard";
import { getQuestions } from "@/lib/actions/question.action";
import DataRenderer from "@/components/data-renderer";
import { EMPTY_QUESTION } from "@/constants/states";
import CommonFilter from "@/components/filters/common-filter";
import { HomePageFilters } from "@/constants/filters";
import Pagination from "@/components/pagination";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const Home = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = (await searchParams) ?? {};

  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 5,
    query: query || "",
    filter: filter || "",
  });

  const { questions, isNext } = data || {};

  // const filteredQuestion = questions.filter((question) => {
  //   const matchQuery = question.title.toLowerCase().includes(query.toLowerCase());

  //   const filterQuery = filter ? question.tags[0].name.toLowerCase() === filter.toLowerCase() : true;

  //   return matchQuery && filterQuery;
  // });

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button className="primary-gradient text-light-900 min-h-11.5 px-4 py-3">
          <Link href={ROUTES.ASK_QUESTION}>Ask a Questions</Link>
        </Button>
      </section>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          imgSrc={search}
          route={ROUTES.HOME}
          placeholder="Search Questions..."
          additionalClassName="flex-1"
        />
        <CommonFilter
          filters={HomePageFilters}
          otherClasses="min-h-14 sm:min-w-[170px]"
          // containerClasses="hidden max-md:flex"
        />
      </section>
      <section>
        <HomeFilter />
      </section>
      {/* {success ? (
        <div className="mt-10 flex w-full flex-col gap-6">
          {questions && questions.length > 0 ? (
            questions.map((question) => <QuestionCard key={question._id} question={question} />)
          ) : (
            <div className="mt-10 flex w-full items-center justify-center">
              <p className="text-dark400_light700">No questions found</p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-10 flex w-full items-center justify-center">
          <p className="text-dark400_light700">{error?.message || "Failed to fetch quesitons"}</p>
        </div>
      )} */}

      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />
      <Pagination page={Number(page) || 1} isNext={isNext || false} containerClasses="" />
    </>
  );
};

export default Home;
