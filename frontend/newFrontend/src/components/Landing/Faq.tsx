import { Accordion, AccordionTrigger, AccordionItem, AccordionContent } from "../ui/accordion"
export function FAQ () {
    return (
        <section id="faq" className="py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#2A3B7D]">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get answers to common questions about CivicShield
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl mt-12">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left font-medium">Is my data secure?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Absolutely. Your FIR data is secured using blockchain technology and IPFS encryption. This means
                      once your report is filed, it cannot be altered or deleted by anyone – not even us. All personal
                      information is encrypted and only accessible to authorized personnel.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left font-medium">
                    What if I don't have a smartphone?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      CivicShield is designed to be accessible to everyone. You can file reports using basic SMS from
                      any mobile phone. Simply text your emergency details to our designated number, and our system will
                      process your report just like it would through the app or website.
                    </p>
                    <div className="mt-4 aspect-video bg-gray-200 rounded flex items-center justify-center">
                      SMS Demo Video
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left font-medium">How does blockchain help?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      FIRs are locked like Bitcoin transactions – uneditable, forever. When you file a report, it's
                      recorded on a decentralized blockchain, creating a permanent, tamper-proof record. This prevents
                      unauthorized modifications, deletions, or backdating of reports, ensuring accountability and
                      transparency in the emergency response system.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
    )
}