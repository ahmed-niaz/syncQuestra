import LocalSearch from "@/components/search/localSearch";
import { ROUTES } from "@/constants/routes";
import search from "@/public/icons/search.svg";
import QuestionCard from "@/components/cards/questionCard";
import DataRenderer from "@/components/data-renderer";
import { EMPTY_QUESTION } from "@/constants/states";
import { getSaveBookMark } from "@/lib/actions/bookmark.action";
import CommonFilter from "@/components/filters/common-filter";
import { CollectionFilters } from "@/constants/filters";
import Pagination from "@/components/pagination";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const Collection = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = (await searchParams) ?? {};

  const { success, data, error } = await getSaveBookMark({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 5,
    query: query || "",
    filter: filter || "",
  });

  const { collection, isNext } = data || {};

  // const filteredQuestion = questions.filter((question) => {
  //   const matchQuery = question.title.toLowerCase().includes(query.toLowerCase());

  //   const filterQuery = filter ? question.tags[0].name.toLowerCase() === filter.toLowerCase() : true;

  //   return matchQuery && filterQuery;
  // });

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">Bookmarks</h1>
      </section>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          imgSrc={search}
          route={ROUTES.COLLECTION}
          placeholder="Search Questions..."
          additionalClassName="flex-1"
        />
        <CommonFilter filters={CollectionFilters} otherClasses="min-h-14 sm:min-w-[170px]" />
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
        data={collection}
        empty={EMPTY_QUESTION}
        render={(collection) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {collection.map((item) => (
              <QuestionCard key={item._id} question={item.question} />
            ))}
          </div>
        )}
      />
      <Pagination page={Number(page) || 1} isNext={isNext || false} containerClasses="" />
    </>
  );
};

export default Collection;
