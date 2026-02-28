import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface PortalSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  triggerClassName?: string;
  placeholder?: string;
  "data-testid"?: string;
}

export function PortalSelect({
  value,
  onChange,
  options,
  className = "",
  triggerClassName = "",
  placeholder = "Select...",
  "data-testid": testId,
}: PortalSelectProps) {
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const selectedOption = options.find(o => o.value === value);

  const computePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = Math.min(options.length * 32 + 8, 200);
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const goUp = spaceBelow < menuHeight && rect.top > menuHeight;

    setMenuPos({
      top: goUp ? rect.top - menuHeight - 4 : rect.bottom + 4,
      left: rect.left,
      width: Math.max(rect.width, 140),
    });
  }, [options.length]);

  useEffect(() => {
    if (!open) return;
    computePosition();

    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      ) return;
      setOpen(false);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleScroll = () => computePosition();

    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("keydown", handleEscape, true);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("keydown", handleEscape, true);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [open, computePosition]);

  useEffect(() => {
    if (open) {
      const idx = options.findIndex(o => o.value === value);
      setHighlightIdx(idx >= 0 ? idx : 0);
    }
  }, [open, value, options]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
        return;
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIdx(i => (i + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIdx(i => (i - 1 + options.length) % options.length);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (highlightIdx >= 0 && highlightIdx < options.length) {
          onChange(options[highlightIdx].value);
          setOpen(false);
          triggerRef.current?.focus();
        }
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const menu = open && menuPos ? createPortal(
    <div
      ref={menuRef}
      className="fixed"
      style={{
        top: menuPos.top,
        left: menuPos.left,
        width: menuPos.width,
        zIndex: 1000,
      }}
      data-testid={testId ? `${testId}-menu` : undefined}
    >
      <div
        className="rounded-lg border border-white/10 bg-[#0d1324] shadow-xl shadow-black/40 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100"
      >
        <div className="max-h-[192px] overflow-y-auto py-1 scrollbar-thin">
          {options.map((opt, idx) => (
            <button
              key={opt.value}
              onClick={(e) => { e.stopPropagation(); handleSelect(opt.value); }}
              onMouseEnter={() => setHighlightIdx(idx)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors ${
                highlightIdx === idx
                  ? "bg-primary/15 text-primary"
                  : "text-white/70 hover:bg-white/[0.04]"
              }`}
              style={{ fontSize: "inherit" }}
              data-testid={testId ? `${testId}-option-${opt.value}` : undefined}
            >
              <span className="flex-1 truncate">{opt.label}</span>
              {opt.value === value && <Check className="w-3 h-3 text-primary flex-shrink-0" />}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        onKeyDown={handleKeyDown}
        className={`flex items-center gap-1 bg-white/5 border border-white/10 text-white rounded-md focus:outline-none focus:border-primary/50 transition-colors ${
          open ? "border-primary/40 bg-white/[0.07]" : ""
        } ${triggerClassName} ${className}`}
        data-testid={testId}
      >
        <span className="flex-1 truncate text-left">
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown className={`flex-shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`} style={{ width: "0.7em", height: "0.7em" }} />
      </button>
      {menu}
    </>
  );
}

interface PortalSelectMiniProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  "data-testid"?: string;
}

export function PortalSelectMini({
  value,
  onChange,
  options,
  className = "",
  "data-testid": testId,
}: PortalSelectMiniProps) {
  return (
    <PortalSelect
      value={value}
      onChange={onChange}
      options={options}
      triggerClassName={`px-1.5 py-0.5 text-[10px] ${className}`}
      data-testid={testId}
    />
  );
}

interface RiskBadgeSelectProps {
  value: string;
  onChange: (value: string) => void;
  "data-testid"?: string;
}

const RISK_OPTIONS: SelectOption[] = [
  { value: "safe", label: "Safe" },
  { value: "medium", label: "Medium" },
  { value: "risky", label: "Risky" },
];

const RISK_STYLES: Record<string, { bg: string; text: string; glow: string }> = {
  safe: { bg: "bg-green-500/15", text: "text-green-400", glow: "rgba(34,197,94,0.2)" },
  medium: { bg: "bg-yellow-500/15", text: "text-yellow-400", glow: "rgba(234,179,8,0.2)" },
  risky: { bg: "bg-red-500/15", text: "text-red-400", glow: "rgba(239,68,68,0.2)" },
};

export function RiskBadgeSelect({ value, onChange, "data-testid": testId }: RiskBadgeSelectProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const risk = RISK_STYLES[value] || RISK_STYLES.safe;

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, left: rect.left });

    const close = (e: MouseEvent) => {
      if (triggerRef.current?.contains(e.target as Node) || menuRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close, true);
    document.addEventListener("keydown", esc, true);
    return () => {
      document.removeEventListener("mousedown", close, true);
      document.removeEventListener("keydown", esc, true);
    };
  }, [open]);

  const menu = open && menuPos ? createPortal(
    <div
      ref={menuRef}
      className="fixed"
      style={{ top: menuPos.top, left: menuPos.left, zIndex: 1000 }}
    >
      <div className="rounded-lg border border-white/10 bg-[#0d1324] shadow-xl shadow-black/40 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100 py-1 min-w-[90px]">
        {RISK_OPTIONS.map(opt => {
          const s = RISK_STYLES[opt.value];
          return (
            <button
              key={opt.value}
              onClick={(e) => { e.stopPropagation(); onChange(opt.value); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-[10px] font-medium transition-colors ${
                value === opt.value ? `${s.bg} ${s.text}` : "text-white/60 hover:bg-white/[0.04]"
              }`}
              data-testid={testId ? `${testId}-option-${opt.value}` : undefined}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${opt.value === "safe" ? "bg-green-400" : opt.value === "medium" ? "bg-yellow-400" : "bg-red-400"}`} />
              {opt.label}
              {opt.value === value && <Check className="w-3 h-3 ml-auto flex-shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className={`appearance-none text-[9px] font-bold px-1.5 py-0.5 rounded-full cursor-pointer border-0 outline-none flex items-center gap-1 ${risk.bg} ${risk.text}`}
        style={{ boxShadow: `0 0 8px ${risk.glow}` }}
        data-testid={testId}
      >
        {RISK_OPTIONS.find(o => o.value === value)?.label || "Safe"}
        <ChevronDown className="w-2 h-2" />
      </button>
      {menu}
    </>
  );
}
