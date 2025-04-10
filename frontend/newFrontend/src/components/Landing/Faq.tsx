import { motion } from "framer-motion"
import { ChevronDown, CheckCircle2 } from "lucide-react"
import { Accordion, AccordionTrigger, AccordionItem, AccordionContent } from "../ui/accordion"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

type ContentPart = {
  text?: string;
  tooltip?: string;
  list?: string[];
  demo?: string;
}

export function FAQ() {
  const faqItems = [
    {
      value: "item-1",
      question: "Is my data secure?",
      answer: {
        content: [
          "Your FIR data is secured using ",
          { text: "blockchain", tooltip: "Decentralized, tamper-proof digital ledger technology" },
          " technology and ",
          { text: "IPFS", tooltip: "InterPlanetary File System - Distributed storage protocol" },
          " encryption. Once your report is filed:",
          {
            list: [
              "Cannot be altered or deleted by anyone",
              "Personal information remains encrypted",
              "Accessible only to authorized personnel"
            ]
          }
        ]
      }
    },
    {
      value: "item-2",
      question: "What if I don't have a smartphone?",
      answer: {
        content: [
          "CivicShield is accessible through multiple channels:",
          {
            list: [
              "Basic SMS from any mobile phone",
              "Web portal from desktop computers",
              "Community center partnerships"
            ]
          },
          {
          }
        ]
      }
    },
    {
      value: "item-3",
      question: "How does blockchain help?",
      answer: {
        content: [
          "FIRs are locked like ",
          { text: "Bitcoin", tooltip: "First decentralized cryptocurrency using blockchain" },
          " transactions with:",
          {
            list: [
              "Permanent, tamper-proof records",
              "Decentralized verification system",
              "Transparent audit trail",
              "Immutable timestamps"
            ]
          }
        ]
      }
    }
  ]

  return (
    <section id="faq" className="py-20 bg-gray-100">
      <div className="container px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#2A3B7D]">
            Frequently Asked Questions
          </h2>
          <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Get answers to common questions about CivicShield
          </p>
        </motion.div>

        <motion.div 
          className="mx-auto max-w-3xl mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={item.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AccordionItem 
                  value={item.value}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                    <motion.div className="flex items-center justify-between w-full">
                      <span className="text-left font-medium text-gray-800 group-hover:text-[#2A3B7D] transition-colors">
                        {item.question}
                      </span>
                      <motion.div
                        animate={{ rotate: 180 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-600 group-hover:text-[#2A3B7D]"
                      >
                        <ChevronDown className="h-5 w-5 transition-transform" />
                      </motion.div>
                    </motion.div>
                  </AccordionTrigger>

                  <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.answer.content.map((contentPart : ContentPart, partIndex) => {
                        if (typeof contentPart === 'string') {
                          return <span key={partIndex}>{contentPart}</span>
                        }
                        
                        if (contentPart.list) {
                          return (
                            <ul key={partIndex} className="mt-3 space-y-2">
                              {contentPart.list.map((listItem, listIndex) => (
                                <li key={listIndex} className="flex items-start gap-2">
                                  <CheckCircle2 className="h-5 w-5 text-[#2A3B7D] mt-0.5 flex-shrink-0" />
                                  <span>{listItem}</span>
                                </li>
                              ))}
                            </ul>
                          )
                        }

                        return (
                          <Tooltip key={partIndex}>
                            <TooltipTrigger className="border-b border-dashed border-[#2A3B7D] mx-1">
                              {contentPart.text}
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[200px] text-center">
                              {contentPart.tooltip}
                            </TooltipContent>
                          </Tooltip>
                        )
                      })}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}