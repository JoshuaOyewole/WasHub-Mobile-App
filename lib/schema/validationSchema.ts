import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 20;
export const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

export const isPasswordComplex = (password: string) =>
  passwordComplexityRegex.test(password);

export const loginSchema = z.object({
  email: z.email("Invalid email address").nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters").nonempty("Password is required"),
  rememberMe: z.boolean().default(false),
});

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.email("Invalid email address").nonempty("Email is required"),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, "Invalid phone number"),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, "Password must be at least 6 characters")
    .max(PASSWORD_MAX_LENGTH, "Password must be at most 20 characters")
    .nonempty("Password is required")
    .refine(isPasswordComplex, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
  confirmPassword: z.string().nonempty("Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address").nonempty("Email is required"),
});

export const emailVerificationSchema = z.object({
  email: z.email("Invalid email address").nonempty("Email is required"),
});

export const otpSchema = z.object({
  email: z.email("Invalid email address").nonempty("Email is required"),
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be a 6-digit code"),
});

export const setupPasswordSchema = z
  .object({
    pwd: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .nonempty("Password is required"),
    confirmPwd: z.string().nonempty("Confirm password is required"),
  })
  .refine((data) => data.pwd === data.confirmPwd, {
    message: "Passwords do not match",
    path: ["confirmPwd"],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type EmailVerificationSchema = z.infer<typeof emailVerificationSchema>;
export type OtpSchema = z.infer<typeof otpSchema>;
export type SetupPasswordSchema = z.infer<typeof setupPasswordSchema>;

export type registrationSchema = LoginSchema | RegisterSchema | ForgotPasswordSchema | EmailVerificationSchema | OtpSchema | SetupPasswordSchema ;
