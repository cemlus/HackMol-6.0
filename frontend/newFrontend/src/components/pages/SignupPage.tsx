import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as React from "react"
import { z } from "zod"
import axios from "axios"
import { Shield, Upload, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { FooterSmall } from "../FooterSmall"
import { useNavigate } from "react-router-dom"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

// Zod validation schema for signup
const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  signature: z.instanceof(File, { message: "Signature is required" })
    .refine(file => ["image/jpeg", "image/png", "application/pdf"].includes(file.type), 
      "Please upload a JPG, PNG, or PDF file")
})

// OTP Validation Schema
const otpFormSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

type SignupFormValues = z.infer<typeof signupSchema>
type OtpFormValues = z.infer<typeof otpFormSchema>

// Custom hook for countdown timer
const useCountdown = () => {
  const [secondsLeft, setSecondsLeft] = React.useState(0)

  React.useEffect(() => {
    if (secondsLeft <= 0) return

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [secondsLeft])

  const startCountdown = (seconds: number) => {
    setSecondsLeft(seconds)
  }

  return [secondsLeft, startCountdown] as const
}

const SignupPage = () => {
  // Form and state for Signup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
    trigger,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema)
  })

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [signupSuccess, setSignupSuccess] = useState(false)
  
  // State for OTP verification flow
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otpError, setOtpError] = useState<string | null>(null)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [secondsLeft, startCountdown] = useCountdown()

  // Initialize OTP form
  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      code: "",
    },
  })
  
  const signatureFile = watch("signature")
  const previewUrl = signatureFile ? URL.createObjectURL(signatureFile) : undefined

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setValue("signature", file)
    await trigger("signature")
  }

  // Handle signup form submission
  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true)
      setSubmitError(null)

      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })

      // Send signup data to the server
      const response = await axios.post("http://localhost:8000/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })

      if (response.status === 200) {
        setSignupSuccess(true)
        setPhoneNumber(data.phone)
        
        // Trigger OTP flow after successful signup
        try {
          // Mock request to send OTP to the user's phone
          await axios.post("http://localhost:8000/send-otp", {
            phone: data.phone
          })
          setShowOtpVerification(true)
          startCountdown(30) // 30 seconds cooldown for resend
        } catch (otpError) {
          setSubmitError("Failed to send verification code. Please try again.")
        }
      }
    } catch (error) {
      let errorMessage = "An error occurred during registration. Please try again."
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage
      }
      setSubmitError(errorMessage)
      setError("root", { message: errorMessage })
    } finally {
      setIsLoading(false)
    }
  })

  // Verify OTP code
  const verifyOTP = async (code: string) => {
    try {
      // Replace with your actual OTP verification endpoint
      const response = await axios.post("http://localhost:8000/verify-otp", {
        phone: phoneNumber,
        code
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Invalid OTP code")
      }
      throw new Error("Failed to verify OTP")
    }
  }

  // Handle OTP form submission
  const onOtpSubmit = async (values: OtpFormValues) => {
    try {
      setOtpError("")
      await verifyOTP(values.code)
      setIsOtpVerified(true)
      
      // After successful verification, redirect to signin page after a delay
      setTimeout(() => navigate("/signin"), 2000)
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : "Invalid OTP code")
    }
  }

  // Handle OTP resend
  const handleResendOTP = async () => {
    try {
      await axios.post("http://localhost:8000/resend-otp", {
        phone: phoneNumber
      })
      startCountdown(30) // 30 seconds cooldown
      setOtpError(null)
    } catch (err) {
      setOtpError("Failed to resend OTP. Please try again.")
    }
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#2A3B7D]" />
            <span className="text-xl font-bold text-[#2A3B7D]">
              CivicShield
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
              href="/#about"
              className="text-sm font-medium hover:text-[#2A3B7D]"
            >
              About
            </a>
          </nav>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-[#2A3B7D] text-[#2A3B7D]"
              onClick={() => {
                navigate("/signin");
              }}
            >
              Log In
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        {!showOtpVerification ? (
          <div className="w-full max-w-4xl">
            <div className="bg-white shadow-xl rounded-lg p-8 flex gap-8">
              <div className="flex-1 space-y-6 border-r border-gray-200 pr-8">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-[#2A3B7D]">
                    Create <span className="text-black font-bold underline">User</span> Account
                  </h1>
                  <p className="text-gray-500 mt-2">
                    Join CivicShield to report and track emergencies
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      className={cn("w-full", errors.name && "border-red-500")}
                      placeholder="John Doe"
                    />
                    <ErrorMsg message={errors.name?.message} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      {...register("email")}
                      className={cn("w-full", errors.email && "border-red-500")}
                      placeholder="john.doe@example.com"
                    />
                    <ErrorMsg message={errors.email?.message} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                      className={cn("w-full", errors.password && "border-red-500")}
                      placeholder="••••••••"
                    />
                    <ErrorMsg message={errors.password?.message} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      className={cn("w-full", errors.phone && "border-red-500")}
                      placeholder="+1 (555) 000-0000"
                    />
                    <ErrorMsg message={errors.phone?.message} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      {...register("address")}
                      className={cn("w-full", errors.address && "border-red-500")}
                      placeholder="123 Main St, City, Country"
                    />
                    <ErrorMsg message={errors.address?.message} />
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-8 flex flex-col">
                <div className="flex-1">
                  <Label htmlFor="signature" className="block mb-4">
                    Signature (JPG, PNG, or PDF)
                  </Label>
                  <div className="h-full flex flex-col">
                    <div className={cn(
                      "border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors",
                      errors.signature ? "border-red-500" : "border-gray-300",
                      signatureFile && "border-green-500 bg-green-50 hover:bg-green-50"
                    )}>
                      <input
                        id="signature"
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.pdf"
                      />
                      <label htmlFor="signature" className="cursor-pointer block">
                        {signatureFile ? (
                          <div className="flex flex-col items-center">
                            {signatureFile.type.startsWith("image/") ? (
                              <div className="mb-2 h-32 flex items-center justify-center">
                                <img
                                  src={previewUrl}
                                  alt="Signature preview"
                                  className="max-h-32 max-w-full object-contain"
                                />
                              </div>
                            ) : (
                              <div className="mb-2 text-[#2A3B7D] h-32 flex items-center justify-center">
                                <div className="flex flex-col items-center">
                                  <Upload className="h-12 w-12 text-[#2A3B7D]" />
                                  <span className="text-sm mt-2">PDF Document</span>
                                </div>
                              </div>
                            )}
                            <span className="text-sm text-gray-700 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                              {signatureFile.name}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              Click to change
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-12 w-12 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-700">
                              Click to upload your signature
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              JPG, PNG, or PDF
                            </span>
                          </div>
                        )}
                      </label>
                    </div>
                    <ErrorMsg message={errors.signature?.message} />
                  </div>
                </div>

                <div className="space-y-6 border-t border-gray-200 pt-6">
                  <Button
                    type="submit"
                    onClick={onSubmit}
                    className="w-full bg-[#2A3B7D] hover:bg-[#1e2a5a] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <a href="/signin" className="text-[#2A3B7D] hover:underline font-medium">
                        Log in
                      </a>
                    </p>
                  </div>

                  {submitError && (
                    <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm">
                      <p className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {errors.root?.message || "An error occurred during registration"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // OTP Verification Section
          <div className="w-full max-w-md">
            <div className="bg-white shadow-xl rounded-lg p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#2A3B7D]/10 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-[#2A3B7D]" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-[#2A3B7D]">Verify Your Account</h1>
                <p className="text-gray-500 mt-2">
                  Enter the 6-digit code sent to {phoneNumber}
                </p>
              </div>

              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                  <FormField
                    control={otpForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center">
                        <FormControl>
                          <InputOTP
                            maxLength={6}
                            {...field}
                            disabled={isOtpVerified}
                          >
                            <InputOTPGroup>
                              {[...Array(6)].map((_, index) => (
                                <InputOTPSlot
                                  key={index}
                                  index={index}
                                  className="h-14 w-12 text-lg border-2 data-[state=active]:border-[#2A3B7D]"
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {otpError && (
                    <p className="text-center text-sm font-medium text-red-500">
                      {otpError}
                    </p>
                  )}

                  {isOtpVerified ? (
                    <div className="text-center text-green-600 p-3 bg-green-100 border border-green-300 rounded-md">
                      <p className="flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Account verified successfully! Redirecting to login...
                      </p>
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full bg-[#2A3B7D] hover:bg-[#1e2a5a] text-white"
                      disabled={otpForm.formState.isSubmitting}
                    >
                      {otpForm.formState.isSubmitting ? "Verifying..." : "Verify OTP"}
                    </Button>
                  )}

                  <div className="text-center text-sm">
                    {secondsLeft > 0 ? (
                      <span>
                        Resend OTP in {Math.floor(secondsLeft / 60)}:
                        {String(secondsLeft % 60).padStart(2, '0')}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        className="text-[#2A3B7D] underline hover:text-[#1e2a5a]"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          </div>
        )}
      </main>

      <FooterSmall />
    </div>
  )
}

const ErrorMsg = ({ message }: { message?: string }) => (
  message && (
    <p className="text-red-500 text-sm mt-1 flex items-center">
      <AlertCircle className="h-4 w-4 mr-1" />
      {message}
    </p>
  )
)

export default SignupPage