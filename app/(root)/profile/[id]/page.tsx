import { auth } from "@/auth";
import UserAvatar from "@/components/user-avatar";
import { getUser, getUserAnswers, getUserQuestions, getUserStats, getUserTopTags } from "@/lib/actions/user.action";
import { RouteParams } from "@/types/global";
import dayjs from "dayjs";
import { notFound } from "next/navigation";
import locationIcon from "@/public/icons/map-pinned.svg";
import calendarIcon from "@/public/icons/calendar.svg";
import portfolioIcon from "@/public/icons/link.svg";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProfileLink from "@/components/user/ProfileLink";
import Stats from "@/components/user/stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataRenderer from "@/components/data-renderer";
import { EMPTY_QUESTION, EMPTY_TAGS } from "@/constants/states";
import QuestionCard from "@/components/cards/questionCard";
import Pagination from "@/components/pagination";
import AnswerCard from "@/components/cards/answerCard";
import CardTags from "@/components/cards/cardTags";

const Profile = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize } = await searchParams;
  if (!id) notFound();

  const { success, data, error } = await getUser({
    userId: id,
  });
  const loggedInUser = await auth();

  if (!success || !data)
    return (
      <div>
        <div className="h1-bold text-dark100_light900">{error?.message || "User not found"}</div>
      </div>
    );

  const { user } = data;

  const {
    success: userQuestionsSuccess,
    data: userQuestionsData,
    error: userQuestionsError,
  } = await getUserQuestions({ page: Number(page) || 1, pageSize: Number(pageSize) || 2, userId: id });

  const {
    success: userAnswersSuccess,
    data: userAnswersData,
    error: userAnswersError,
  } = await getUserAnswers({ page: Number(page) || 1, pageSize: Number(pageSize) || 2, userId: id });

  const {
    success: userTopTagsSuccess,
    data: userTopTags,
    error: userTopTagsError,
  } = await getUserTopTags({ userId: id });

  const { questions: userQuestions, isNext: hasMoreUserQuestions } = userQuestionsData!;
  const { answers: userAnswers, isNext: hasMoreUserAnswers } = userAnswersData!;
  const { tags } = userTopTags!;

  const { _id, name, username, image, portfolio, location: userLocation, bio, createdAt } = user;

  const { data: userStats } = await getUserStats({ userId: id });

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <UserAvatar
            id={_id}
            name={name}
            imageSrc={image}
            className="size-35 rounded-full object-cover"
            fallbackClassName="text-6xl font-bolder"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{name}</h2>
            <p className="paragraph-regular text-dark200_light800">@{username}</p>
            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {portfolio && <ProfileLink imgUrl={portfolioIcon} href={portfolio} title="Portfolio" />}
              {userLocation && <ProfileLink imgUrl={locationIcon} title={userLocation} />}
              <ProfileLink imgUrl={calendarIcon} title={`Joined ${dayjs(createdAt).format("MMMM YYYY")}`} />
            </div>
            {bio && <p className="paragraph-regular text-dark400_light800 mt-8">{bio}</p>}
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {loggedInUser?.user?.id === id && (
            <Link href={`/profile/${id}/edit`}>
              <Button className="primary-gradient text-light-900 min-h-11.5 cursor-pointer px-4 py-3">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </section>
      {/* stats */}
      <Stats
        totalQuestions={userStats?.totalQuestions ?? data.totalQuestions ?? 0}
        totalAnswers={userStats?.totalAnswers ?? data.totalAnswers ?? 0}
        badges={userStats?.badges || { GOLD: 0, SILVER: 0, BRONZE: 0 }}
      />

      {/* tabs */}
      <section className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-2">
          <TabsList className="primary-gradient text-light-900 min-h-11.5 p-1 px-2">
            <TabsTrigger className="tab" value="top-posts">
              Top Posts
            </TabsTrigger>
            <TabsTrigger className="tab" value="answers">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent className="mt-5 flex w-full flex-col gap-6" value="top-posts">
            <DataRenderer
              data={userQuestions}
              success={userQuestionsSuccess}
              error={userQuestionsError}
              empty={EMPTY_QUESTION}
              render={(questions) => (
                <div className="flex w-full flex-col gap-6">
                  {questions.map((question) => (
                    <QuestionCard
                      key={question._id}
                      question={question}
                      showActionBtns={loggedInUser?.user?.id === question?.author?._id}
                    />
                  ))}
                </div>
              )}
            />
            <Pagination page={Number(page)} isNext={hasMoreUserQuestions} />
          </TabsContent>
          <TabsContent className="flex w-full flex-col gap-6" value="answers">
            <DataRenderer
              data={userAnswers}
              success={userAnswersSuccess}
              error={userAnswersError}
              empty={EMPTY_QUESTION}
              render={(answers) => (
                <div className="flex w-full flex-col gap-10">
                  {answers.map((answer) => (
                    <AnswerCard
                      key={answer._id}
                      {...answer}
                      content={answer.content.slice(0, 27)}
                      containerClasses="card-wrapper rounded-[10px] px-7 py-9 sm:px-11"
                      showReadMore
                      showActionBtns={loggedInUser?.user?.id === answer?.author?._id}
                    />
                  ))}
                </div>
              )}
            />
            <Pagination page={Number(page)} isNext={hasMoreUserAnswers} />
          </TabsContent>
        </Tabs>
        <div className="flex w-full min-w-62.5 flex-1 flex-col max-lg:hidden">
          <h3 className="h3-bold text-dark200_light900">Top Tech</h3>
          <div className="mt-7 flex flex-col gap-4">
            <DataRenderer
              success={userTopTagsSuccess}
              error={userTopTagsError}
              data={tags}
              empty={EMPTY_TAGS}
              render={(tags) => (
                <div className="mt-3 flex w-full flex-col gap-4">
                  {tags.map((tag) => (
                    <CardTags key={tag._id} _id={tag._id} name={tag.name} questions={tag.count} showCount compact />
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
