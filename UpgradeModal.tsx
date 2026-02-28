import { Zap, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlan } from "@/contexts/PlanContext";
import { useI18n } from "@/i18n/i18n";
import { useLocation } from "wouter";
import { useState } from "react";

export function FreePlanBanner() {
  const { isFreePlan, isGuest, remainingTrialRuns, openSignupModal } = usePlan();
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (isGuest) {
    return (
      <div
        className="flex items-center justify-between gap-3 px-4 py-2.5 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-blue-500/10 border-b border-emerald-500/10"
        data-testid="guest-banner"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-md bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-xs text-white/60 truncate">
            {t("guest.bannerText")}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            size="sm"
            className="bg-emerald-600/80 text-white text-[11px] border-0 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            onClick={() => openSignupModal("default")}
            data-testid="button-banner-signup"
          >
            <UserPlus className="w-3 h-3 mr-1" />
            {t("guest.createAccount")}
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="text-white/30 hover:text-white/60 transition-colors text-xs px-1"
            data-testid="button-dismiss-guest-banner"
          >
            {"\u00D7"}
          </button>
        </div>
      </div>
    );
  }

  if (!isFreePlan) return null;

  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-purple-500/10 border-b border-blue-500/10"
      data-testid="free-plan-banner"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-6 h-6 rounded-md bg-blue-500/15 flex items-center justify-center flex-shrink-0">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <span className="text-xs text-white/60 truncate">
          {t("paywall.bannerText")}
          {remainingTrialRuns > 0 && (
            <span className="text-blue-400/80 ml-1.5">
              ({remainingTrialRuns} {t("paywall.trialRunsLeft")})
            </span>
          )}
        </span>
      </div>
      <Button
        size="sm"
        className="bg-blue-600/80 text-white text-[11px] flex-shrink-0 border-0 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
        onClick={() => setLocation("/subscription")}
        data-testid="button-banner-upgrade"
      >
        <Zap className="w-3 h-3 mr-1" />
        {t("paywall.upgrade")}
      </Button>
    </div>
  );
}
