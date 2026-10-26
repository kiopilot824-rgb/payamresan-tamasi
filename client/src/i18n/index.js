// CHOPEX i18n bootstrap — call initI18n() once before React renders.
// It applies the persisted language, translates the DOM, and (in Persian
// mode) routes date formatting to the Persian calendar via fa-IR.

import { initLanguage, getLanguage } from "./language.js";
import { initTranslator } from "./domTranslator.js";

let originalToLocaleDateString;
let originalToLocaleTimeString;
let originalToLocaleString;
let originalDateTimeFormat;
let datePatched = false;

function installPersianDates() {
  if (datePatched || typeof Date === "undefined") return;
  originalToLocaleDateString = Date.prototype.toLocaleDateString;
  originalToLocaleTimeString = Date.prototype.toLocaleTimeString;
  originalToLocaleString = Date.prototype.toLocaleString;
  originalDateTimeFormat = Intl.DateTimeFormat;

  const faLocale = "fa-IR"; // Persian calendar + Persian digits by default

  const wrap = (original) =>
    function (...args) {
      if (getLanguage() !== "fa") return original.apply(this, args);
      const [locale, options] = args;
      const mergedLocale = locale ?? faLocale;
      const mergedOptions =
        options !== undefined && options !== null ? { ...options } : undefined;
      if (mergedOptions && typeof mergedOptions === "object") {
        // Keep the Persian calendar even when options are provided.
        mergedOptions.calendar = mergedOptions.calendar || "persian";
      }
      return original.call(
        this,
        mergedLocale,
        ...(mergedOptions !== undefined ? [mergedOptions] : []),
      );
    };

  Date.prototype.toLocaleDateString = wrap(originalToLocaleDateString);
  Date.prototype.toLocaleTimeString = wrap(originalToLocaleTimeString);
  Date.prototype.toLocaleString = wrap(originalToLocaleString);

  // Explicitly-English formatters (e.g. new Intl.DateTimeFormat("en-US", …))
  // should follow the UI language too.
  Intl.DateTimeFormat = function (...args) {
    if (getLanguage() === "fa" && (args[0] === "en-US" || args[0] === "en")) {
      args[0] = faLocale;
      if (args[1] && typeof args[1] === "object") {
        args[1] = { ...args[1], calendar: args[1].calendar || "persian" };
      }
    }
    return new originalDateTimeFormat(...args);
  };
  Intl.DateTimeFormat.prototype = originalDateTimeFormat.prototype;
  Object.assign(Intl.DateTimeFormat, {
    supportedLocalesOf: originalDateTimeFormat.supportedLocalesOf,
  });

  datePatched = true;
}

export function initI18n() {
  initLanguage();
  if (getLanguage() === "fa") {
    installPersianDates();
  }
  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => initTranslator());
    if (document.readyState !== "loading") initTranslator();
  }
}
