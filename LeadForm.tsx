import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Target, Settings2, Timer, Shield, Eye, BookOpen
} from "lucide-react";
import { useI18n } from "@/i18n/i18n";

import basicCardImg from "@/assets/guide/basic-card-overview.png";
import advancedImg from "@/assets/guide/advanced-settings.png";
import timingImg from "@/assets/guide/timing-diagram.png";
import riskImg from "@/assets/guide/risk-indicators.png";
import simulationImg from "@/assets/guide/simulation-mode.png";

const GUIDE_LAST_SECTION_KEY = "cetra_guide_last_section";

interface GuideSectionDef {
  id: string;
  titleKey: string;
  icon: React.ElementType;
  image: string;
  callouts: { titleKey: string; descKey: string }[];
}

const SECTIONS: GuideSectionDef[] = [
  {
    id: "overview",
    titleKey: "guide.section.overview",
    icon: Target,
    image: basicCardImg,
    callouts: [
      { titleKey: "guide.overview.accountGroup", descKey: "guide.overview.accountGroupDesc" },
      { titleKey: "guide.overview.urlTarget", descKey: "guide.overview.urlTargetDesc" },
      { titleKey: "guide.overview.delay", descKey: "guide.overview.delayDesc" },
      { titleKey: "guide.overview.onSuccess", descKey: "guide.overview.onSuccessDesc" },
    ],
  },
  {
    id: "advanced",
    titleKey: "guide.section.advanced",
    icon: Settings2,
    image: advancedImg,
    callouts: [
      { titleKey: "guide.advanced.concurrency", descKey: "guide.advanced.concurrencyDesc" },
      { titleKey: "guide.advanced.interval", descKey: "guide.advanced.intervalDesc" },
      { titleKey: "guide.advanced.jitter", descKey: "guide.advanced.jitterDesc" },
      { titleKey: "guide.advanced.retryLogic", descKey: "guide.advanced.retryLogicDesc" },
      { titleKey: "guide.advanced.conditions", descKey: "guide.advanced.conditionsDesc" },
      { titleKey: "guide.advanced.errorHandling", descKey: "guide.advanced.errorHandlingDesc" },
    ],
  },
  {
    id: "timing",
    titleKey: "guide.section.timing",
    icon: Timer,
    image: timingImg,
    callouts: [
      { titleKey: "guide.timing.delays", descKey: "guide.timing.delaysDesc" },
      { titleKey: "guide.timing.batching", descKey: "guide.timing.batchingDesc" },
      { titleKey: "guide.timing.retries", descKey: "guide.timing.retriesDesc" },
    ],
  },
  {
    id: "risk",
    titleKey: "guide.section.risk",
    icon: Shield,
    image: riskImg,
    callouts: [
      { titleKey: "guide.risk.safe", descKey: "guide.risk.safeDesc" },
      { titleKey: "guide.risk.medium", descKey: "guide.risk.mediumDesc" },
      { titleKey: "guide.risk.risky", descKey: "guide.risk.riskyDesc" },
    ],
  },
  {
    id: "simulation",
    titleKey: "guide.section.simulation",
    icon: Eye,
    image: simulationImg,
    callouts: [
      { titleKey: "guide.simulation.preview", descKey: "guide.simulation.previewDesc" },
      { titleKey: "guide.simulation.howTo", descKey: "guide.simulation.howToDesc" },
    ],
  },
];

function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-white/10 bg-white/[0.02]">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-auto transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

interface CardSettingsGuideProps {
  isOpen: boolean;
  onClose: () => void;
  initialSection?: string;
}

export default function CardSettingsGuide({ isOpen, onClose, initialSection }: CardSettingsGuideProps) {
  const { t } = useI18n();
  const [activeSection, setActiveSection] = useState(() => {
    if (initialSection && SECTIONS.find(s => s.id === initialSection)) return initialSection;
    try {
      const saved = localStorage.getItem(GUIDE_LAST_SECTION_KEY);
      if (saved && SECTIONS.find(s => s.id === saved)) return saved;
    } catch {}
    return "overview";
  });
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (initialSection && SECTIONS.find(s => s.id === initialSection)) {
      setActiveSection(initialSection);
      setTimeout(() => scrollToSection(initialSection), 100);
    }
  }, [initialSection, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    try {
      localStorage.setItem(GUIDE_LAST_SECTION_KEY, activeSection);
    } catch {}
  }, [activeSection]);

  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    const el = sectionRefs.current[sectionId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    if (!isOpen || !contentRef.current) return;
    const container = contentRef.current;
    const handleScroll = () => {
      const scrollTop = container.scrollTop + 120;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = sectionRefs.current[SECTIONS[i].id];
        if (el && el.offsetTop <= scrollTop) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex bg-black/70 backdrop-blur-sm"
          onClick={onClose}
          data-testid="guide-overlay"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex w-full h-full max-w-6xl mx-auto my-4 md:my-8 rounded-2xl overflow-hidden border border-white/10 bg-[#0a0f1e] shadow-2xl"
            onClick={e => e.stopPropagation()}
            data-testid="guide-modal"
          >
            <div className="hidden md:flex flex-col w-56 border-r border-white/5 bg-[#060b18] flex-shrink-0">
              <div className="px-4 py-5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-white/90">{t("guide.title")}</span>
                </div>
              </div>
              <nav className="flex-1 py-3 overflow-y-auto">
                {SECTIONS.map(section => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors ${
                        isActive
                          ? "text-white bg-primary/10 border-r-2 border-primary"
                          : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                      }`}
                      data-testid={`guide-nav-${section.id}`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{t(section.titleKey)}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-white/5 bg-[#0a0f1e]/90 backdrop-blur-md flex-shrink-0">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-white/90">{t("guide.title")}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  data-testid="button-close-guide"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="md:hidden flex items-center gap-1 px-4 py-2 border-b border-white/5 overflow-x-auto flex-shrink-0">
                {SECTIONS.map(section => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap transition-colors flex-shrink-0 ${
                        isActive ? "bg-primary/15 text-primary" : "text-white/40 hover:text-white/60"
                      }`}
                      data-testid={`guide-mobile-nav-${section.id}`}
                    >
                      <Icon className="w-3 h-3" />
                      {t(section.titleKey)}
                    </button>
                  );
                })}
              </div>

              <div ref={contentRef} className="flex-1 overflow-y-auto scroll-smooth">
                <div className="max-w-3xl mx-auto px-6 py-8 space-y-16">
                  {SECTIONS.map((section) => {
                    const Icon = section.icon;
                    return (
                      <div
                        key={section.id}
                        ref={el => { sectionRefs.current[section.id] = el; }}
                        data-testid={`guide-section-${section.id}`}
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="text-xl font-bold text-white/90">{t(section.titleKey)}</h3>
                        </div>

                        <div className="mb-6">
                          <LazyImage src={section.image} alt={t(section.titleKey)} />
                        </div>

                        <div className="space-y-4">
                          {section.callouts.map((callout, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 p-3.5 rounded-lg border border-white/5 bg-white/[0.02]"
                              data-testid={`guide-callout-${section.id}-${idx}`}
                            >
                              <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-[11px] font-bold text-primary">{idx + 1}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-white/85 mb-1">{t(callout.titleKey)}</p>
                                <p className="text-sm text-white/45 leading-relaxed">{t(callout.descKey)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  <div className="pb-8" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
