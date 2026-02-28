import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, X, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n/i18n";

const TourContext = createContext<{ replayTour: () => void }>({ replayTour: () => {} });
export const useTourReplay = () => useContext(TourContext);
export { TourContext };

export interface TourStep {
  target: string;
  titleKey: string;
  descriptionKey: string;
  placement?: "top" | "bottom" | "left" | "right" | "auto";
}

const TOUR_STEPS: TourStep[] = [
  {
    target: "[data-tour='sidebar-nav']",
    titleKey: "tour.step1.title",
    descriptionKey: "tour.step1.desc",
    placement: "right",
  },
  {
    target: "[data-tour='workflow-builder']",
    titleKey: "tour.step2.title",
    descriptionKey: "tour.step2.desc",
    placement: "right",
  },
  {
    target: "[data-tour='subscription']",
    titleKey: "tour.step3.title",
    descriptionKey: "tour.step3.desc",
    placement: "right",
  },
  {
    target: "[data-tour='referrals']",
    titleKey: "tour.step4.title",
    descriptionKey: "tour.step4.desc",
    placement: "right",
  },
  {
    target: "[data-tour='settings']",
    titleKey: "tour.step5.title",
    descriptionKey: "tour.step5.desc",
    placement: "right",
  },
];

const TOUR_KEY = "dashboardTourCompleted";
const PADDING = 8;
const TOOLTIP_GAP = 16;

function getPlacement(
  targetRect: DOMRect,
  placement: string
): "top" | "bottom" | "left" | "right" {
  if (placement !== "auto") return placement as any;
  const spaceRight = window.innerWidth - targetRect.right;
  const spaceBottom = window.innerHeight - targetRect.bottom;
  if (spaceRight > 320) return "right";
  if (spaceBottom > 200) return "bottom";
  if (targetRect.left > 320) return "left";
  return "top";
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function getTooltipStyle(
  targetRect: DOMRect,
  place: "top" | "bottom" | "left" | "right"
) {
  const style: React.CSSProperties = { position: "fixed" };
  const tooltipW = 300;
  const tooltipH = 180;
  const margin = 12;
  switch (place) {
    case "right":
      style.left = clamp(targetRect.right + TOOLTIP_GAP, margin, window.innerWidth - tooltipW - margin);
      style.top = clamp(targetRect.top + targetRect.height / 2 - tooltipH / 2, margin, window.innerHeight - tooltipH - margin);
      break;
    case "left":
      style.left = clamp(targetRect.left - TOOLTIP_GAP - tooltipW, margin, window.innerWidth - tooltipW - margin);
      style.top = clamp(targetRect.top + targetRect.height / 2 - tooltipH / 2, margin, window.innerHeight - tooltipH - margin);
      break;
    case "bottom":
      style.left = clamp(targetRect.left + targetRect.width / 2 - tooltipW / 2, margin, window.innerWidth - tooltipW - margin);
      style.top = clamp(targetRect.bottom + TOOLTIP_GAP, margin, window.innerHeight - tooltipH - margin);
      break;
    case "top":
      style.left = clamp(targetRect.left + targetRect.width / 2 - tooltipW / 2, margin, window.innerWidth - tooltipW - margin);
      style.top = clamp(targetRect.top - TOOLTIP_GAP - tooltipH, margin, window.innerHeight - tooltipH - margin);
      break;
  }
  return style;
}

function getArrowStyle(
  targetRect: DOMRect,
  place: "top" | "bottom" | "left" | "right"
) {
  const style: React.CSSProperties = { position: "fixed" };
  const size = 10;
  switch (place) {
    case "right":
      style.left = targetRect.right + 4;
      style.top = targetRect.top + targetRect.height / 2 - size;
      break;
    case "left":
      style.left = targetRect.left - 4 - size * 2;
      style.top = targetRect.top + targetRect.height / 2 - size;
      break;
    case "bottom":
      style.left = targetRect.left + targetRect.width / 2 - size;
      style.top = targetRect.bottom + 4;
      break;
    case "top":
      style.left = targetRect.left + targetRect.width / 2 - size;
      style.top = targetRect.top - 4 - size * 2;
      break;
  }
  return { style, place };
}

interface OnboardingTourProps {
  active: boolean;
  onComplete: () => void;
}

export default function OnboardingTour({ active, onComplete }: OnboardingTourProps) {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number>(0);

  const currentStep = TOUR_STEPS[step];

  const updateRect = useCallback(() => {
    if (!active || !currentStep) return;
    const el = document.querySelector(currentStep.target);
    if (el) {
      setTargetRect(el.getBoundingClientRect());
      setVisible(true);
    } else {
      setVisible(false);
      if (step < TOUR_STEPS.length - 1) {
        setStep(s => s + 1);
      }
    }
  }, [active, currentStep, step]);

  useEffect(() => {
    if (!active) return;
    updateRect();
    const onResize = () => updateRect();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);

    const poll = setInterval(updateRect, 500);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
      clearInterval(poll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [active, updateRect]);

  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  const finish = useCallback(() => {
    setStep(0);
    setVisible(false);
    onComplete();
  }, [onComplete]);

  const next = () => {
    if (step < TOUR_STEPS.length - 1) setStep(step + 1);
    else finish();
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!active || !visible || !targetRect || !currentStep) return null;

  const place = getPlacement(targetRect, currentStep.placement || "auto");
  const tooltipStyle = getTooltipStyle(targetRect, place);
  const arrow = getArrowStyle(targetRect, place);

  const arrowSvg = {
    right: (
      <svg width="12" height="20" viewBox="0 0 12 20">
        <path d="M0 0 L12 10 L0 20 Z" fill="hsl(var(--primary))" opacity="0.8" />
      </svg>
    ),
    left: (
      <svg width="12" height="20" viewBox="0 0 12 20">
        <path d="M12 0 L0 10 L12 20 Z" fill="hsl(var(--primary))" opacity="0.8" />
      </svg>
    ),
    bottom: (
      <svg width="20" height="12" viewBox="0 0 20 12">
        <path d="M0 0 L10 12 L20 0 Z" fill="hsl(var(--primary))" opacity="0.8" />
      </svg>
    ),
    top: (
      <svg width="20" height="12" viewBox="0 0 20 12">
        <path d="M0 12 L10 0 L20 12 Z" fill="hsl(var(--primary))" opacity="0.8" />
      </svg>
    ),
  };

  const overlay = createPortal(
    <AnimatePresence>
      {active && (
        <motion.div
          key="tour-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9998]"
          style={{ pointerEvents: "auto" }}
          onClick={(e) => e.stopPropagation()}
          data-testid="tour-overlay"
        >
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: "auto" }}
          >
            <defs>
              <mask id="tour-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <rect
                  x={targetRect.left - PADDING}
                  y={targetRect.top - PADDING}
                  width={targetRect.width + PADDING * 2}
                  height={targetRect.height + PADDING * 2}
                  rx="12"
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="rgba(0,0,0,0.65)"
              mask="url(#tour-mask)"
            />
          </svg>

          <div
            className="absolute rounded-xl"
            style={{
              left: targetRect.left - PADDING,
              top: targetRect.top - PADDING,
              width: targetRect.width + PADDING * 2,
              height: targetRect.height + PADDING * 2,
              boxShadow: "0 0 0 2px hsl(var(--primary) / 0.4), 0 0 20px hsl(var(--primary) / 0.15)",
              borderRadius: 12,
              pointerEvents: "none",
            }}
          />

          <motion.div
            key={`arrow-${step}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: [1, 1.15, 1] }}
            transition={{ duration: 0.6, scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } }}
            style={{ ...arrow.style, zIndex: 9999, pointerEvents: "none" }}
          >
            {arrowSvg[arrow.place]}
          </motion.div>

          <motion.div
            key={`tooltip-${step}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            style={{ ...tooltipStyle, zIndex: 9999, width: 300, maxWidth: "calc(100vw - 32px)" }}
            className="bg-[#0f1629] border border-white/10 rounded-xl p-5 shadow-2xl"
            data-testid="tour-tooltip"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                <h3 className="text-sm font-bold text-white/90">{t(currentStep.titleKey)}</h3>
              </div>
              <button
                onClick={finish}
                className="text-white/30 hover:text-white/60 transition-colors p-0.5"
                data-testid="tour-close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-white/50 leading-relaxed mb-4">
              {t(currentStep.descriptionKey)}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/30 font-medium">
                {step + 1} / {TOUR_STEPS.length}
              </span>
              <div className="flex items-center gap-2">
                {step > 0 && (
                  <button
                    onClick={back}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
                    data-testid="tour-back"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    {t("tour.back")}
                  </button>
                )}
                {step === 0 && (
                  <button
                    onClick={finish}
                    className="px-3 py-1.5 rounded-lg text-xs text-white/30 hover:text-white/60 transition-colors"
                    data-testid="tour-skip"
                  >
                    {t("tour.skip")}
                  </button>
                )}
                <button
                  onClick={next}
                  className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-medium bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors"
                  data-testid="tour-next"
                >
                  {step === TOUR_STEPS.length - 1 ? t("tour.finish") : t("tour.next")}
                  {step < TOUR_STEPS.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );

  return overlay;
}

export function useTour() {
  const [tourActive, setTourActive] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_KEY);
    if (!completed) {
      const timer = setTimeout(() => setTourActive(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const completeTour = useCallback(() => {
    localStorage.setItem(TOUR_KEY, "true");
    setTourActive(false);
  }, []);

  const replayTour = useCallback(() => {
    localStorage.removeItem(TOUR_KEY);
    setTourActive(true);
  }, []);

  return { tourActive, completeTour, replayTour };
}
