import { auth } from "@/auth";
import QuestionForm from "@/components/forms/questionForm";
import { ROUTES } from "@/constants/routes";
import { getQuestion } from "@/lib/actions/question.action";
import { RouteParams } from "@/types/global";
import { notFound, redirect } from "next/navigation";

const EditQuestion = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();
  if (!session) {
    return redirect(ROUTES.LOGIN);
  }

  const { data: question, success } = await getQuestion({ questionId: id });
  if (!success || !question) return notFound();

  if (question?.author.toString() !== session?.user?.id) redirect(ROUTES.QUESTION(id));

  return (
    <main className="max-w-4xl flex-1">
      <QuestionForm questionData={question} isEdit />
    </main>
  );
};

export default EditQuestion;
