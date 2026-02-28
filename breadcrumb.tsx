import { motion } from "framer-motion";
import { Zap, Repeat, GitFork, Wallet, Activity, ArrowRight } from "lucide-react";

// Abstract visual representation of workflow builder
export function VisualBuilder() {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] bg-white/5 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm">
      <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:linear-gradient(0deg,transparent,black)]" />
      
      {/* Node 1 - Trigger */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-1/2 left-[10%] -translate-y-1/2 p-4 bg-[#1E293B] border border-primary/30 rounded-xl shadow-xl flex items-center gap-3 w-48"
      >
        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
          <Zap className="w-4 h-4 text-orange-500" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-mono">TRIGGER</div>
          <div className="text-sm font-semibold">Price Alert</div>
        </div>
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-[#1E293B]" />
      </motion.div>

      {/* Connection Line 1 */}
      <svg className="absolute inset-0 pointer-events-none">
        <motion.path 
          d="M 25% 50% L 45% 50%" 
          stroke="url(#gradient-line)" 
          strokeWidth="2" 
          strokeDasharray="4 4"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        <defs>
          <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Node 2 - Action */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-[#1E293B] border border-primary/50 rounded-xl shadow-2xl shadow-primary/10 flex items-center gap-3 w-48 z-10"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Wallet className="w-4 h-4 text-primary" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-mono">ACTION</div>
          <div className="text-sm font-semibold">Execute Swap</div>
        </div>
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-[#1E293B]" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-[#1E293B]" />
      </motion.div>

      {/* Connection Line 2 */}
      <svg className="absolute inset-0 pointer-events-none">
        <motion.path 
          d="M 65% 50% L 85% 50%" 
          stroke="#3B82F6" 
          strokeWidth="2" 
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        />
      </svg>

      {/* Node 3 - Result */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        className="absolute top-1/2 right-[10%] -translate-y-1/2 p-4 bg-[#1E293B] border border-green-500/30 rounded-xl shadow-xl flex items-center gap-3 w-48"
      >
        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
          <Activity className="w-4 h-4 text-green-500" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-mono">RESULT</div>
          <div className="text-sm font-semibold">Log Profit</div>
        </div>
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-[#1E293B]" />
      </motion.div>
    </div>
  );
}

// Abstract visual for Scale section
export function VisualScale() {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center">
       <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-purple-500/5 rounded-3xl" />
       
       <div className="relative z-10 grid grid-cols-2 gap-4 md:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card p-4 md:p-6 rounded-xl flex items-center gap-3 w-40 md:w-48"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                W{i}
              </div>
              <div className="space-y-1">
                <div className="h-2 w-16 bg-white/10 rounded-full" />
                <div className="h-2 w-10 bg-white/5 rounded-full" />
              </div>
              <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </motion.div>
          ))}
       </div>

       {/* Connecting central hub */}
       <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
       >
         <div className="w-24 h-24 rounded-full border border-white/10 bg-black/50 backdrop-blur-xl flex items-center justify-center">
            <GitFork className="w-8 h-8 text-white/50" />
         </div>
       </motion.div>
    </div>
  );
}
