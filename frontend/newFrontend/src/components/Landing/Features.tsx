import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "../ui/card"
import { Lock, Smartphone, Zap, Map } from "lucide-react"

export function Features () {
    return (
        <section id="features" className="py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#2A3B7D]">
                  Key Features
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform combines cutting-edge technology with user-friendly design
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
              <Card className="border-2 border-[#2A3B7D]/10 hover:border-[#2A3B7D]/30 transition-all">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-[#FF4D4D]/10 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-[#FF4D4D]" />
                  </div>
                  <CardTitle>AI-Powered Urgency Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Our AI analyzes reports to prioritize critical emergencies for faster response.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#2A3B7D]/10 hover:border-[#2A3B7D]/30 transition-all">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-[#2A3B7D]/10 flex items-center justify-center mb-4">
                    <Lock className="h-6 w-6 text-[#2A3B7D]" />
                  </div>
                  <CardTitle>Blockchain-Tamper Proof FIRs</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    All reports are secured on blockchain, making them immutable and verifiable.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#2A3B7D]/10 hover:border-[#2A3B7D]/30 transition-all">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-[#4CAF50]/10 flex items-center justify-center mb-4">
                    <Map className="h-6 w-6 text-[#4CAF50]" />
                  </div>
                  <CardTitle>Real-Time Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Monitor your case status, and officer details in real-time.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#2A3B7D]/10 hover:border-[#2A3B7D]/30 transition-all">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-[#FF4D4D]/10 flex items-center justify-center mb-4">
                    <Smartphone className="h-6 w-6 text-[#FF4D4D]" />
                  </div>
                  <CardTitle>No App Needed</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    File reports via SMS, WhatsApp, or web – accessible to everyone, everywhere.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
    )
}