import { auth } from "@/auth";
import QuestionForm from "@/components/forms/questionForm";
import { ROUTES } from "@/constants/routes";
import { redirect } from "next/navigation";

const AskQuestion = async () => {
  const session = await auth();
  if (!session) {
    return redirect(ROUTES.LOGIN);
  }
  return (
    <>
      <div>
        <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
        <div className="mt-9">
          <QuestionForm />
        </div>
      </div>
    </>
  );
};

export default AskQuestion;
