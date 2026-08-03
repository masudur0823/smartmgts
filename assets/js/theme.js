/**
 * theme.js — light/dark mode
 * Persists the choice in localStorage so it holds across pages and visits.
 * Falls back to the visitor's OS preference on first visit.
 */
(function () {
  const STORAGE_KEY = 'smartmgts-theme';
  const root = document.documentElement;

  function systemPreference() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* storage unavailable — theme just won't persist */
    }
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    document.querySelectorAll('.icon-btn[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    });
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#0C1420' : '#F2F5F4');
    }
  }

  // Apply as early as possible (called inline in <head> too — see index.html)
  const initial = getStoredTheme() || systemPreference();
  applyTheme(initial);

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        setStoredTheme(next);
      });
    });
  });

  // Keep in sync if changed in another tab
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) applyTheme(e.newValue);
  });
})();
