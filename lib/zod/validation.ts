import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "please provide the valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(18, { message: "password must be at most 18 characters" }),
});

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username cannot exceed 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(18, { message: "Password cannot exceed 18 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "Title must be at least 5 characters.",
    })
    .max(130, { message: "Title musn't be longer then 130 characters." }),
  content: z.string().min(100, { message: "Minimum of 100 characters." }),
  tags: z
    .array(
      z
        .string()
        .min(1, { message: "Tag must have at least 1 character." })
        .max(15, { message: "Tag must not exceed 15 characters." })
    )
    .min(1, { message: "Add at least one tag." })
    .max(3, { message: "Maximum of 3 tags." }),
});

export const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Invalid email address"),
  bio: z
    .string()
    .optional()
    .transform((val) => (val ? val.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") : val)),
  image: z.url("Invalid image URL").optional(),
  location: z.string().optional(),
  portfolio: z.url("Invalid portfolio URL").optional(),
  reputation: z.number().optional(),
});
