import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Loader2, UserPlus, Mail, Lock, User, Phone } from "lucide-react";

const registerSchema = z.object({
  email: z.string().email("Invalid email format / تنسيق البريد الإلكتروني غير صحيح"),
  password: z.string().min(8, "Password must be at least 8 characters / يجب أن تكون كلمة المرور 8 أحرف على الأقل")
    .regex(/[0-9]/, "Password must contain a number / يجب أن تحتوي كلمة المرور على رقم")
    .regex(/[^a-zA-Z0-9]/, "Password must contain a special character / يجب أن تحتوي كلمة المرور على رمز خاص"),
  confirmPassword: z.string(),
  name: z.string().min(2, "Name is too short / الاسم قصير جداً"),
  phone: z.string().optional(),
  role: z.enum(["buyer", "factory"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match / كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "buyer",
    }
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      setLocation("/profile?registered=true");
      window.location.reload();
    },
    onError: (err: any) => {
      setError(err.message);
    }
  });

  const onSubmit = (data: RegisterForm) => {
    setError(null);
    registerMutation.mutate(data);
  };

  return (
    <div className="container max-w-lg py-12">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Join IFROF to start importing directly from Chinese manufacturers
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
              <Label htmlFor="name">Full Name / الاسم الكامل</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="name" placeholder="John Doe" className="pl-10" {...register("name")} />
              </div>
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email / البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="email" type="email" placeholder="name@example.com" className="pl-10" {...register("email")} />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional) / الهاتف</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="phone" placeholder="+1234567890" className="pl-10" {...register("phone")} />
              </div>
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password / كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="password" type="password" className="pl-10" {...register("password")} />
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm / تأكيد</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="confirmPassword" type="password" className="pl-10" {...register("confirmPassword")} />
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Account Type / نوع الحساب</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="buyer" {...register("role")} className="w-4 h-4 text-blue-600" />
                  <span>Buyer / مشتري</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="factory" {...register("role")} className="w-4 h-4 text-blue-600" />
                  <span>Factory / مصنع</span>
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register Now
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Login here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
