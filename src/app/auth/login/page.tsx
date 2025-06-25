"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/auth";
import {
  Eye,
  EyeOff,
  Building2,
  Home,
  Lock,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const router = useRouter();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const watchedPassword = watch("password", "");

  // Password validation checks
  const passwordChecks = {
    minLength: watchedPassword.length >= 6,
    hasUppercase: /[A-Z]/.test(watchedPassword),
    hasLowercase: /[a-z]/.test(watchedPassword),
    hasNumber: /\d/.test(watchedPassword),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      const response = await authService.login(data);

      if (response.success && response.data) {
        const { token, ...userData } = response.data;
        login(userData, token);
        toast.success("Login successful!");

        // Redirect based on role
        const redirectPath =
          userData.role === "OWNER" ? "/owner/dashboard" : "/user/dashboard";
        router.push(redirectPath);
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error: any) {
      // Handle different types of errors gracefully
      if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || "Invalid credentials");
      } else if (error.response?.status === 401) {
        toast.error("Invalid username or password");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        }}
      ></div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              RentHouse
            </h1>
          </div>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700"
                >
                  Username
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    id="username"
                    {...register("username")}
                    disabled={loading}
                    className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                    placeholder="Enter your username"
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                    <Lock className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    disabled={loading}
                    className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Password validation indicators */}
                {watchedPassword && (
                  <div className="mt-3 p-3 bg-white/90 rounded-lg border border-gray-200 backdrop-blur-sm">
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      Password requirements:
                    </p>
                    <div className="space-y-1">
                      <div
                        className={`flex items-center gap-2 text-xs ${
                          passwordChecks.minLength
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {passwordChecks.minLength ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        At least 6 characters
                      </div>
                      <div
                        className={`flex items-center gap-2 text-xs ${
                          passwordChecks.hasUppercase
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {passwordChecks.hasUppercase ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        One uppercase letter
                      </div>
                      <div
                        className={`flex items-center gap-2 text-xs ${
                          passwordChecks.hasLowercase
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {passwordChecks.hasLowercase ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        One lowercase letter
                      </div>
                      <div
                        className={`flex items-center gap-2 text-xs ${
                          passwordChecks.hasNumber
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {passwordChecks.hasNumber ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        One number
                      </div>
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !isPasswordValid}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
