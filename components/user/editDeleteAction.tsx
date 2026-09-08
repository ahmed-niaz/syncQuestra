"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import editIcon from "@/public/icons/edit.svg";
import trashIcon from "@/public/icons/trash.svg";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteQuestion } from "@/lib/actions/question.action";

interface Props {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const router = useRouter();

  const handleEdit = async () => {
    router.push(`/questions/${itemId}/edit`);
  };

  const handleDelete = async () => {
    if (type === "Question") {
      // call api to delelte question
      await deleteQuestion({ questionId: itemId });

      toast.success("Your question has been deleted successfully.");
    } else {
      // call api to delete answer

      toast.success("Your answer has been deleted successfully.");
    }
  };
  return (
    <div className={`flex items-center justify-end gap-3 max-sm:w-full ${type === "Answer" && "justify-center gap-0"}`}>
      {type == "Question" && (
        <Image
          src={editIcon}
          alt="edit question"
          width={18}
          height={18}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}

      <AlertDialog>
        <AlertDialogTrigger className="cursor-pointer">
          <Image src={trashIcon} alt="Delete question" width={18} height={18} />
        </AlertDialogTrigger>
        <AlertDialogContent className="background-light800_dark300">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              {type === "Question" ? "question" : "answer"} and remove it from our server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
            <AlertDialogAction className="primary-gradient! cursor-pointer! text-white!" onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditDeleteAction;
