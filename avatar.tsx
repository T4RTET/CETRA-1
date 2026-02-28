import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ChevronRight, Lock, Zap, Wallet, Clock,
  Globe, Gift, Repeat, Code, ArrowLeftRight, Users,
  RefreshCw, FileText, Server, Shuffle, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/i18n/i18n";
import {
  TEMPLATE_CATEGORIES,
  getTemplatesByCategory,
  loadCustomTemplates,
  type TemplateCategory,
  type ProjectTemplate,
} from "@/data/workflowTemplates";

function getIconComponent(icon: string, className: string = "w-5 h-5") {
  switch (icon) {
    case "wallet": return <Wallet className={className} />;
    case "clock": return <Clock className={className} />;
    case "globe": return <Globe className={className} />;
    case "gift": return <Gift className={className} />;
    case "repeat": return <Repeat className={className} />;
    case "code": return <Code className={className} />;
    case "swap": return <ArrowLeftRight className={className} />;
    case "users": return <Users className={className} />;
    case "refresh": return <RefreshCw className={className} />;
    case "filetext": return <FileText className={className} />;
    case "server": return <Server className={className} />;
    case "shuffle": return <Shuffle className={className} />;
    case "zap": return <Zap className={className} />;
    default: return <Zap className={className} />;
  }
}

interface TemplateSelectionProps {
  onSelectTemplate: (template: ProjectTemplate) => void;
  onSelectBlank: () => void;
  onBack: () => void;
}

export default function TemplateSelection({ onSelectTemplate, onSelectBlank, onBack }: TemplateSelectionProps) {
  const { t } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const customTemplates = loadCustomTemplates();
  const hasCustom = customTemplates.length > 0;

  if (selectedCategory) {
    const category = TEMPLATE_CATEGORIES.find(c => c.id === selectedCategory);
    const templates = selectedCategory === "custom"
      ? customTemplates
      : getTemplatesByCategory(selectedCategory);

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="h-full flex flex-col"
      >
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-md flex-shrink-0">
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-white/40 hover:text-white transition-colors"
            data-testid="button-back-to-categories"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            {category && (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                {getIconComponent(category.icon, "w-4 h-4")}
              </div>
            )}
            <h2 className="text-lg font-bold tracking-wide">
              {category ? t(category.nameKey) : t("tmpl.custom")}
            </h2>
          </div>
          <Badge variant="outline" className="border-white/10 text-[10px] text-white/40 no-default-hover-elevate">
            {templates.length} {t("tmpl.projects")}
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {templates.map((tmpl, i) => (
              <motion.div
                key={tmpl.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card
                  className="bg-white/[0.03] border border-white/10 rounded-xl overflow-visible hover:border-primary/30 transition-all group"
                  data-testid={`project-card-${tmpl.id}`}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${tmpl.logoColor}15`, color: tmpl.logoColor }}
                      >
                        {getIconComponent(tmpl.logoIcon, "w-5 h-5")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white/90 mb-1 truncate">{tmpl.name}</h3>
                        <Badge
                          variant="outline"
                          className="border-white/10 text-[10px] text-white/40 no-default-hover-elevate"
                        >
                          {t(tmpl.activityType)}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-xs text-white/40 leading-relaxed mb-4 line-clamp-2">
                      {t(tmpl.description)}
                    </p>

                    <div className="flex items-center gap-1.5 mb-4">
                      {tmpl.blocks.slice(0, 6).map((block, bi) => (
                        <div
                          key={bi}
                          className="w-6 h-6 rounded flex items-center justify-center"
                          style={{ backgroundColor: `${tmpl.logoColor}12`, color: tmpl.logoColor }}
                          title={block.label}
                        >
                          {getIconComponent(block.icon, "w-3 h-3")}
                        </div>
                      ))}
                      {tmpl.blocks.length > 6 && (
                        <span className="text-[10px] text-white/30">+{tmpl.blocks.length - 6}</span>
                      )}
                    </div>

                    <Button
                      size="sm"
                      className="w-full gap-2 text-xs"
                      onClick={() => onSelectTemplate(tmpl)}
                      data-testid={`button-use-template-${tmpl.id}`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {t("tmpl.useTemplate")}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      <div className="flex items-center justify-between gap-2 px-6 py-4 border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-md flex-shrink-0 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-white/40 hover:text-white transition-colors"
            data-testid="button-back-from-templates"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Zap className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold tracking-wide">{t("tmpl.chooseCategory")}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-sm text-white/40 mb-6">{t("tmpl.categorySubtitle")}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TEMPLATE_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <button
                  onClick={() => cat.available ? setSelectedCategory(cat.id) : undefined}
                  disabled={!cat.available}
                  className={`w-full text-left p-5 rounded-xl border transition-all group ${
                    cat.available
                      ? "border-white/10 bg-white/[0.02] hover:border-primary/30 hover:bg-white/[0.04] cursor-pointer"
                      : "border-white/5 bg-white/[0.01] opacity-50 cursor-not-allowed"
                  }`}
                  data-testid={`category-card-${cat.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    >
                      {getIconComponent(cat.icon, "w-6 h-6")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-white/90">{t(cat.nameKey)}</h3>
                        {!cat.available && <Lock className="w-3.5 h-3.5 text-white/30" />}
                      </div>
                      <p className="text-xs text-white/40 leading-relaxed">{t(cat.descKey)}</p>
                      {cat.available && (
                        <div className="flex items-center gap-1 mt-2 text-[11px] text-white/30">
                          <span>{getTemplatesByCategory(cat.id).length} {t("tmpl.templates")}</span>
                          <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-white/50 transition-colors" />
                        </div>
                      )}
                      {!cat.available && (
                        <span className="text-[11px] text-white/20 mt-2 inline-block">{t("tmpl.comingSoon")}</span>
                      )}
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          {hasCustom && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <button
                onClick={() => setSelectedCategory("custom")}
                className="w-full text-left p-5 rounded-xl border border-dashed border-white/10 bg-white/[0.01] hover:border-primary/30 hover:bg-white/[0.03] transition-all cursor-pointer group"
                data-testid="category-card-custom"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/5">
                    <Plus className="w-6 h-6 text-white/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white/90 mb-1">{t("tmpl.custom")}</h3>
                    <p className="text-xs text-white/40">{t("tmpl.customDesc")}</p>
                    <div className="flex items-center gap-1 mt-2 text-[11px] text-white/30">
                      <span>{customTemplates.length} {t("tmpl.templates")}</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-2"
          >
            <button
              onClick={onSelectBlank}
              className="w-full text-left p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/15 hover:bg-white/[0.03] transition-all cursor-pointer group"
              data-testid="button-blank-workflow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5">
                  <Plus className="w-5 h-5 text-white/30" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white/70">{t("tmpl.blankWorkflow")}</h3>
                  <p className="text-[11px] text-white/30">{t("tmpl.blankDesc")}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/15 ml-auto group-hover:text-white/40 transition-colors" />
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
