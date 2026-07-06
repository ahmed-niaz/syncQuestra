import { RouteParams } from "@/types/global";

const QuestionDetails = async ({ params }: RouteParams) => {
  const id = (await params).id;
  return (
    <div className="w-full">
      <h1>Question page : {id}</h1>
    </div>
  );
};
export default QuestionDetails;
