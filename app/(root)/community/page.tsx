import LocalSearch from "@/components/search/localSearch";
import { ROUTES } from "@/constants/routes";
import { getUsers } from "@/lib/actions/user.action";
import { RouteParams } from "@/types/global";
import search from "@/public/icons/search.svg";
import DataRenderer from "@/components/data-renderer";
import { EMPTY_USERS } from "@/constants/states";
import UserCards from "@/components/cards/userCards";
import CommonFilter from "@/components/filters/common-filter";
import { UserFilters } from "@/constants/filters";

const Community = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, filter, query } = await searchParams;

  const { success, data, error } = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter: filter as string | undefined,
    query: query as string | undefined,
  });
  const { users } = data || {};

  return (
    <div>
      <h1 className="h1-bold text-light-800">All Users</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch route={ROUTES.COMMUNITY} iconPosition="left" imgSrc={search} placeholder="Those dev are awesome" />
        <CommonFilter filters={UserFilters} otherClasses="min-h-14 sm:min-w-[170px]" />
      </div>
      <DataRenderer
        success={success}
        error={error}
        data={users}
        empty={EMPTY_USERS}
        render={(users) => (
          <div className="mt-12 flex flex-wrap gap-5">
            {users?.map((user) => (
              <UserCards key={user._id} {...user} />
            ))}
          </div>
        )}
      />
    </div>
  );
};

export default Community;
