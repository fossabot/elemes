import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(10, "Password must be at least 6 characters long"),
});
type LoginSchema = z.infer<typeof LoginSchema>;
export { LoginSchema };

const SignUpSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(10, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
    name: z.string().min(1, "Name is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type SignUpSchema = z.infer<typeof SignUpSchema>;
export { SignUpSchema };
