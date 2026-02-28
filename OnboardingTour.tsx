import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, X, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n/i18n";

interface CardTourStep {
  target: string;
  titleKey: string;
  descriptionKey: string;
  placement?: "top" | "bottom" | "left" | "right" | "auto";
  autoExpand?: string;
  requireAdvanced?: boolean;
}

const CARD_TOUR_STEPS: CardTourStep[] = [
  {
    target: "[data-tour-card='card-header']",
    titleKey: "ctour.step1.title",
    descriptionKey: "ctour.step1.desc",
    placement: "bottom",
  },
  {
    target: "[data-tour-card='basic-settings']",
    titleKey: "ctour.step2.title",
    descriptionKey: "ctour.step2.desc",
    placement: "left",
    autoExpand: "basic",
  },
  {
    target: "[data-tour-card='input-field']",
    titleKey: "ctour.step3.title",
    descriptionKey: "ctour.step3.desc",
    placement: "left",
    autoExpand: "basic",
  },
  {
    target: "[data-tour-card='delay-setting']",
    titleKey: "ctour.step4.title",
    descriptionKey: "ctour.step4.desc",
    placement: "left",
    autoExpand: "timing",
  },
  {
    target: "[data-tour-card='retry-setting']",
    titleKey: "ctour.step5.title",
    descriptionKey: "ctour.step5.desc",
    placement: "left",
    requireAdvanced: true,
    autoExpand: "errors",
  },
  {
    target: "[data-tour-card='advanced-toggle']",
    titleKey: "ctour.step6.title",
    descriptionKey: "ctour.step6.desc",
    placement: "left",
  },
  {
    target: "[data-tour-card='execution-mode']",
    titleKey: "ctour.step7.title",
    descriptionKey: "ctour.step7.desc",
    placement: "left",
    requireAdvanced: true,
    autoExpand: "execution",
  },
  {
    target: "[data-tour-card='apply-button']",
    titleKey: "ctour.step8.title",
    descriptionKey: "ctour.step8.desc",
    placement: "top",
  },
];

const CARD_TOUR_KEY = "cardSettingsTourCompleted";
const PADDING = 6;
const TOOLTIP_GAP = 14;

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function getPlacement(
  targetRect: DOMRect,
  placement: string
): "top" | "bottom" | "left" | "right" {
  if (placement !== "auto") return placement as any;
  if (targetRect.left > 340) return "left";
  const spaceBottom = window.innerHeight - targetRect.bottom;
  if (spaceBottom > 220) return "bottom";
  return "top";
}

function getTooltipStyle(
  targetRect: DOMRect,
  place: "top" | "bottom" | "left" | "right"
) {
  const style: React.CSSProperties = { position: "fixed" };
  const tooltipW = 290;
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

interface CardSettingsTourProps {
  active: boolean;
  onComplete: () => void;
  onExpandSection?: (sectionId: string) => void;
  onEnableAdvanced?: (enable: boolean) => void;
}

export default function CardSettingsTour({
  active,
  onComplete,
  onExpandSection,
  onEnableAdvanced,
}: CardSettingsTourProps) {
  const { t } = useI18n();
  const stepRef = useRef(0);
  const [step, _setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [visible, setVisible] = useState(false);
  const activeRef = useRef(active);
  activeRef.current = active;
  const prepareCountRef = useRef(0);

  const setStep = useCallback((val: number | ((prev: number) => number)) => {
    _setStep((prev) => {
      const next = typeof val === "function" ? val(prev) : val;
      stepRef.current = next;
      return next;
    });
  }, []);

  const currentStep = CARD_TOUR_STEPS[step];

  const prepareStep = useCallback(
    (s: CardTourStep) => {
      if (s.requireAdvanced && onEnableAdvanced) {
        onEnableAdvanced(true);
      }
      if (s.autoExpand && onExpandSection) {
        onExpandSection(s.autoExpand);
      }
    },
    [onEnableAdvanced, onExpandSection]
  );

  const updateRect = useCallback(() => {
    if (!activeRef.current) return;
    const idx = stepRef.current;
    const cs = CARD_TOUR_STEPS[idx];
    if (!cs) return;
    const el = document.querySelector(cs.target);
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        setTargetRect(r);
        setVisible(true);
        prepareCountRef.current = 0;
        return;
      }
    }
    prepareCountRef.current += 1;
    if (prepareCountRef.current % 5 === 0) {
      prepareStep(cs);
    }
    setVisible(false);
  }, [prepareStep]);

  useEffect(() => {
    if (!active) return;
    setStep(0);
    setVisible(false);
    prepareCountRef.current = 0;
    prepareStep(CARD_TOUR_STEPS[0]);
  }, [active]);

  useEffect(() => {
    if (!active || !currentStep) return;
    prepareCountRef.current = 0;
    prepareStep(currentStep);
    const delay = setTimeout(updateRect, 200);
    const onResize = () => updateRect();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    const poll = setInterval(updateRect, 350);
    return () => {
      clearTimeout(delay);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
      clearInterval(poll);
    };
  }, [active, step, currentStep, prepareStep, updateRect]);

  const finish = useCallback(() => {
    setStep(0);
    setVisible(false);
    onComplete();
  }, [onComplete, setStep]);

  const next = () => {
    if (step < CARD_TOUR_STEPS.length - 1) setStep(step + 1);
    else finish();
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!active || !visible || !targetRect || !currentStep) return null;

  const place = getPlacement(targetRect, currentStep.placement || "auto");
  const tooltipStyle = getTooltipStyle(targetRect, place);
  const arrow = getArrowStyle(targetRect, place);

  const arrowSvg: Record<string, JSX.Element> = {
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

  const panelEl = document.querySelector('[data-testid="panel-node-settings"]');
  const panelRect = panelEl ? panelEl.getBoundingClientRect() : null;
  const maskLeft = panelRect ? panelRect.left : (targetRect.left - 40);
  const maskTop = panelRect ? panelRect.top : 0;
  const maskWidth = panelRect ? panelRect.width : (window.innerWidth - maskLeft);
  const maskHeight = panelRect ? panelRect.height : window.innerHeight;

  const overlay = createPortal(
    <AnimatePresence>
      {active && (
        <motion.div
          key="card-tour-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9998]"
          style={{ pointerEvents: "auto" }}
          onClick={(e) => {
            const clickX = e.clientX;
            const clickY = e.clientY;
            if (
              clickX < maskLeft ||
              clickX > maskLeft + maskWidth ||
              clickY < maskTop ||
              clickY > maskTop + maskHeight
            ) {
              finish();
            }
          }}
          data-testid="card-tour-overlay"
        >
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: "auto" }}
          >
            <defs>
              <mask id="card-tour-panel-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <rect
                  x={maskLeft}
                  y={maskTop}
                  width={maskWidth}
                  height={maskHeight}
                  fill="black"
                />
              </mask>
              <mask id="card-tour-target-mask">
                <rect
                  x={maskLeft}
                  y={maskTop}
                  width={maskWidth}
                  height={maskHeight}
                  fill="white"
                />
                <rect
                  x={targetRect.left - PADDING}
                  y={targetRect.top - PADDING}
                  width={targetRect.width + PADDING * 2}
                  height={targetRect.height + PADDING * 2}
                  rx="8"
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
              mask="url(#card-tour-panel-mask)"
            />
            <rect
              x={maskLeft}
              y={maskTop}
              width={maskWidth}
              height={maskHeight}
              fill="rgba(0,0,0,0.35)"
              mask="url(#card-tour-target-mask)"
            />
          </svg>

          <div
            className="absolute rounded-lg"
            style={{
              left: targetRect.left - PADDING,
              top: targetRect.top - PADDING,
              width: targetRect.width + PADDING * 2,
              height: targetRect.height + PADDING * 2,
              boxShadow: "0 0 0 2px hsl(var(--primary) / 0.4), 0 0 16px hsl(var(--primary) / 0.12)",
              borderRadius: 8,
              pointerEvents: "none",
            }}
          />

          <motion.div
            key={`card-arrow-${step}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: [1, 1.12, 1] }}
            transition={{ duration: 0.5, scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } }}
            style={{ ...arrow.style, zIndex: 9999, pointerEvents: "none" }}
          >
            {arrowSvg[arrow.place]}
          </motion.div>

          <motion.div
            key={`card-tooltip-${step}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            style={{ ...tooltipStyle, zIndex: 9999, width: 290, maxWidth: "calc(100vw - 32px)" }}
            className="bg-[#0f1629] border border-white/10 rounded-xl p-4 shadow-2xl"
            data-testid="card-tour-tooltip"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <h3 className="text-xs font-bold text-white/90">{t(currentStep.titleKey)}</h3>
              </div>
              <button
                onClick={finish}
                className="text-white/30 hover:text-white/60 transition-colors p-0.5"
                data-testid="card-tour-close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed mb-3">
              {t(currentStep.descriptionKey)}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/30 font-medium">
                {step + 1} / {CARD_TOUR_STEPS.length}
              </span>
              <div className="flex items-center gap-1.5">
                {step > 0 && (
                  <button
                    onClick={back}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
                    data-testid="card-tour-back"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    {t("tour.back")}
                  </button>
                )}
                {step === 0 && (
                  <button
                    onClick={finish}
                    className="px-2.5 py-1 rounded-lg text-[11px] text-white/30 hover:text-white/60 transition-colors"
                    data-testid="card-tour-skip"
                  >
                    {t("tour.skip")}
                  </button>
                )}
                <button
                  onClick={next}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-medium bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors"
                  data-testid="card-tour-next"
                >
                  {step === CARD_TOUR_STEPS.length - 1 ? t("tour.finish") : t("tour.next")}
                  {step < CARD_TOUR_STEPS.length - 1 && <ChevronRight className="w-3 h-3" />}
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

export function useCardSettingsTour() {
  const [tourActive, setTourActive] = useState(false);

  const startTourIfNew = useCallback(() => {
    const completed = localStorage.getItem(CARD_TOUR_KEY);
    if (!completed) {
      setTimeout(() => setTourActive(true), 400);
    }
  }, []);

  const completeTour = useCallback(() => {
    localStorage.setItem(CARD_TOUR_KEY, "true");
    setTourActive(false);
  }, []);

  const replayTour = useCallback(() => {
    localStorage.removeItem(CARD_TOUR_KEY);
    setTourActive(true);
  }, []);

  return { tourActive, startTourIfNew, completeTour, replayTour };
}
