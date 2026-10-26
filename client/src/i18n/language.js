// CHOPEX language state — persists the UI language and applies <html dir/lang>.
// "fa" → Persian + RTL + Vazirmatn, "en" → English + LTR.

const LANG_KEY = "chopez-language";

const listeners = new Set();
let currentLang = "en";

export function normalizeLanguage(value) {
  return value === "fa" ? "fa" : "en";
}

export function getStoredLanguage() {
  try {
    return normalizeLanguage(localStorage.getItem(LANG_KEY));
  } catch {
    return "en";
  }
}

export function getLanguage() {
  return currentLang;
}

export function isRTL() {
  return currentLang === "fa";
}

export function onChangeLanguage(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitChange() {
  listeners.forEach((listener) => {
    try {
      listener(currentLang);
    } catch {
      /* listener errors must not break the rest */
    }
  });
}

export function applyLanguageToDocument(lang) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (lang === "fa") {
    root.setAttribute("dir", "rtl");
    root.setAttribute("lang", "fa");
    root.classList.add("chopez-fa");
    root.classList.remove("chopez-en");
  } else {
    root.setAttribute("dir", "ltr");
    root.setAttribute("lang", "en");
    root.classList.add("chopez-en");
    root.classList.remove("chopez-fa");
  }
}

// Bootstrap: read persisted language as early as possible (before React).
export function initLanguage() {
  currentLang = getStoredLanguage();
  applyLanguageToDocument(currentLang);
  return currentLang;
}

// Switch language, persist it, then reload so every rendered string,
// date format and layout direction is consistent from the first paint.
export function setLanguage(lang, { reload = true } = {}) {
  const next = normalizeLanguage(lang);
  if (next === currentLang) return;
  try {
    localStorage.setItem(LANG_KEY, next);
  } catch {
    /* storage may be unavailable; still switch for this session */
  }
  currentLang = next;
  applyLanguageToDocument(next);
  emitChange();
  if (reload && typeof window !== "undefined") {
    window.setTimeout(() => window.location.reload(), 60);
  }
}
