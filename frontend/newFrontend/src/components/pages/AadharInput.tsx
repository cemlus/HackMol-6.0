import { Shield } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"
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
  const navigate = useNavigate()

  return (
    <div className="bg-gray-50 flex flex-col">
{/* 
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
              href="#features"
              className="text-sm font-medium hover:text-[#2A3B7D]"
            >
              Features
            </a>
            <a
              href="#about"
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
      </header> */}
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
    </div>
  )
}

export default AadhaarInput