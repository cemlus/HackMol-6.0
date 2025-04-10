import { Smartphone, Map, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export function HowItWorks() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  
  const steps = [
    {
      number: 1,
      title: "Report",
      icon: Smartphone,
      description: "Submit your emergency report via SMS, WhatsApp, or web form with location and details.",
      techTerms: []
    },
    {
      number: 2,
      title: "Track",
      icon: Map,
      description: "Access your live map showing the nearby police staion's location for better help in an emergency.",
      techTerms: ["SLA"]
    },
    {
      number: 3,
      title: "Resolve",
      icon: Lock,
      description: "Your FIR is stored on blockchain and evidence secured on IPFS for permanent record.",
      techTerms: ["FIR", "blockchain", "IPFS"]
    }
  ]

  return (
    <section className="w-full py-20 bg-gray-100 relative overflow-hidden">
      <div className="container px-4 md:px-6">
        {/* Animated background elements */}
        <motion.div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 30, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="absolute w-[400px] h-[400px] bg-indigo-100 rounded-full blur-3xl -top-20 -left-20" />
          <div className="absolute w-[400px] h-[400px] bg-blue-100 rounded-full blur-3xl -bottom-20 -right-20" />
        </motion.div>

        <div className="flex flex-col items-center justify-center space-y-4 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-2"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#2A3B7D]">
              How It Works
            </h2>
            <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Three simple steps to report and track emergencies
            </p>
          </motion.div>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12 relative z-10">
          {steps.map((step, index) => (
            <motion.div 
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="group"
              onMouseEnter={() => setHoveredStep(step.number)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div className="flex flex-col items-center w-full text-center space-y-4 relative">
                {/* Animated progress line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-36 w-[22vw] h-0.5 bg-gray-200 overflow-hidden">
                    <motion.div 
                      className="h-full bg-[#2A3B7D]"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      viewport={{ once: true }}
                    />
                  </div>
                )}

                {/* Animated step number */}
                <motion.div 
                  className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  animate={{
                    rotate: hoveredStep === step.number ? [0, -10, 10, 0] : 0,
                    transition: { duration: 0.4 }
                  }}
                >
                  {step.number}
                  {/* Pulse animation */}
                  <motion.div 
                    className="absolute inset-0 rounded-full border-2 border-indigo-300"
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ 
                      scale: 1.4, 
                      opacity: [0, 0.4, 0],
                      transition: { 
                        duration: 2, 
                        repeat: Infinity,
                        delay: index * 0.3
                      }
                    }}
                  />
                </motion.div>

                {/* Content */}
                <div className="space-y-4 px-4">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#2A3B7D] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {step.description.split(' ').map((word, wordIndex) => {
                      const isTechTerm = step.techTerms.some(term => 
                        word.toLowerCase().includes(term.toLowerCase())
                      )
                      return (
                        <span
                          key={wordIndex}
                          className={`relative ${
                            isTechTerm ? 'text-[#2A3B7D] font-medium cursor-help' : ''
                          }`}
                          onMouseEnter={() => {
                            if (isTechTerm) {
                              // Add tooltip logic here
                            }
                          }}
                        >
                          {word}{' '}
                        </span>
                      )
                    })}
                  </p>
                  <motion.div 
                    className="w-full max-w-[200px] aspect-square bg-white rounded-lg flex items-center justify-center shadow-xl group-hover:shadow-xl transition-all mx-auto"
                    whileHover={{ scale: 1.05 }}
                  >
                    <step.icon 
                      className={`h-12 w-12 ${
                        hoveredStep === step.number 
                          ? 'text-indigo-600' 
                          : 'text-[#2A3B7D]'
                      } transition-colors`}
                    />
                    {/* Floating animation */}
                    <motion.div
                      initial={{ y: 0 }}
                      animate={{
                        y: [-5, 5, -5],
                        transition: {
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}