import { useState } from "react"

interface AadhaarInputProps {
  onSubmit: (aadhaar: string) => void
}

const AadhaarInput: React.FC<AadhaarInputProps> = ({ onSubmit }) => {
  const [aadhaar, setAadhaar] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const aadhaarRegex = /^\d{12}$/
    if (!aadhaarRegex.test(aadhaar)) {
      setError("Enter a valid 12-digit Aadhaar number.")
      return
    }

    setError("")
    setLoading(true)
    await onSubmit(aadhaar)
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Enter Aadhaar Number</h2>
      <input
        type="text"
        value={aadhaar}
        onChange={(e) => setAadhaar(e.target.value)}
        placeholder="12-digit Aadhaar number"
        className="p-2 border border-gray-300 rounded-md"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </div>
  )
}

export default AadhaarInput