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
