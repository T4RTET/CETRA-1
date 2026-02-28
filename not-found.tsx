import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, BookOpen, Download, UserCircle, Workflow, Shield, CreditCard, AlertTriangle, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ContentBlock {
  subtitle: string | null;
  text: string | null;
  list?: string[];
  note?: string;
}

interface DocSection {
  id: string;
  icon: typeof BookOpen;
  title: string;
  content: ContentBlock[];
}

const sections: DocSection[] = [
  {
    id: "getting-started",
    icon: BookOpen,
    title: "Getting Started",
    content: [
      {
        subtitle: "What is Cetra?",
        text: "Cetra is a crypto automation platform that helps you run repetitive tasks, testnets, social farming, and workflow actions automatically. You install the agent, configure tasks, and Cetra runs them for you.",
      },
    ],
  },
  {
    id: "installation",
    icon: Download,
    title: "Installation",
    content: [
      {
        subtitle: "Setup Steps",
        text: null,
        list: [
          "Download the Cetra agent",
          "Install it locally on your computer",
          "Login with your account",
          "Choose a workflow",
          "Start automation",
        ],
        note: "The agent runs locally. Your data stays on your device.",
      },
    ],
  },
  {
    id: "account",
    icon: UserCircle,
    title: "Account Setup",
    content: [
      {
        subtitle: null,
        text: null,
        list: [
          "Create an account",
          "Choose a subscription plan",
          "Activate your agent",
          "Connect required wallets/accounts",
        ],
        note: "You can upgrade or cancel anytime.",
      },
    ],
  },
  {
    id: "workflows",
    icon: Workflow,
    title: "Workflows",
    content: [
      {
        subtitle: "What is a workflow?",
        text: "A workflow is a sequence of automated actions. Examples include testnet participation, social tasks, wallet interactions, and airdrop farming routines. Workflows are customizable and designed to save time.",
      },
    ],
  },
  {
    id: "security",
    icon: Shield,
    title: "Security",
    content: [
      {
        subtitle: "Local-first architecture",
        text: null,
        list: [
          "No remote wallet access",
          "No private key storage",
          "Agent runs locally",
          "You control permissions",
        ],
        note: "Security is a core principle.",
      },
    ],
  },
  {
    id: "subscription",
    icon: CreditCard,
    title: "Subscription",
    content: [
      {
        subtitle: "Plans unlock:",
        text: null,
        list: [
          "Automation limits",
          "Workflow access",
          "Premium features",
          "Analytics",
          "Referral rewards",
        ],
        note: "Crypto payments supported.",
      },
    ],
  },
  {
    id: "troubleshooting",
    icon: AlertTriangle,
    title: "Troubleshooting",
    content: [
      {
        subtitle: "Agent not starting?",
        text: null,
        list: [
          "Restart the app",
          "Check internet connection",
          "Update to latest version",
        ],
      },
      {
        subtitle: "Workflow stuck?",
        text: null,
        list: [
          "Stop workflow",
          "Restart agent",
          "Relaunch task",
        ],
        note: "If issues continue, contact support.",
      },
    ],
  },
  {
    id: "support",
    icon: Headphones,
    title: "Support",
    content: [
      {
        subtitle: "Need help?",
        text: "Contact: support@cetra.app. Community: Discord / Telegram. We respond within 24 hours.",
      },
    ],
  },
];

export default function Docs() {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 hover:bg-white/5 group">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Documentation</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to start automating your crypto workflows with Cetra.
            Simple guides. Clear steps. No technical knowledge required.
          </p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </div>
                <div className="space-y-6 pl-16">
                  {section.content.map((block, j) => (
                    <div key={j} className="space-y-3">
                      {block.subtitle && (
                        <h3 className="text-lg font-semibold text-white/90">{block.subtitle}</h3>
                      )}
                      {block.text && (
                        <p className="text-muted-foreground leading-relaxed">{block.text}</p>
                      )}
                      {block.list && (
                        <ul className="space-y-2">
                          {block.list.map((item, k) => (
                            <li key={k} className="flex items-start gap-3 text-muted-foreground">
                              <span className="text-primary font-mono text-sm mt-1">{k + 1}.</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {block.note && (
                        <p className="text-sm text-primary/80 italic mt-2">{block.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
