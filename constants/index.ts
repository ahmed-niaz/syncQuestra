import home from "@/public/icons/home.svg";
import community from "@/public/icons/community.png";
import collection from "@/public/icons/star.png";
import job from "@/public/icons/jobs.png";
import tag from "@/public/icons/tags.png";
import communities from "@/public/icons/communities.png";
import question from "@/public/icons/questions.png";

export const SideBarLink = [
  {
    imgUrl: home,
    route: "/",
    label: "Home",
  },
  {
    imgUrl: community,
    route: "/community",
    label: "Community",
  },
  {
    imgUrl: collection,
    route: "/collection",
    label: "Collection",
  },
  {
    imgUrl: job,
    route: "/find-jobs",
    label: "Jobs",
  },
  {
    imgUrl: tag,
    route: "/tags",
    label: "Tags",
  },
  {
    imgUrl: communities,
    route: "/profile",
    label: "Profile",
  },
  {
    imgUrl: question,
    route: "/ask-question",
    label: "Ask Question",
  },
];

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};
