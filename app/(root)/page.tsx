import LocalSearch from "@/components/search/localSearch";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import search from "@/public/icons/search.svg";
import HomeFilter from "@/components/filters/homeFiltering";
import QuestionCard from "@/components/cards/questionCard";
import { auth } from "@/auth";

const questions = [
  {
    _id: "1",
    title: "How to learn React?",
    description: "I want to learn React, can anyone help me?",
    tags: [
      {
        _id: "1",
        name: "React",
      },
      {
        _id: "2",
        name: "js",
      },
    ],
    author: {
      _id: "1",
      name: "jon doe",
      image: "https://freevector-images.s3.amazonaws.com/uploads/vector/preview/38484/38484.png",
    },

    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "Best way to learn Node.js?",
    description: "I know JavaScript basics and want to start backend development with Node.js.",
    tags: [
      {
        _id: "3",
        name: "Node.js",
      },
      {
        _id: "2",
        name: "js",
      },
    ],
    author: {
      _id: "2",
      name: "Jane Smith",
      image: "https://freevector-images.s3.amazonaws.com/uploads/vector/preview/38484/38484.png",
    },
    upvotes: 25,
    answers: 8,
    views: 250,
    createdAt: new Date("2026-06-18T10:00:00.000Z"),
  },
  {
    _id: "3",
    title: "What is the difference between let, const, and var?",
    description: "Can someone explain the differences between let, const, and var in JavaScript with examples?",
    tags: [
      {
        _id: "2",
        name: "js",
      },
      {
        _id: "4",
        name: "ES6",
      },
    ],
    author: {
      _id: "3",
      name: "Mike Johnson",
      image: "https://freevector-images.s3.amazonaws.com/uploads/vector/preview/38484/38484.png",
    },
    upvotes: 42,
    answers: 12,
    views: 520,
    createdAt: new Date("2026-06-17T15:30:00.000Z"),
  },
];

interface searchParams {
  searchParams: Promise<{ [key: string]: string | undefined } | null | undefined>;
}

const Home = async ({ searchParams }: searchParams) => {
  await auth();

  // console.log("session", session);
  const { query = "", filter = "" } = (await searchParams) || {};

  // const filteredQuestion = questions.filter((question) => question.title.toLowerCase().includes(query.toLowerCase()));

  const filteredQuestion = questions.filter((question) => {
    const matchQuery = question.title.toLowerCase().includes(query.toLowerCase());

    const filterQuery = filter ? question.tags[0].name.toLowerCase() === filter.toLowerCase() : true;

    return matchQuery && filterQuery;
  });

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button className="primary-gradient text-light-900 min-h-[46px] px-4 py-3">
          <Link href={ROUTES.ASK_QUESTION}>Ask a Questions</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          imgSrc={search}
          route={ROUTES.HOME}
          placeholder="Search Questions..."
          additionalClassName="flex-1"
        />
      </section>
      <section>
        <HomeFilter />
      </section>
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestion.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </div>
    </>
  );
};

export default Home;
