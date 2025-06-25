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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Mail,
  Phone,
  UserCheck,
  CheckCircle,
  XCircle,
} from "lucide-react";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^0\d{8,}$/.test(val), {
      message: "Phone number must start with 0 and contain at least 9 digits",
    }),
  role: z.enum(["USER", "OWNER"], { required_error: "Please select a role" }),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const router = useRouter();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const watchedPassword = watch("password", "");
  const watchedPhoneNumber = watch("phoneNumber", "") || "";
  const watchedEmail = watch("email", "");

  // Email validation check
  const isEmailValid = watchedEmail === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchedEmail);

  // Password validation checks
  const passwordChecks = {
    minLength: watchedPassword.length >= 6,
    hasUppercase: /[A-Z]/.test(watchedPassword),
    hasLowercase: /[a-z]/.test(watchedPassword),
    hasNumber: /\d/.test(watchedPassword),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  // Phone number validation checks
  const phoneChecks = {
    startsWithZero: watchedPhoneNumber.startsWith("0"),
    minLength: watchedPhoneNumber.length >= 9,
    onlyNumbers: /^\d*$/.test(watchedPhoneNumber),
  };

  const isPhoneValid =
    watchedPhoneNumber === "" || Object.values(phoneChecks).every(Boolean);

  const handleRoleChange = (value: string) => {
    setValue("role", value as "USER" | "OWNER");
    setSelectedRole(value);
  };

  const getRoleDisplayName = (value: string) => {
    if (value === "USER") return "Rental";
    if (value === "OWNER") return "House Owner";
    return "";
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    const numbersOnly = value.replace(/\D/g, "");
    setValue("phoneNumber", numbersOnly);
  };

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      const response = await authService.register(data);

      if (response.success && response.data) {
        const { token, ...userData } = response.data;
        login(userData, token);
        toast.success("Registration successful!");

        // Redirect based on role
        const redirectPath =
          userData.role === "OWNER" ? "/owner/dashboard" : "/user/dashboard";
        router.push(redirectPath);
      } else {
        toast.error(response.message || "Registration failed");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-xl px-6">
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

        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Create your account
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Join thousands of users finding their perfect rental home
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
                      placeholder="Choose a username"
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
                    htmlFor="fullName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                      <UserCheck className="h-4 w-4 text-gray-500" />
                    </div>
                    <Input
                      id="fullName"
                      {...register("fullName")}
                      disabled={loading}
                      className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    disabled={loading}
                    className={`pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm ${watchedEmail && !isEmailValid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                    placeholder="Enter your email"
                  />
                </div>
                {watchedEmail && !isEmailValid && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    Invalid email address
                  </p>
                )}
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
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
                      className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
                      placeholder="Create a password"
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

                  {/* Password validation indicators - only show when password is entered and not all validations pass */}
                  {watchedPassword && !isPasswordValid && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-gray-700 mb-2">
                        Password requirements:
                      </p>
                      <div className="space-y-1">
                        <div
                          className={`flex items-center gap-2 text-xs ${passwordChecks.minLength
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
                          className={`flex items-center gap-2 text-xs ${passwordChecks.hasUppercase
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
                          className={`flex items-center gap-2 text-xs ${passwordChecks.hasLowercase
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
                          className={`flex items-center gap-2 text-xs ${passwordChecks.hasNumber
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

                <div className="space-y-2">
                  <Label
                    htmlFor="phoneNumber"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone Number (Optional)
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                      <Phone className="h-4 w-4 text-gray-500" />
                    </div>
                    <Input
                      id="phoneNumber"
                      {...register("phoneNumber")}
                      onChange={handlePhoneNumberChange}
                      disabled={loading}
                      className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
                      placeholder="0xxxxxxxxx"
                    />
                  </div>

                  {/* Phone number validation indicators */}
                  {watchedPhoneNumber && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-gray-700 mb-2">
                        Phone number requirements:
                      </p>
                      <div className="space-y-1">
                        <div
                          className={`flex items-center gap-2 text-xs ${phoneChecks.startsWithZero
                            ? "text-green-600"
                            : "text-gray-500"
                            }`}
                        >
                          {phoneChecks.startsWithZero ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          Must start with 0
                        </div>
                        <div
                          className={`flex items-center gap-2 text-xs ${phoneChecks.minLength
                            ? "text-green-600"
                            : "text-gray-500"
                            }`}
                        >
                          {phoneChecks.minLength ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          At least 9 digits
                        </div>
                        <div
                          className={`flex items-center gap-2 text-xs ${phoneChecks.onlyNumbers
                            ? "text-green-600"
                            : "text-gray-500"
                            }`}
                        >
                          {phoneChecks.onlyNumbers ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          Numbers only
                        </div>
                      </div>
                    </div>
                  )}

                  {errors.phoneNumber && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="role"
                  className="text-sm font-medium text-gray-700"
                >
                  I want to
                </Label>
                <Select onValueChange={handleRoleChange}>
                  <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm w-full">
                    <SelectValue placeholder="Select your role">
                      {selectedRole
                        ? getRoleDisplayName(selectedRole)
                        : "Select your role"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER" className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Home className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            Rental
                          </div>
                          <div className="text-sm text-gray-500">
                            I'm looking to rent a property
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="OWNER" className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            House Owner
                          </div>
                          <div className="text-sm text-gray-500">
                            I want to list and manage my properties
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.role.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !isPasswordValid || !isPhoneValid || !isEmailValid || !selectedRole}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
