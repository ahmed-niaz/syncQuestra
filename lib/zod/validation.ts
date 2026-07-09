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

export const AccountSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Invalid image URL").optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  provider: z.string().min(1, "Provider is required"),
  providerAccountId: z.string().min(1, "Provider account ID is required"),
});

export const LoginOAuthSchema = z.object({
  provider: z.enum(["github", "google"]),
  providerAccountId: z.string().min(1, "Provider account ID is required"),
  user: z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    image: z.string().url("Invalid image URL").optional(),
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
    .max(4, { message: "Maximum of 4 tags." }),
});

export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1, "Question ID is required"),
});

export const GetQuestionSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
});

export const PaginationSchema = z.object({
  page: z.number().min(1, "page must be one or more").default(1),
  pageSize: z.number().min(1, "page size must be one or more").default(10),
  sort: z.string().optional(),
  filter: z.string().optional(),
  query: z.string().optional(),
});
