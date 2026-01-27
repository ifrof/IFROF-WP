import React, { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Loader2, CheckCircle2, XCircle, Home } from "lucide-react";

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Simple language detection
  const language =
    typeof window !== "undefined" && window.location.pathname.startsWith("/ar")
      ? "ar"
      : "en";

  const verifyMutation = trpc.auth.verifyEmail.useMutation({
    onSuccess: () => {
      setStatus("success");
    },
    onError: (err: any) => {
      setStatus("error");
      setErrorMessage(err.message);
    },
  });

  useEffect(() => {
    if (token) {
      verifyMutation.mutate({ token });
    } else {
      setStatus("error");
      setErrorMessage("Invalid verification link.");
    }
  }, [token]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ${language === "ar" ? "rtl" : "ltr"}`}
    >
      <div className="mb-8">
        <Link
          to="/"
          className="flex items-center text-gray-500 hover:text-[#1e3a5f] transition-colors font-medium"
        >
          <Home className={`h-5 w-5 ${language === "ar" ? "ml-2" : "mr-2"}`} />
          {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
        </Link>
      </div>

      <Card className="w-full max-w-md text-center shadow-xl border-gray-200">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {status === "loading" && (
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            )}
            {status === "error" && (
              <XCircle className="h-12 w-12 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" && "Verifying Email..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription>
            {status === "loading" &&
              "Please wait while we verify your email address."}
            {status === "success" &&
              "Your email has been successfully verified. You can now access all features."}
            {status === "error" && errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "success" && (
            <p className="text-gray-600">
              Welcome to the IFROF community! Your account is now fully active.
            </p>
          )}
          {status === "error" && (
            <div className="space-y-4">
              <p className="text-gray-600">
                The link may be invalid or expired. Please try logging in to
                resend the verification email.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {status === "success" ? (
            <Button asChild className="w-full">
              <Link to="/profile">Go to Profile</Link>
            </Button>
          ) : status === "error" ? (
            <Button asChild variant="outline" className="w-full">
              <Link to="/login">Back to Login</Link>
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}
