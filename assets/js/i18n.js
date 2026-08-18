/**
 * i18n.js — English / বাংলা switcher
 *
 * Usage in HTML:
 *   <span data-i18n="nav.products">Products</span>
 *   <input data-i18n-placeholder="contact.form.emailPlaceholder">
 *   <a data-i18n-aria="nav.ariaProducts">
 *
 * Translation files live in /assets/lang/en.json and /assets/lang/bn.json.
 * Keys are dot-paths, e.g. "hero.title" -> { hero: { title: "..." } }
 *
 * NOTE: this uses fetch() to load the JSON files, so the site must be served
 * over http(s) — either your cPanel hosting, or locally via e.g.
 *   python3 -m http.server 8080
 * Opening index.html directly as a file:// URL will block the fetch in most
 * browsers; use a local server while developing.
 */

(function () {
  const STORAGE_KEY = "smartmgts-lang";
  const DEFAULT_LANG = "en";
  const SUPPORTED = ["en", "bn"];
  const cache = {};

  // Warn if opened directly as a file (fetch() for language JSON won't work)
  // -----------------------------------------------------------------------
  if (window.location.protocol === "file:") {
    document.addEventListener("DOMContentLoaded", () => {
      const banner = document.createElement("div");
      banner.textContent =
        '⚠ This page was opened directly from disk (file://). Language switching and other features that load data need a local server — try VS Code "Live Server", or run "python -m http.server" in this folder, then open http://localhost:....';
      banner.style.cssText = `
      background:#b91c1c; color:#fff; font-family:sans-serif; font-size:14px;
      padding:10px 16px; text-align:center; position:sticky; top:0; z-index:9999;
    `;
      document.body.prepend(banner);
    });
  }
  // -------------------------------------------------------------------------

  function getStoredLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.includes(stored) ? stored : null;
    } catch (e) {
      return null;
    }
  }

  function setStoredLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore */
    }
  }

  function resolvePath(obj, path) {
    return path
      .split(".")
      .reduce(
        (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
        obj,
      );
  }

  async function loadDictionary(lang) {
    if (cache[lang]) return cache[lang];
    const res = await fetch(`/assets/lang/${lang}.json`, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Could not load language file: ${lang}`);
    const data = await res.json();
    cache[lang] = data;
    return data;
  }

  function applyDictionary(dict, lang) {
    document.documentElement.setAttribute("lang", lang);
    document.body.classList.toggle("lang-bn", lang === "bn");

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = resolvePath(dict, el.getAttribute("data-i18n"));
      if (value !== undefined) el.innerHTML = value;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const value = resolvePath(dict, el.getAttribute("data-i18n-placeholder"));
      if (value !== undefined) el.setAttribute("placeholder", value);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const value = resolvePath(dict, el.getAttribute("data-i18n-aria"));
      if (value !== undefined) el.setAttribute("aria-label", value);
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const value = resolvePath(dict, el.getAttribute("data-i18n-title"));
      if (value !== undefined) el.setAttribute("title", value);
    });

    document.querySelectorAll(".lang-switch button").forEach((btn) => {
      btn.setAttribute(
        "aria-pressed",
        btn.getAttribute("data-lang") === lang ? "true" : "false",
      );
    });

    document.dispatchEvent(
      new CustomEvent("smartmgts:langchange", { detail: { lang, dict } }),
    );
    
  }

  async function setLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    try {
      const dict = await loadDictionary(lang);
      applyDictionary(dict, lang);
      setStoredLang(lang);
    } catch (err) {
      console.error(err);
      if (lang !== DEFAULT_LANG) setLang(DEFAULT_LANG);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".lang-switch button").forEach((btn) => {
      btn.addEventListener("click", () =>
        setLang(btn.getAttribute("data-lang")),
      );
    });

    const initialLang = getStoredLang() || DEFAULT_LANG;
    setLang(initialLang);
  });

  window.smartmgtsI18n = { setLang };
})();
