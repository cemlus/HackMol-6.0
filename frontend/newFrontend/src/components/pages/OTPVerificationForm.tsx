import { useState } from "react"

interface OTPVerificationFormProps {
  aadhaarNumber: string
  onSuccess: () => void
}

const OTPVerificationForm: React.FC<OTPVerificationFormProps> = ({ aadhaarNumber, onSuccess }) => {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      setError("Enter a valid 6-digit OTP.")
      return
    }

    setError("")
    setLoading(true)
    try {
      const response = await fetch("https://backend.topishukla.xyz/aadhaar/verifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhaar_number: aadhaarNumber, otp }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || "OTP verification failed.")
      }

      onSuccess()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Verify OTP</h2>
      <p className="text-sm text-gray-500">Sent to Aadhaar-linked mobile</p>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="6-digit OTP"
        className="p-2 border border-gray-300 rounded-md"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleVerify}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  )
}

export default OTPVerificationForm