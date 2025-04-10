import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Shield, FileText, Mic, Paperclip, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import ComplaintForm from "../Complaints/ComplaintForm"
import { FooterSmall } from '../FooterSmall';
import { VoiceComplaint } from "../Complaints/VoiceComplaint"
import { AddEvidence } from "@/components/Complaints/AddEvidence"

type ComplaintMethod = "form" | "voice" | "evidence" | null

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

const pageTransition = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
  transition: { duration: 0.3 }
}

const FileComplaintPage: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<ComplaintMethod>(null)

  const handleMethodSelect = (method: ComplaintMethod) => {
    setSelectedMethod(method)
  }

  const handleBack = () => {
    setSelectedMethod(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 w-full border-b bg-white"
      >
        <div className="flex h-16 items-center justify-between px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <Shield className="h-6 w-6 text-[#2A3B7D]" />
            <span className="text-xl font-bold text-[#2A3B7D]">CivicShield</span>
          </motion.div>
          <nav className="hidden md:flex gap-6">
            {/* Navigation items */}
          </nav>
          <div className="flex gap-4">
            <Button variant="outline" className="border-[#2A3B7D] text-[#2A3B7D]" asChild>
              <a href="/signin">Log In</a>
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {selectedMethod === null ? (
            <motion.div
              key="methods"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="py-12 px-4 w-full"
            >
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-12"
                >
                  <h1 className="text-3xl md:text-4xl font-bold text-[#2A3B7D] mb-4">
                    File Your Complaint – Your Way
                  </h1>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Choose the method that works best for you: Structured form, voice call, or evidence addition.
                  </p>
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {["form", "voice", "evidence"].map((method, index) => (
                    <motion.div
                      key={method}
                      variants={itemVariants}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={cn(
                          "border-2 transition-all duration-300 hover:shadow-lg cursor-pointer",
                          "hover:border-[#2A3B7D]"
                        )}
                        onClick={() => handleMethodSelect(method as ComplaintMethod)}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <CardHeader className="text-center">
                            <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                              {method === "form" && <FileText className="h-8 w-8 text-[#2A3B7D]" />}
                              {method === "voice" && <Mic className="h-8 w-8 text-[#FF4D4D]" />}
                              {method === "evidence" && <Paperclip className="h-8 w-8 text-gray-600" />}
                            </div>
                            <CardTitle className="text-xl">
                              {method === "form" && "Detailed Digital Form"}
                              {method === "voice" && "Voice Report"}
                              {method === "evidence" && "Add to Existing Case"}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-center min-h-[80px]">
                              {method === "form" && "For comprehensive reporting with AI guidance, evidence uploads, and real-time tracking."}
                              {method === "voice" && "Describe your emergency verbally via call. Available 24/7 in 50+ languages."}
                              {method === "evidence" && "Upload photos/videos to an open complaint using your blockchain case ID."}
                            </CardDescription>
                          </CardContent>
                          <CardFooter className="flex justify-center">
                            <Button className={cn(
                              "bg-[#2A3B7D] hover:bg-[#1e2a5a] text-white",
                              method === "voice" && "bg-[#FF4D4D] hover:bg-[#e63e3e]",
                              method === "evidence" && "bg-gray-700 hover:bg-gray-800"
                            )}>
                              {method === "form" && "Start Form"}
                              {method === "voice" && "Record Now"}
                              {method === "evidence" && "Enter Case ID"}
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </motion.div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="selected"
              {...pageTransition}
              className="container py-8 px-4"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Button
                  variant="ghost"
                  className="mb-6 text-[#2A3B7D]"
                  onClick={handleBack}
                  whilehover={{ scale: 1.05 }}
                  whiletap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back to options
                </Button>
              </motion.div>

              <AnimatePresence mode="wait">
                {selectedMethod === "form" && (
                  <motion.div {...pageTransition}>
                    <ComplaintForm />
                  </motion.div>
                )}
                {selectedMethod === "voice" && (
                  <motion.div {...pageTransition}>
                    <VoiceComplaint />
                  </motion.div>
                )}
                {selectedMethod === "evidence" && (
                  <motion.div {...pageTransition}>
                    <AddEvidence />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <FooterSmall />
    </div>
  )
}

export default FileComplaintPage