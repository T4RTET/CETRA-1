import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Save, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlan } from "@/contexts/PlanContext";
import { useI18n } from "@/i18n/i18n";

const SIGNUP_BENEFITS = [
  { icon: Save, key: "guest.benefit.saveWorkflows" },
  { icon: Shield, key: "guest.benefit.cloudBackup" },
  { icon: Zap, key: "guest.benefit.freeTrialRuns" },
];

export function SignupPromptModal() {
  const { showSignupModal, closeSignupModal, signupReason } = usePlan();
  const { t } = useI18n();

  const reasonText: Record<string, string> = {
    save: t("guest.signupToSave"),
    export: t("guest.signupToExport"),
    execute: t("guest.signupToExecute"),
    default: t("guest.signupDefault"),
  };

  return (
    <AnimatePresence>
      {showSignupModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={closeSignupModal}
            data-testid="signup-modal-backdrop"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-md max-h-[90vh]"
            data-testid="signup-modal"
          >
            <div className="relative rounded-2xl border border-white/10 bg-[#0a1128]/95 backdrop-blur-xl shadow-[0_0_60px_rgba(59,130,246,0.15)] overflow-y-auto max-h-[90vh]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

              <button
                onClick={closeSignupModal}
                className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition-colors z-10"
                data-testid="button-close-signup-modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative p-6 pt-8">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-400/20 flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                      <Save className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-center text-white mb-1.5" data-testid="text-signup-title">
                  {t("guest.signupTitle")}
                </h2>
                <p className="text-sm text-center text-white/50 mb-4 leading-relaxed" data-testid="text-signup-desc">
                  {reasonText[signupReason] || reasonText.default}
                </p>

                <div className="space-y-2 mb-5">
                  {SIGNUP_BENEFITS.map((feat) => (
                    <div key={feat.key} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <feat.icon className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="text-sm text-white/70">{t(feat.key)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold shadow-[0_0_20px_rgba(16,185,129,0.3)] border-0"
                    onClick={() => {
                      closeSignupModal();
                      window.location.href = "/signup";
                    }}
                    data-testid="button-signup-email"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t("guest.signUpEmail")}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-white/40"
                    onClick={closeSignupModal}
                    data-testid="button-continue-guest"
                  >
                    {t("guest.continueGuest")}
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
