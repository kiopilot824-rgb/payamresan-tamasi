import { Moon, Sun } from "../../icons/lucide.js";
import { getLanguage, setLanguage } from "../../i18n/language.js";

export default function AuthHeader({
  isLogin,
  isDark,
  themeToggleAnimating,
  onToggleTheme,
  title,
  subtitle,
}) {
  const lang = getLanguage();
  return (
    <div className="relative text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-300 sm:text-sm">
        {subtitle || (isLogin ? "Sign in" : "Create account")}
      </p>
      <h1 className="mt-2 text-2xl font-bold sm:mt-3 sm:text-3xl">
        {title || (isLogin ? "Welcome" : "Join the flock")}
      </h1>
      <div className="absolute right-0 top-0 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setLanguage(lang === "fa" ? "en" : "fa")}
          className="flex h-8 items-center justify-center rounded-full border border-emerald-200 bg-white/80 px-2.5 text-xs font-bold text-emerald-700 transition dark:border-emerald-500/30 dark:bg-slate-950 dark:text-emerald-200 sm:h-10 sm:px-3 sm:text-sm"
          aria-label="Toggle language"
          title="English / فارسی"
        >
          {lang === "fa" ? "EN" : "فا"}
        </button>
        <button
          type="button"
          onClick={onToggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 bg-white/80 text-emerald-700 transition dark:border-emerald-500/30 dark:bg-slate-950 dark:text-emerald-200 sm:h-10 sm:w-10"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <Sun
              key="theme-sun"
              size={18}
              className={`icon-anim-spin-dir ${themeToggleAnimating ? "icon-theme-enter-sun" : ""}`}
            />
          ) : (
            <Moon
              key="theme-moon"
              size={18}
              className={`icon-anim-spin-left ${themeToggleAnimating ? "icon-theme-enter-moon" : ""}`}
            />
          )}
        </button>
      </div>
    </div>
  );
}
