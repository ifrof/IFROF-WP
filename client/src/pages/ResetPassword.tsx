import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Loader2, Lock, CheckCircle2, Home } from "lucide-react";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters / يجب أن تكون كلمة المرور 8 أحرف على الأقل")
    .regex(/[0-9]/, "Password must contain a number / يجب أن تحتوي كلمة المرور على رقم")
    .regex(/[^a-zA-Z0-9]/, "Password must contain a special character / يجب أن تحتوي كلمة المرور على رمز خاص"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match / كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const [, setLocation] = useLocation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Simple language detection
  const language = typeof window !== "undefined" && window.location.pathname.startsWith("/ar") ? "ar" : "en";

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const resetPasswordMutation = trpc.auth.resetPassword.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
    },
    onError: (err: any) => {
      setError(err.message);
    }
  });

  const onSubmit = (data: ResetPasswordForm) => {
    if (!token) return;
    setError(null);
    resetPasswordMutation.mutate({
      token,
      password: data.password,
    });
  };

  if (isSuccess) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ${language === "ar" ? "rtl" : "ltr"}`}>
        <div className="mb-8">
          <Link to="/" className="flex items-center text-gray-500 hover:text-[#1e3a5f] transition-colors font-medium">
            <Home className={`h-5 w-5 ${language === "ar" ? "ml-2" : "mr-2"}`} />
            {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
          </Link>
        </div>

        <Card className="w-full max-w-md text-center shadow-xl border-gray-200">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Password Reset Successful</CardTitle>
            <CardDescription>
              Your password has been updated successfully.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              You can now log in with your new password.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/login">Login Now</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ${language === "ar" ? "rtl" : "ltr"}`}>
      <div className="mb-8">
        <Link to="/" className="flex items-center text-gray-500 hover:text-[#1e3a5f] transition-colors font-medium">
          <Home className={`h-5 w-5 ${language === "ar" ? "ml-2" : "mr-2"}`} />
          {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-xl border-gray-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="password" type="password" className="pl-10" {...register("password")} />
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="confirmPassword" type="password" className="pl-10" {...register("confirmPassword")} />
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={resetPasswordMutation.isPending}>
              {resetPasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
