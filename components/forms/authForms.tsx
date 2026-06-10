"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, DefaultValues, Path, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FieldValues } from "react-hook-form";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export interface AuthFormProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  defaultValues: T;
  formType: "LOG_IN" | "REGISTER";
  onSubmit: (data: T) => Promise<{ success: boolean; data: T } | { success: boolean; error: string }>;
}

export const AuthForm = <T extends FieldValues>({ schema, defaultValues, onSubmit, formType }: AuthFormProps<T>) => {
  const form = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const buttonText = formType === "REGISTER" ? "Register" : "Login";

  const handleSubmitBtn = async (data: T) => {
    const result = await onSubmit(data);
    console.log("result", result);
    if (result.success) {
      toast.success(formType === "REGISTER" ? "Registration successful" : "Login successful");
    } else {
      toast.error("error" in result ? result.error : "An error occurred");
    }

    // todo: authenticate the user.
  };

  return (
    <div className="mt-4">
      <CardTitle>{buttonText}</CardTitle>
      <form className="mt-10 space-y-2" onSubmit={form.handleSubmit(handleSubmitBtn)}>
        <FieldGroup>
          {Object.keys(defaultValues).map((fieldName) => (
            <Controller
              key={fieldName}
              name={fieldName as Path<T>}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex w-full flex-col gap-2.5">
                  <FieldLabel className="paragraph-medium text-dark-400_light700" htmlFor={`auth-field-${field.name}`}>
                    {field.name === "email"
                      ? "Email Address"
                      : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`auth-field-${field.name}`}
                    required
                    type={field.name === "password" ? "password" : "text"}
                    className="paragraph-regular background-light-900 no-focus rounded-1.5 min-h-12"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          ))}
        </FieldGroup>
        <Button
          disabled={form.formState.isSubmitting}
          className="primary-gradient paragraph-semibold text-dark-400_light700 rounded-2 mt-4 h-12 w-full cursor-pointer px-4 py-3 font-bold"
        >
          {form.formState.isSubmitting ? "Submitting..." : buttonText}
        </Button>
        {formType === "LOG_IN" ? (
          <p>
            Don&apos;t have an account? {""}{" "}
            <Link className="paragraph-semibold primary-text-gradient" href={ROUTES.REGISTER}>
              {" "}
              Register
            </Link>
          </p>
        ) : (
          <p>
            Already have an account? {""}{" "}
            <Link className="paragraph-semibold primary-text-gradient" href={ROUTES.LOGIN}>
              {" "}
              Login
            </Link>
          </p>
        )}
      </form>
    </div>
  );
};
