import { ROUTES } from "./routes";

export const DEFAULT_EMPTY = {
  title: "No Data Found",
  message: "There is currently no data available. Add a new entry to get started.",
  button: {
    text: "Add Data",
    href: ROUTES.HOME,
  },
};

export const DEFAULT_ERROR = {
  title: "Something Went Wrong",
  message: "We encountered an unexpected error while processing your request. Please try again.",
  button: {
    text: "Retry Request",
    href: ROUTES.HOME,
  },
};

export const EMPTY_QUESTION = {
  title: "No Questions Yet",
  message: "There are no questions posted at this time. Be the first to start the discussion.",
  button: {
    text: "Ask a Question",
    href: ROUTES.ASK_QUESTION,
  },
};

export const EMPTY_ANSWERS = {
  title: "No Answers Found",
  message: "This question has not been answered yet. Share your knowledge and provide the first answer.",
};

export const EMPTY_TAGS = {
  title: "No Tags Found",
  message: "No tags have been created yet. Add a tag to help organize and categorize content.",
  button: {
    text: "Create Tag",
    href: ROUTES.ASK_QUESTION,
  },
};

export const EMPTY_COLLECTIONS = {
  title: "Collections Are Empty",
  message: "You have not created any collections yet. Start saving content you find useful.",
};

export const EMPTY_USERS = {
  title: "No Users Found",
  message: "There are no registered users to display at this time.",
};
