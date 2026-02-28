import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Target, Eye, Shield, Users, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const principles = [
  { icon: Shield, label: "Security first" },
  { icon: Code2, label: "Local control" },
  { icon: Eye, label: "Transparent architecture" },
  { icon: Users, label: "User ownership" },
  { icon: Target, label: "Simplicity over complexity" },
];

export default function About() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Cetra</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We build tools that remove friction from crypto automation.
            Cetra exists to eliminate manual grind and give users back their time.
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Mission</h2>
              </div>
              <div className="pl-16 space-y-4 text-muted-foreground leading-relaxed">
                <p>Crypto users spend thousands of hours repeating simple actions.</p>
                <p className="text-white font-semibold text-lg">
                  Automate the routine. Amplify productivity. Make advanced tools accessible to everyone.
                </p>
                <p>No coding. No complexity. Just workflows.</p>
              </div>
            </Card>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold">Vision</h2>
              </div>
              <div className="pl-16 space-y-4 text-muted-foreground leading-relaxed">
                <p>We believe the future of crypto is automation-first.</p>
                <p>
                  Cetra aims to become the operating layer for automated participation in 
                  decentralized ecosystems. From individual users, to teams, to large-scale 
                  workflow infrastructure.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Principles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Principles</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {principles.map((p) => (
                  <div key={p.label} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <p.icon className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">{p.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-6">We design tools people actually want to use.</p>
            </Card>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Team</h2>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>Cetra is built by crypto-native builders focused on infrastructure and automation.</p>
                <p>We prioritize product quality over hype. Our goal is long-term ecosystem value.</p>
              </div>
            </Card>
          </motion.div>

          {/* Community */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Community</h2>
              <p className="text-muted-foreground mb-4">Cetra grows with its users. Join our community to:</p>
              <ul className="space-y-2 text-muted-foreground">
                {["Share workflows", "Suggest features", "Report bugs", "Shape the roadmap"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-primary/80 italic mt-4">We build in public.</p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
