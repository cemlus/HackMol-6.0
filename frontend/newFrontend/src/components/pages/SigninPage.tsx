import type React from "react";
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Shield, AlertCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

type LoginFormData = {
  email: string;
  password: string;
};

const SigninPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setLoginError(null);

    try {
      const response = await axios.post("https://backend.topishukla.xyz/login", data, {
        withCredentials: true,
      });
      if (response.data.err) {
        setError("root", {
          type: "server",
          message: response.data.err,
        });
      } else if (response.data.redirect) {
        console.log("Redirecting to:", response.data.redirect);
        navigate(`/${response.data.redirect}`);
      }
      // Handle successful login
      // navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      // Set error message
      setLoginError("Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#2A3B7D]" />
            <span className="text-xl font-bold text-[#2A3B7D]">
              CivicSentinel
            </span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="/" className="text-sm font-medium hover:text-[#2A3B7D]">
              Home
            </a>
            <a
              href="/fileComplaint"
              className="text-sm font-medium hover:text-[#2A3B7D]"
            >
              File Complaint
            </a>
            <a
              href="#about"
              className="text-sm font-medium hover:text-[#2A3B7D]"
            >
              About
            </a>
          </nav>
          <div className="flex gap-2">
            <Button
              className="hidden sm:block text-[#1e2a5a] hover:bg-[#2A3B7D] bg-[white] border hover:text-[white] transition-all ease-in"
              onClick={() => {
                navigate("/signup/user");
              }}
            >
              Citizens
            </Button>
            <Button
              className="hidden sm:block text-[#1e2a5a] hover:bg-[#2A3B7D] bg-[white] border hover:text-[white] cursor-pointer  transition-all ease-in"
              onClick={() => {
                navigate("/signup/police");
              }}
            >
              Officers
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-xl rounded-lg p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[#2A3B7D]/10 flex items-center justify-center">
                  <LogIn className="h-8 w-8 text-[#2A3B7D]" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-[#2A3B7D]">
                Welcome Back
              </h1>
              <p className="text-gray-500 mt-2">
                Log in to your CivicSentinel account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  className={cn(
                    "w-full",
                    errors.email && "border-red-500 focus-visible:ring-red-500"
                  )}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  className={cn(
                    "w-full",
                    errors.password &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#2A3B7D] hover:bg-[#1e2a5a] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </Button>

              {/* Error Message */}
              {loginError && (
                <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm">
                  <p className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {loginError}
                  </p>
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <span className="font-semibold"> Sign up</span> as a{" "}
                <a
                  href="/signup/user"
                  className="text-[#2A3B7D] hover:underline font-bold"
                >
                  User
                </a>
                <span> or </span>
                <a
                  href="/signup/police"
                  className="text-[#2A3B7D] hover:underline font-bold"
                >
                  Officer
                </a>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <p className="text-xs text-center text-gray-500">
                  By logging in, you agree to our{" "}
                  <a href="/terms" className="text-[#2A3B7D] hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-[#2A3B7D] hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#2A3B7D] text-white py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-bold">CivicSentinel</span>
            </div>
            <div className="text-sm text-white/70">
              © 2025 CivicSentinel. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SigninPage;
