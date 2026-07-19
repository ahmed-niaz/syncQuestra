"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { useRef, useState, useTransition } from "react";
import { AnswerSchema } from "@/lib/zod/validation";
import * as z from "zod";
import dynamic from "next/dynamic";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import Image from "next/image";
import sparkle from "@/public/icons/sparkles.svg";
import { createAnswer } from "@/lib/actions/answer.action";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface AnswerFormProps {
  questionId: string;
}

const AnswerForm = ({ questionId }: AnswerFormProps) => {
  const [isAnswering, startTransition] = useTransition();
  const [isAiSubmitting, setIsAiSubmitting] = useState(false);
  const editorRef = useRef<MDXEditorMethods | null>(null);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: { content: "" },
  });

  const handleSubmitBtn = async (values: z.infer<typeof AnswerSchema>) => {
    startTransition(async () => {
      const result = await createAnswer({
        questionId,
        content: values.content,
      });

      if (result.success) {
        form.reset();
        toast.success("Answered successfully.");
      } else {
        toast.error("Failed to answer.");
      }
    });
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light700">Write your answer</h4>
        <Button
          className="btn light-border-2 text-primary-500 dark:text-primary-500 hover:bg-light-850 dark:hover:bg-dark-400 cursor-pointer gap-1.5 rounded-md border px-4 py-2.5 font-medium shadow-none"
          disabled={isAiSubmitting}
        >
          {isAiSubmitting ? (
            <>
              <ReloadIcon className="mr-2 size-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Image alt="generate ai answer" src={sparkle} width={20} height={20} className="invert-colors" />
              <span className="primary-text-gradient">Generate Ai Answer</span>
            </>
          )}
        </Button>
      </div>
      <section>
        <form className="mt-8 flex w-full flex-col gap-6" onSubmit={form.handleSubmit(handleSubmitBtn)}>
          <FieldGroup>
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex w-full flex-col gap-2.5">
                  <Editor value={field.value} editorRef={editorRef} fieldChange={field.onChange} />
                  <FieldDescription>{"Ansewer should be more 100 char."}</FieldDescription>
                </Field>
              )}
            />
          </FieldGroup>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isAnswering}
              className="primary-gradient min-h-14 w-fit cursor-pointer rounded-xl px-16 py-4 text-[16px] text-white shadow-lg"
            >
              {isAnswering ? (
                <>
                  <ReloadIcon className="mr-2 size-4 animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                "Post Answer"
              )}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AnswerForm;
