import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Workflow,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  FolderOpen,
  Globe,
  ChevronDown,
  UserPlus,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, type RefObject } from "react";
import { useI18n, LANGUAGES, type Language } from "@/i18n/i18n";
import { useAuth } from "@/hooks/use-auth";
import { usePlan } from "@/contexts/PlanContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { FreePlanBanner } from "@/components/FreePlanBanner";
import OnboardingTour, { useTour, TourContext } from "@/components/OnboardingTour";
import { createPortal } from "react-dom";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, language, setLanguage } = useI18n();
  const { user, logout, isGuest } = useAuth();
  const { openSignupModal } = usePlan();
  const { theme, setTheme } = useTheme();
  const { tourActive, completeTour, replayTour } = useTour();
  const { phase, isOnboarding, advanceToBuilder, allowSidebarNav } = useOnboarding();
  const [langOpen, setLangOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [showOnboardingComplete, setShowOnboardingComplete] = useState(false);
  const prevPhaseRef = useRef(phase);

  useEffect(() => {
    if (phase === "dashboard" && location !== "/" && location !== "") {
      navigate("/");
    } else if ((phase === "builder" || phase === "card") && location !== "/workflows") {
      navigate("/workflows");
    }
  }, [phase, location, navigate]);

  useEffect(() => {
    if (prevPhaseRef.current !== "completed" && phase === "completed") {
      setShowOnboardingComplete(true);
      const timer = setTimeout(() => setShowOnboardingComplete(false), 3500);
      return () => clearTimeout(timer);
    }
    prevPhaseRef.current = phase;
  }, [phase]);
  const langRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  const sidebarItems = [
    { icon: LayoutDashboard, label: t("nav.dashboard"), href: "/" },
    { icon: Workflow, label: t("nav.workflowBuilder"), href: "/workflows" },
    { icon: FolderOpen, label: t("nav.accountGroups"), href: "/groups" },
    { icon: CreditCard, label: t("nav.subscription"), href: "/subscription" },
    { icon: Users, label: t("nav.referrals"), href: "/referrals" },
    { icon: Settings, label: t("nav.settings"), href: "/settings" },
  ];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (phase === "builder" && location !== "/workflows") {
      navigate("/workflows");
    }
    if (phase === "card" && location !== "/workflows") {
      navigate("/workflows");
    }
  }, [phase, location, navigate]);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  function LanguageSelector({ compact }: { compact?: boolean }) {
    return (
      <div className="relative" ref={langRef}>
        <button
          onClick={() => setLangOpen(!langOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-all w-full"
          data-testid="button-language-selector"
        >
          <Globe className="w-4 h-4 flex-shrink-0" />
          {!compact && (
            <>
              <span className="flex-1 text-left">{currentLang.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </>
          )}
        </button>
        <AnimatePresence>
          {langOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 bottom-full mb-1 w-48 bg-[#0f172a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setLangOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                    language === lang.code
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                  data-testid={`button-lang-${lang.code}`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  function ThemeSelector() {
    const themeOptions = [
      { id: "dark" as const, label: t("theme.dark"), suffix: ` (${t("theme.default")})`, icon: Moon },
      { id: "light" as const, label: t("theme.light"), icon: Sun },
    ];
    const currentThemeLabel = themeOptions.find(o => o.id === theme)?.label || t("theme.dark");
    return (
      <div className="relative" ref={themeRef}>
        <button
          onClick={() => setThemeOpen(!themeOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-all w-full"
          data-testid="button-theme-selector"
        >
          {theme === "dark" ? (
            <Moon className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Sun className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="flex-1 text-left">{currentThemeLabel}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${themeOpen ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {themeOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 bottom-full mb-1 w-48 bg-[#0f172a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
            >
              {themeOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setTheme(opt.id);
                    setThemeOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                    theme === opt.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                  data-testid={`button-theme-${opt.id}`}
                >
                  <opt.icon className="w-4 h-4" />
                  <span>{opt.label}{opt.suffix || ""}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  function handleSidebarClick(e: React.MouseEvent, href: string) {
    if (phase === "dashboard") {
      if (href === "/workflows") {
        advanceToBuilder();
      } else {
        e.preventDefault();
        e.stopPropagation();
      }
    } else if (!allowSidebarNav && href !== "/workflows") {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function getSidebarItemClass(href: string, isActive: boolean) {
    if (phase === "dashboard" && href === "/workflows") {
      return "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer bg-primary/15 text-primary ring-1 ring-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] animate-pulse";
    }
    if (phase === "dashboard" && href !== "/workflows") {
      return "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all opacity-30 pointer-events-none cursor-not-allowed text-muted-foreground";
    }
    if (!allowSidebarNav && href !== "/workflows") {
      return "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all opacity-30 pointer-events-none cursor-not-allowed text-muted-foreground";
    }
    return `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
      isActive
        ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(59,130,246,0.1)]"
        : "text-muted-foreground hover:text-white hover:bg-white/5"
    }`;
  }

  const onboardingCompletePopup = showOnboardingComplete ? createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl px-8 py-5 shadow-2xl backdrop-blur-md"
        data-testid="onboarding-complete-popup"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{t("onboarding.complete")}</h3>
            <p className="text-xs text-white/50 mt-0.5">{t("onboarding.welcome")}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  ) : null;

  const onboardingPrompt = phase === "dashboard" ? createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9990] bg-[#0f1629]/95 border border-primary/20 rounded-2xl px-6 py-4 shadow-2xl max-w-md"
        data-testid="onboarding-prompt"
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
          <h3 className="text-sm font-bold text-white/90">{t("onboarding.welcome")}</h3>
        </div>
        <p className="text-xs text-white/50 leading-relaxed">{t("onboarding.clickBuilder")}</p>
      </motion.div>
    </AnimatePresence>,
    document.body
  ) : null;

  return (
    <TourContext.Provider value={{ replayTour }}>
    <div className="min-h-screen bg-[#020617] text-white flex">
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[#020617]/80 backdrop-blur-md fixed inset-y-0 left-0 z-30">
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-center">
          <a href="/">
            <img
              src="/assets/logo.png"
              alt="Cetra"
              className="h-20 w-auto invert brightness-0"
              data-testid="img-sidebar-logo"
            />
          </a>
        </div>

        <nav className="flex-1 p-4 space-y-1" data-tour="sidebar-nav">
          {sidebarItems.map((item) => {
            const isActive =
              item.href === "/"
                ? location === "/" || location === ""
                : location.startsWith(item.href);
            const tourId = item.href === "/workflows" ? "workflow-builder"
              : item.href === "/subscription" ? "subscription"
              : item.href === "/referrals" ? "referrals"
              : item.href === "/settings" ? "settings"
              : undefined;
            const isLocked = phase === "dashboard" && item.href !== "/workflows";
            const isHighlighted = phase === "dashboard" && item.href === "/workflows";
            return (
              <Link key={item.href} href={isLocked ? "#" : item.href} onClick={(e: any) => handleSidebarClick(e, item.href)}>
                <div
                  className={getSidebarItemClass(item.href, isActive)}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  {...(tourId ? { "data-tour": tourId } : {})}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {isActive && !isHighlighted && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                  {isHighlighted && (
                    <div className="ml-auto">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          {user && (
            <div className="px-4 py-2 mb-2">
              <p className="text-xs text-muted-foreground truncate" data-testid="text-user-email">{user.email}</p>
              <p className="text-[10px] text-muted-foreground/60 capitalize">{user.plan} Plan</p>
            </div>
          )}
          {isGuest && (
            <div className="px-4 py-2 mb-2">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
                <p className="text-xs text-amber-400/80 font-medium" data-testid="text-guest-badge">{t("guest.badge")}</p>
              </div>
              <p className="text-[10px] text-muted-foreground/50">{t("guest.badgeDesc")}</p>
            </div>
          )}
          <LanguageSelector />
          <ThemeSelector />
          {isGuest ? (
            <>
              <button
                onClick={() => openSignupModal("default")}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-500/5 transition-all cursor-pointer w-full"
                data-testid="button-sidebar-signup"
              >
                <UserPlus className="w-5 h-5" />
                <span>{t("guest.createAccount")}</span>
              </button>
              <a
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-all cursor-pointer w-full"
                data-testid="button-guest-exit"
              >
                <LogOut className="w-5 h-5" />
                <span>{t("guest.exitDashboard")}</span>
              </a>
            </>
          ) : (
            <button
              onClick={() => logout()}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-all cursor-pointer w-full"
              data-testid="button-logout"
            >
              <LogOut className="w-5 h-5" />
              <span>{t("nav.logOut")}</span>
            </button>
          )}
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-[#020617]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4">
        <a href="/">
          <img src="/assets/logo.png" alt="Cetra" className="h-14 w-auto invert brightness-0 max-h-14" data-testid="img-mobile-logo" />
        </a>
        <div className="flex items-center gap-2">
          {isGuest && (
            <span className="text-[10px] text-amber-400/80 font-medium px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/15" data-testid="badge-guest-mobile">
              {t("guest.badge")}
            </span>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="hover:bg-white/5"
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 bg-[#020617] border-r border-white/5 z-50 flex flex-col"
            >
              <div className="px-6 py-5 border-b border-white/5 flex items-center justify-center">
                <img src="/assets/logo.png" alt="Cetra" className="h-20 w-auto invert brightness-0" data-testid="img-drawer-logo" />
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {sidebarItems.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? location === "/" || location === ""
                      : location.startsWith(item.href);
                  const isLocked = phase === "dashboard" && item.href !== "/workflows";
                  return (
                    <Link key={item.href} href={isLocked ? "#" : item.href} onClick={(e: any) => { handleSidebarClick(e, item.href); if (!isLocked) setMobileOpen(false); }}>
                      <div
                        onClick={() => { if (!isLocked) setMobileOpen(false); }}
                        className={getSidebarItemClass(item.href, isActive)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-white/5 space-y-1">
                <LanguageSelector />
                <ThemeSelector />
                {isGuest ? (
                  <>
                    <button
                      onClick={() => { setMobileOpen(false); openSignupModal("default"); }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-500/5 transition-all cursor-pointer w-full"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>{t("guest.createAccount")}</span>
                    </button>
                    <a
                      href="/"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-all cursor-pointer w-full"
                      data-testid="button-guest-exit-mobile"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>{t("guest.exitDashboard")}</span>
                    </a>
                  </>
                ) : (
                  <button
                    onClick={() => { setMobileOpen(false); logout(); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-all cursor-pointer w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{t("nav.logOut")}</span>
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-h-screen flex flex-col">
        <FreePlanBanner />
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={location === "/workflows" ? "h-[calc(100vh-4rem)] lg:h-[calc(100vh-2.5rem)]" : location === "/settings" ? "h-[calc(100vh-4rem)] lg:h-screen overflow-hidden" : "p-6 md:p-8 lg:p-10"}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      {phase === "completed" && <OnboardingTour active={tourActive} onComplete={completeTour} />}
      {onboardingPrompt}
      {onboardingCompletePopup}
    </div>
    </TourContext.Provider>
  );
}
