import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLeadSchema, type InsertLead } from "@shared/schema";
import { useCreateLead } from "@/hooks/use-leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function LeadForm() {
  const { mutate, isPending, isSuccess } = useCreateLead();
  
  const form = useForm<InsertLead>({
    resolver: zodResolver(insertLeadSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: InsertLead) {
    mutate(data);
    form.reset();
  }

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 rounded-2xl text-center border-green-500/20 bg-green-500/5"
      >
        <h3 className="text-xl font-bold text-green-400 mb-2">You're on the list!</h3>
        <p className="text-muted-foreground">Keep an eye on your inbox for early access details.</p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input 
                    placeholder="Enter your email" 
                    {...field} 
                    className="h-12 px-5 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all placeholder:text-white/20 text-white"
                  />
                </FormControl>
                <FormMessage className="pl-2" />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            disabled={isPending}
            className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Join Waitlist <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>
      </Form>
      <p className="mt-4 text-xs text-center text-muted-foreground">
        Join 2,000+ traders automating their workflows.
      </p>
    </div>
  );
}
