import { motion } from "framer-motion"
import { ShieldCheck, Lock, Clock, Users } from "lucide-react"

export function AboutUs() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Immutable Records",
      description: "Blockchain-powered FIR system prevents tampering"
    },
    {
      icon: Lock,
      title: "Transparent Tracking",
      description: "Real-time case updates for citizens and authorities"
    },
    {
      icon: Clock,
      title: "Rapid Response",
      description: "AI-powered urgency detection speeds up responses"
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "Designed with input from citizens and officers"
    }
  ]

  return (
    <section id="about" className="py-20 bg-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-[#2A3B7D] rounded-full blur-3xl -top-40 -right-40" />
      </div>

      <div className="container px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto space-y-12"
        >
          {/* Hero Section */}
          <div className="space-y-6 text-center">
            <motion.h2 
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#2A3B7D]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              Rebuilding Trust in 
              <span className="relative inline-block mx-2">
                Emergency Response
                <motion.div 
                  className="absolute bottom-0 left-0 w-full h-1 bg-[#2A3B7D]"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 1 }}
                />
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-600 font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Creating accountability through blockchain technology
            </motion.p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-white rounded-xl border border-gray-100 hover:border-[#2A3B7D] transition-all group"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-[#2A3B7D]/10 rounded-full">
                    <feature.icon className="h-8 w-8 text-[#2A3B7D]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Story Sections */}
          <div className="space-y-8">
            <motion.div
              className="grid md:grid-cols-2 gap-8 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[#2A3B7D]">Our Origin Story</h3>
                <p className="text-gray-600">
                  CivicShield was born from personal experiences with emergency response inefficiencies. 
                  After witnessing firsthand the challenges citizens face in getting their reports acknowledged, 
                  our team of technologists and civic activists came together to build a solution that 
                  <span className="font-medium text-[#2A3B7D]"> puts power back in citizens' hands</span>.
                </p>
              </div>
              <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center">
                <span className="text-gray-400">Timeline Infographic</span>
              </div>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 gap-8 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center">
                <span className="text-gray-400">System Architecture</span>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[#2A3B7D]">Technology That Protects</h3>
                <p className="text-gray-600">
                  Our hybrid architecture combines blockchain's immutability with AI's analytical power. 
                  Each report is processed through our proprietary urgency detection algorithm before being 
                  permanently recorded on a decentralized ledger. This dual approach ensures both 
                  <span className="font-medium text-[#2A3B7D]"> speed and security</span> in every interaction.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="text-center py-8 border-t border-gray-100"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-[#2A3B7D] mb-4">Our Vision for the Future</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We envision a world where emergency response systems work equally well for all citizens, 
                regardless of location or socioeconomic status. By 2025, we aim to partner with 
                <span className="font-medium text-[#2A3B7D]"> 100+ municipalities</span> and reduce 
                emergency response times by 
                <span className="font-medium text-[#2A3B7D]"> 40%</span> in served communities.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}