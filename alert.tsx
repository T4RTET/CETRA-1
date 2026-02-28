import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Starter",
    price: "$19.99",
    period: "/month",
    description: "Start automating in minutes",
    features: [
      "Basic automation workflows",
      "Multi-chain support",
      "Community access",
      "Standard execution speed",
    ],
    buttonText: "Start Now",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$50.99",
    period: "/ 3 months",
    description: "Our most popular choice",
    features: [
      "Unlimited workflows",
      "Faster execution priority",
      "Advanced templates",
      "Premium support",
    ],
    buttonText: "Start Now",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Elite",
    price: "$154.99",
    period: "/ year",
    description: "For serious crypto power users",
    features: [
      "Everything in Pro",
      "AI assistant access",
      "Early feature access",
      "Private community",
    ],
    buttonText: "Start Now",
    highlight: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Simple pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            Start automating in minutes
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 group ${
                plan.highlight 
                  ? "bg-white/[0.05] border-primary/50 shadow-[0_0_40px_rgba(59,130,246,0.1)]" 
                  : "bg-white/[0.02] border-white/10 hover:border-white/20"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5" />
                    <span className="text-muted-foreground group-hover:text-white transition-colors">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Button 
                variant={plan.highlight ? "default" : "outline"} 
                className={`w-full h-12 rounded-xl font-bold transition-all ${
                  plan.highlight 
                    ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" 
                    : "border-white/10 hover:bg-white/5"
                }`}
              >
                {plan.buttonText}
              </Button>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className={`absolute inset-0 rounded-3xl blur-2xl ${
                  plan.highlight ? "bg-primary/10" : "bg-white/5"
                }`} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Crypto payments supported. Cancel anytime.
          </p>
        </div>
      </div>

      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />
    </section>
  );
}
