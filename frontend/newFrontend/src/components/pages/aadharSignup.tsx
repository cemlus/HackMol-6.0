import { useState } from "react"
import AadhaarInput from "./AadharInput"
import OTPVerificationForm from "./OTPVerificationForm"

const SignupWithAadhaar = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState("")
  const [isOtpSent, setIsOtpSent] = useState(false)

  const handleAadhaarSubmit = async (aadhaar: string) => {
    try {
      const response = await fetch("https://backend.topishukla.xyz/aadhaar/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhaar_number:aadhaar }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || "Failed to send OTP.")
      }

      setAadhaarNumber(aadhaar)
      setIsOtpSent(true)
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleOTPSuccess = () => {
    alert("Signup successful!")
    // Redirect or show next screen
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      {!isOtpSent ? (
        <AadhaarInput onSubmit={handleAadhaarSubmit} />
      ) : (
        <OTPVerificationForm aadhaarNumber={aadhaarNumber} onSuccess={handleOTPSuccess} />
      )}
    </div>
  )
}

export default SignupWithAadhaar