import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqData = [
  {
    question: "What is Cetra?",
    answer: "Cetra is a crypto automation platform that lets you build and run workflows without coding. You connect actions, triggers and chains — Cetra executes everything automatically.",
  },
  {
    question: "Do I need coding skills?",
    answer: "No. Cetra is built for non-developers. Everything works through a visual drag-and-drop builder.",
  },
  {
    question: "Is my wallet safe?",
    answer: "Yes. Cetra never stores your private keys. All operations are executed through secure signing and encrypted connections.",
  },
  {
    question: "Which chains are supported?",
    answer: "Cetra supports major ecosystems like Ethereum, Solana, and L2 networks. More chains are added continuously.",
  },
  {
    question: "What can I automate?",
    answer: "Airdrops, testnets, swaps, wallet routines, farming workflows and repetitive crypto actions. You build it once — Cetra runs it 24/7.",
  },
  {
    question: "Can I stop automation anytime?",
    answer: "Yes. You have full control. Pause, edit or delete workflows instantly.",
  },
  {
    question: "How do I get support?",
    answer: "Through our Discord and Telegram community. Direct support is available for active subscribers.",
  },
  {
    question: "Is Cetra early access?",
    answer: "We’re actively improving the platform and adding features every month.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about Cetra
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-white/10 bg-white/5 rounded-2xl overflow-hidden px-6 transition-all data-[state=open]:border-primary/50 data-[state=open]:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
              >
                <AccordionTrigger className="text-left text-lg font-medium py-6 hover:no-underline hover:text-primary transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
