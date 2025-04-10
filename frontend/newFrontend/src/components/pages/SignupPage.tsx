import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { z } from "zod"
import axios from "axios"
import { Shield, Upload, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { FooterSmall } from "../FooterSmall"
import { useNavigate } from "react-router-dom"

// Zod validation schema (unchanged)
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

type SignupFormValues = z.infer<typeof signupSchema>

const SignupPage = () => {
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

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const signatureFile = watch("signature")
  const previewUrl = signatureFile ? URL.createObjectURL(signatureFile) : undefined

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setValue("signature", file)
    await trigger("signature")
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true)
      setSubmitError(null)
      setIsSuccess(false)

      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })

      const response = await axios.post("http://localhost:8000/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })

      if (response.status === 200) {
        setIsSuccess(true)
        setTimeout(() => navigate("/signin"), 2000)
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

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header (unchanged) */}
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

                {isSuccess && (
                  <div className="p-3 bg-green-100 border border-green-300 rounded-md text-green-700 text-sm">
                    <p className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Account created successfully! You can now log in.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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