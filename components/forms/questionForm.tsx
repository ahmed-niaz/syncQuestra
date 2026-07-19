"use client";

import { AskQuestionSchema } from "@/lib/zod/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { useRef, useTransition } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import CardTags from "../cards/cardTags";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { Question } from "@/types/global";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface Params {
  questionData?: Question;
  isEdit?: boolean;
}

const QuestionForm = ({ questionData, isEdit = false }: Params) => {
  const router = useRouter();
  const editorRef = useRef<MDXEditorMethods | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: questionData?.title || "",
      content: questionData?.content || "",
      tags: questionData?.tags?.map((tag) => tag.name) || [],
    },
  });

  const handleTagRemove = (tag: string, field: { value: string[] }) => {
    const newTags = field.value.filter((tg) => tg !== tag);
    form.setValue("tags", newTags);
    if (newTags.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "At least one tag is required.",
      });
    }
  };

  const handleCreateQuesiton = async (data: z.infer<typeof AskQuestionSchema>) => {
    startTransition(async function () {
      // edit question
      if (isEdit && questionData) {
        const result = await editQuestion({ questionId: questionData._id, ...data });

        if (result.success) {
          toast.success("question updated successfully");
          router.push(ROUTES.QUESTION(questionData._id));
        } else {
          toast.error("failed to update question");
        }
        return;
      }

      // create question
      const result = await createQuestion(data);
      if (result.success) {
        toast.success("question created successfully");
        if (result.data) router.push(ROUTES.QUESTION(result.data._id));
      } else {
        toast.error("failed to create question");
      }
    });
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: { value: string[] }) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputTag = e.currentTarget.value.trim();

      if (inputTag && inputTag.length <= 15 && !field.value.includes(inputTag)) {
        form.setValue("tags", [...field.value, inputTag]);
        e.currentTarget.value = "";
        form.clearErrors("tags");
      } else if (inputTag.length > 15) {
        form.setError("tags", {
          type: "manual",
          message: "Tag must not exceed 15 characters.",
        });
      } else if (field.value.includes(inputTag)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists.",
        });
      }
    }
  };
  return (
    <form onSubmit={form.handleSubmit(handleCreateQuesiton)} className="full mt-10 w-full flex-col space-y-10">
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="paragraph-semibold text-dark400_light700">
              <FieldLabel htmlFor="question-form-title">
                Question Title <span className="text-[#168aad]">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="question-form-title"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                className="paragraph-regular background-light-900 no-focus rounded-1.5 min-h-12 border-none"
              />
              <FieldDescription>
                Avoid generic wording—make it specific and ask it as you would ask another person.
              </FieldDescription>
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup>
        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="paragraph-semibold text-dark400_light700">
              <FieldLabel htmlFor="question-form-content">
                Explain your question <span className="text-[#168aad]">*</span>
              </FieldLabel>
              <Editor value={field.value} editorRef={editorRef} fieldChange={field.onChange} />
              <FieldDescription>
                {"Expand on the title by clearly explaining the issue you're facing."}
              </FieldDescription>
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup>
        <Controller
          name="tags"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="paragraph-semibold text-dark400_light700">
              <FieldLabel htmlFor="question-form-title">
                Tags <span className="text-[#168aad]">*</span>
              </FieldLabel>
              <div>
                <Input
                  // {...field}
                  id="question-form-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Add tags.."
                  autoComplete="off"
                  className="paragraph-regular background-light-900 no-focus rounded-1.5 min-h-12 border-none"
                  onKeyDown={(e) => handleInputKeyDown(e, field)}
                />
                {field.value.length > 0 && (
                  <div className="flex-start mt-2.5 flex-wrap gap-2.5">
                    {field?.value?.map((tag: string) => (
                      <CardTags
                        key={tag}
                        name={tag}
                        _id={tag}
                        compact
                        remove
                        isButton
                        handleTagRemoveBtn={() => handleTagRemove(tag, field)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <FieldDescription>
                Choose up to 3 relevant tags to help categorize your question. Press Enter to add each tag.
              </FieldDescription>
            </Field>
          )}
        />
      </FieldGroup>
      <div className="mt-16 flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="primary-gradient min-h-14 w-fit cursor-pointer rounded-xl px-16 py-6 text-[16px] text-white shadow-lg"
        >
          {isPending ? (
            <>
              <ReloadIcon className="mr-2 size-4 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>{isEdit ? "Edit" : "Ask a Question"}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default QuestionForm;
