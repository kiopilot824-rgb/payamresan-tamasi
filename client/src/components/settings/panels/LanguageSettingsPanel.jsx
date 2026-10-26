import { useState } from "react";
import { Check, Globe } from "../../../icons/lucide.js";
import { getLanguage, setLanguage } from "../../../i18n/language.js";

const LANGUAGES = [
  {
    value: "en",
    native: "English",
    subtitle: "Left-to-right layout",
    dir: "ltr",
  },
  {
    value: "fa",
    native: "فارسی",
    subtitle: "چیدمان راست‌به‌چپ — Right-to-left layout",
    dir: "rtl",
  },
];

export function LanguageSettingsPanel({ variant = "desktop" }) {
  const [current, setCurrent] = useState(getLanguage());
  const isMobile = variant === "mobile";

  const pick = (value) => {
    if (value === current) return;
    setCurrent(value);
    setLanguage(value);
  };

  return (
    <div className={isMobile ? "space-y-3 text-xs text-slate-600 dark:text-slate-300" : "space-y-3"}>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        The interface language and text direction change instantly.
      </p>
      <div className="space-y-2">
        {LANGUAGES.map((lang) => {
          const selected = current === lang.value;
          return (
            <button
              key={lang.value}
              type="button"
              onClick={() => pick(lang.value)}
              aria-checked={selected}
              role="radio"
              dir="ltr"
              className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 text-left transition duration-200 ${
                isMobile ? "py-3" : "py-3"
              } ${
                selected
                  ? "border-emerald-500 bg-emerald-100/50 text-emerald-700 shadow-md dark:border-emerald-400 dark:bg-emerald-500/20 dark:text-emerald-200"
                  : "border-emerald-100/70 bg-white/80 text-slate-700 hover:bg-emerald-50/30 dark:border-emerald-500/30 dark:bg-slate-950/50 dark:text-slate-100 dark:hover:bg-slate-900/50"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  selected
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-emerald-100/60 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                }`}
              >
                <Globe size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold" lang={lang.value} dir="ltr">
                  {lang.native}
                </span>
                <span className="block truncate text-[11px] text-slate-500 dark:text-slate-400">
                  {lang.subtitle}
                </span>
              </span>
              {selected ? <Check size={18} className="shrink-0 icon-anim-pop" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
