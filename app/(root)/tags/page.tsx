import LocalSearch from "@/components/search/localSearch";
import { ROUTES } from "@/constants/routes";
import { getTags } from "@/lib/actions/tag.action";
import { RouteParams } from "@/types/global";
import searchImg from "@/public/icons/search.svg";
import DataRenderer from "@/components/data-renderer";
import { EMPTY_TAGS } from "@/constants/states";
import CardTags from "@/components/cards/cardTags";

const Tags = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: (Array.isArray(query) ? query[0] : query) || "",
    filter: (Array.isArray(filter) ? filter[0] : filter) || "",
  });
  const { tags } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.TAGS}
          imgSrc={searchImg}
          placeholder="Search by tag name..."
          additionalClassName="flex-1"
        />
      </section>
      <DataRenderer
        success={success}
        error={error}
        data={tags}
        empty={EMPTY_TAGS}
        render={(tags) => (
          <div className="mt-10 flex w-full flex-wrap gap-4">
            {tags.map((tag) => (
              <CardTags key={tag._id} {...tag} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default Tags;
