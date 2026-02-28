import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Lock, Rocket, Shield, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlan } from "@/contexts/PlanContext";
import { useI18n } from "@/i18n/i18n";
import { useLocation } from "wouter";

const PREMIUM_FEATURES = [
  { icon: Rocket, key: "paywall.feat.multiAccount" },
  { icon: Shield, key: "paywall.feat.smartRouting" },
  { icon: Clock, key: "paywall.feat.advancedScheduling" },
  { icon: Zap, key: "paywall.feat.priorityExecution" },
];

export function UpgradeModal() {
  const { showUpgradeModal, closeUpgradeModal, remainingTrialRuns, upgradeReason } = usePlan();
  const { t } = useI18n();
  const [, setLocation] = useLocation();

  return (
    <AnimatePresence>
      {showUpgradeModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={closeUpgradeModal}
            data-testid="upgrade-modal-backdrop"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-md max-h-[90vh]"
            data-testid="upgrade-modal"
          >
            <div className="relative rounded-2xl border border-white/10 bg-[#0a1128]/95 backdrop-blur-xl shadow-[0_0_60px_rgba(59,130,246,0.15)] overflow-y-auto max-h-[90vh]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

              <button
                onClick={closeUpgradeModal}
                className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors z-10"
                data-testid="button-close-upgrade-modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative p-8 pt-10">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/20 flex items-center justify-center">
                      <Lock className="w-7 h-7 text-blue-400" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.5)]">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-center text-white mb-2" data-testid="text-upgrade-title">
                  {t("paywall.title")}
                </h2>
                <p className="text-sm text-center text-white/50 mb-6 leading-relaxed" data-testid="text-upgrade-desc">
                  {upgradeReason === "trialExhausted"
                    ? t("paywall.trialExhausted")
                    : t("paywall.description")}
                </p>

                {upgradeReason === "trialExhausted" && (
                  <div className="flex items-center justify-center gap-2 mb-5 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/15">
                    <Clock className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                    <span className="text-xs text-yellow-300/80">
                      {t("paywall.trialUsed")}
                    </span>
                  </div>
                )}

                <div className="space-y-2.5 mb-8">
                  {PREMIUM_FEATURES.map((feat) => (
                    <div key={feat.key} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <feat.icon className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-sm text-white/70">{t(feat.key)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-[0_0_20px_rgba(59,130,246,0.3)] border-0"
                    onClick={() => { closeUpgradeModal(); setLocation("/subscription"); }}
                    data-testid="button-upgrade-plan"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {t("paywall.upgradePlan")}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-white/40"
                    onClick={closeUpgradeModal}
                    data-testid="button-continue-free"
                  >
                    {t("paywall.continueFree")}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
