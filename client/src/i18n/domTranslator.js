// CHOPEX DOM translator — translates the rendered UI in place when the
// active language is Persian.
//
// The app's UI strings are hard-coded English inside JSX. Instead of wiring a
// t() helper through every component, a MutationObserver watches the DOM and
// swaps exact-match strings using the dictionary in strings.js. Message
// content (user-generated) is never translated.
//
// Design notes:
// - Original text is cached in a WeakMap keyed by the DOM node, so switching
//   back to English restores everything instantly.
// - Mutations are batched per microtask to keep typing/scrolling smooth.
// - Text inside .sb-markdown (message bodies), code/pre blocks, user content
//   marked dir="auto" or data-no-t9n, and form field values is left alone.

import { FA, FA_PATTERNS } from "./strings.js";
import { getLanguage, onChangeLanguage } from "./language.js";

const SKIP_TAGS = new Set([
  "SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE", "PRE", "KBD", "SAMP",
]);

const TRANSLATABLE_ATTRS = ["placeholder", "title", "aria-label", "alt"];

// Data strings that come from the server but are effectively default UI
// labels — translated even inside user-content zones (dir="auto").
const USER_CONTENT_WHITELIST = new Set([
  "Saved messages",
  "Saved Messages",
  "Sent a photo",
  "Sent a video",
  "Sent a document",
  "Sent a voice message",
  "Deleted account",
  "Unknown",
  "online",
  "offline",
  "invisible",
  "last seen recently",
  "last seen an hour ago",
  "last seen yesterday",
  "last seen a week ago",
  "last seen two weeks ago",
  "last seen a month ago",
  "last seen a long time ago",
]);

// Cache of original values so we can restore on switch-back to English.
const originalText = new WeakMap();
const originalAttrs = new WeakMap();

let observer = null;
let scheduled = false;
let pendingNodes = null;
let active = false;

function isUserContentElement(element) {
  if (!element || element.nodeType !== 1) return false;
  if (element.closest("[data-no-t9n]")) return true;
  if (element.closest("pre, code, kbd, samp")) return true;
  if (element.closest(".sb-markdown")) return true;
  // dir="auto" wraps user-generated names/message previews throughout the app
  if (element.closest('[dir="auto"]')) return true;
  if (element.isContentEditable) return true;
  return false;
}

function shouldSkipTextNode(textNode) {
  const parent = textNode.parentElement;
  if (!parent) return true;
  const tag = parent.tagName;
  if (SKIP_TAGS.has(tag)) return true;
  if (USER_CONTENT_WHITELIST.has(textNode.nodeValue.trim())) return false;
  return isUserContentElement(parent);
}

function translateValue(text) {
  if (!text) return null;
  const trimmed = text.trim();
  // 300 keeps long server setting descriptions translatable; a Map hit is O(1).
  if (!trimmed || trimmed.length > 300) return null;
  const hit = FA[trimmed];
  if (hit && hit !== trimmed) {
    return text.replace(trimmed, hit);
  }
  // Dynamic strings ("5 members", "3 unread", "last seen 4 hours ago") —
  // exact keys can't cover them, fall back to the regex rules.
  for (const [pattern, replacement] of FA_PATTERNS) {
    if (pattern.test(trimmed)) {
      return text.replace(trimmed, trimmed.replace(pattern, replacement));
    }
  }
  return null;
}

function translateTextNode(textNode) {
  const text = textNode.nodeValue;
  if (!text || !text.trim()) return;
  const translated = translateValue(text);
  if (translated !== null && translated !== text) {
    if (!originalText.has(textNode)) originalText.set(textNode, text);
    textNode.nodeValue = translated;
  }
}

function restoreTextNode(textNode) {
  const original = originalText.get(textNode);
  if (original !== undefined) {
    textNode.nodeValue = original;
    originalText.delete(textNode);
  }
}

function translateElementAttributes(element) {
  for (const attr of TRANSLATABLE_ATTRS) {
    const value = element.getAttribute(attr);
    if (!value) continue;
    const translated = translateValue(value);
    if (translated !== null && translated !== value) {
      const cacheKey = `attr:${attr}`;
      if (!originalAttrs.has(element)) originalAttrs.set(element, {});
      const cache = originalAttrs.get(element);
      if (!(attr in cache)) cache[attr] = value;
      element.setAttribute(attr, translated);
    }
  }
}

function restoreElementAttributes(element) {
  const cache = originalAttrs.get(element);
  if (!cache) return;
  for (const [attr, value] of Object.entries(cache)) {
    element.setAttribute(attr, value);
  }
  originalAttrs.delete(element);
}

function translateSubtree(root) {
  // Text nodes
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      return shouldSkipTextNode(node)
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT;
    },
  });
  let current = walker.currentNode;
  while (current) {
    translateTextNode(current);
    current = walker.nextNode();
  }

  // Attributes on elements inside the subtree (inputs/textareas included —
  // only their placeholder/title/aria-label are translated, never values)
  if (root.nodeType === 1) {
    translateElementAttributes(root);
    const elements = root.querySelectorAll("*");
    for (const element of elements) {
      translateElementAttributes(element);
    }
  }
}

function restoreSubtree(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.currentNode;
  while (current) {
    restoreTextNode(current);
    current = walker.nextNode();
  }
  if (root.nodeType === 1) {
    restoreElementAttributes(root);
    for (const element of root.querySelectorAll("*")) {
      restoreElementAttributes(element);
    }
  }
}

function scheduleTranslate(nodes) {
  if (pendingNodes) {
    for (const node of nodes) pendingNodes.push(node);
  } else {
    pendingNodes = [...nodes];
  }
  if (scheduled) return;
  scheduled = true;
  Promise.resolve().then(() => {
    scheduled = false;
    const batch = pendingNodes || [];
    pendingNodes = null;
    if (!active) return;
    for (const node of batch) {
      if (!node.isConnected) continue;
      if (node.nodeType === 1) {
        translateSubtree(node);
      } else if (node.nodeType === 3) {
        if (!shouldSkipTextNode(node)) translateTextNode(node);
      }
    }
    translateDocumentTitle();
  });
}

function translateDocumentTitle() {
  if (typeof document === "undefined") return;
  const title = document.title;
  if (!title) return;
  let next = null;
  const trimmed = title.trim();
  const hit = FA[trimmed];
  if (hit) {
    next = title.replace(trimmed, hit);
  } else {
    for (const [pattern, replacement] of FA_PATTERNS) {
      if (pattern.test(trimmed)) {
        next = trimmed.replace(pattern, replacement);
        break;
      }
    }
  }
  if (next && next !== title) document.title = next;
}

function start() {
  if (typeof document === "undefined" || observer) return;
  observer = new MutationObserver((mutations) => {
    const nodes = new Set();
    for (const mutation of mutations) {
      if (mutation.type === "characterData") {
        nodes.add(mutation.target);
      } else if (mutation.type === "attributes") {
        // React re-renders may restore English attribute values
        if (mutation.target?.nodeType === 1) nodes.add(mutation.target);
      } else {
        for (const node of mutation.addedNodes) nodes.add(node);
        if (mutation.removedNodes.length && mutation.target) {
          // Text of a re-rendered parent may have been swapped in place
          nodes.add(mutation.target);
        }
      }
    }
    if (nodes.size) scheduleTranslate(nodes);
  });
  observer.observe(document.body, {
    childList: true,
    characterData: true,
    subtree: true,
  });
}

function stop() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

export function applyTranslations() {
  if (typeof document === "undefined") return;
  if (getLanguage() === "fa") {
    active = true;
    translateSubtree(document.body);
    translateDocumentTitle();
    start();
  } else {
    active = false;
    stop();
    restoreSubtree(document.body);
    if (document.title === "CHOPEX") document.title = "CHOPEX";
  }
}

export function initTranslator() {
  if (typeof document === "undefined") return;
  applyTranslations();
  onChangeLanguage(() => {
    // On switch we reload the page (see setLanguage); translate immediately
    // too so nothing flashes if a reload is suppressed.
    applyTranslations();
  });
}
