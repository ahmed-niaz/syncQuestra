import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import rightArrow from "@/public/icons/chevron-right (1).svg";
import CardTags from "../cards/cardTags";

const TOP_QUESTION = [
  {
    _id: "1",
    title: "How can i improve my web development skills?",
  },
  {
    _id: "2",
    title: "What is the difference RTK query and Tanstack Query?",
  },
  {
    _id: "3",
    title: "How to use Redux?",
  },
  {
    _id: "4",
    title: "How to use Tanstack Query?",
  },
  {
    _id: "5",
    title: "What is the best framework for web development?",
  },
  {
    _id: "6",
    title: "How to use Node.js?",
  },
];

const POPULAR_TAGS = [
  {
    _id: "1",
    name: "React",
    questions: 1000,
  },
  {
    _id: "2",
    name: "Node.js",
    questions: 900,
  },
  {
    _id: "3",
    name: "Next.js",
    questions: 800,
  },
  {
    _id: "4",
    name: "TypeScript",
    questions: 700,
  },
  {
    _id: "5",
    name: "JavaScript",
    questions: 600,
  },
  {
    _id: "6",
    name: "CSS",
    questions: 500,
  },
  {
    _id: "7",
    name: "HTML",
    questions: 400,
  },
  {
    _id: "8",
    name: "Python",
    questions: 300,
  },
  {
    _id: "9",
    name: "Java",
    questions: 200,
  },
  {
    _id: "10",
    name: "Cpp",
    questions: 100,
  },
];

const RightSideNavigation = () => {
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border shadow-light-300 sticky top-0 right-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 pt-36 max-xl:hidden dark:shadow-none">
      <div>
        <h3>Top Question</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {TOP_QUESTION.map(({ _id, title }) => (
            <Link
              href={ROUTES.PROFILE(_id)}
              key={`${title}`}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">{title}</p>
              <Image src={rightArrow} alt="arrow" width={20} height={20} className="invert-colors" />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3>Popular Tags</h3>
        <div className="mt-7 flex w-full flex-col gap-6">
          {POPULAR_TAGS.map(({ _id, name, questions }) => (
            <CardTags key={_id} _id={_id} name={name} questions={questions} showCount compact />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSideNavigation;
