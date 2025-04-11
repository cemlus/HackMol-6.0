import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import axios from "axios"

// OTP Validation Schema
const otpFormSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

export function OTPVerificationForm({ aadhaarNumber, onSuccess }) {
  const [error, setError] = React.useState("")
  const [isVerified, setIsVerified] = React.useState(false)
  const [secondsLeft, startCountdown] = useCountdown()
  
  // Initialize the form
  const form = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      code: "",
    },
  })

  React.useEffect(() => {
    // Request OTP when component mounts
    handleRequestOTP();
  }, []);

  // Request OTP from backend
  const handleRequestOTP = async () => {
    try {
      await axios.post('/aadhaar/verify', { aadhaar_number: aadhaarNumber });
      startCountdown(30); // 30 seconds cooldown
    } catch (err) {
      const errorMessage = err?.response?.data?.error || "Failed to send OTP";
      setError(errorMessage);
    }
  }

  // Verify OTP code
  const verifyOTP = async (code) => {
    try {
      const response = await axios.post('/aadhaar/verifyOtp', { 
        aadhaar_number: aadhaarNumber,
        otp: code 
      });
      return response.data;
    } catch (err) {
      throw new Error(err?.response?.data?.error || "Failed to verify OTP");
    }
  }

  // Handle form submission
  const onSubmit = async (values) => {
    try {
      setError("");
      const result = await verifyOTP(values.code);
      setIsVerified(true);
      
      // Call onSuccess callback after verification
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }
    } catch (err) {
      setError(err.message || "Invalid OTP code");
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Verify Your Aadhaar</h1>
        <p className="text-muted-foreground mt-2">
          Enter the 6-digit code sent to your registered mobile number
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Aadhaar: {aadhaarNumber?.replace(/(\d{4})/g, '$1 ').trim()}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    {...field}
                    disabled={isVerified}
                  >
                    <InputOTPGroup>
                      {[...Array(6)].map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="h-14 w-12 text-lg border-2 data-[state=active]:border-primary"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <p className="text-center text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          {isVerified ? (
            <div className="text-center text-green-600">
              Verification successful! Redirecting...
            </div>
          ) : (
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Verifying..." : "Verify OTP"}
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
                onClick={handleRequestOTP}
                className="text-primary underline hover:text-primary/80"
              >
                Resend OTP
              </button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}

// useCountdown hook implementation
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

  return [secondsLeft, startCountdown]
}