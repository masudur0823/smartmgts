/**
 * pricing.js — Sales & Distribution Management pricing
 * Base prices are per user / per month, entered by the client:
 *   Starter  (1–10 users):  ৳999
 *   Standard (11–50 users): ৳799
 *   Enterprise (51+ users): custom, contact sales
 * Setup fee: ৳30,000 one-time, same for every tier.
 * Billing cycles: monthly (0% off), half-yearly (5% off), yearly (10% off).
 */
(function () {
  const BASE_PRICE = { starter: 999, standard: 799 };
  const RANGE = { starter: [1, 10], standard: [11, 50] };
  const DISCOUNT = { monthly: 0, half: 0.05, yearly: 0.10 };
  const SETUP_FEE = 30000;
  const BILLED_KEY = { monthly: 'billedMonthly', half: 'billedHalf', yearly: 'billedYearly' };

  let billing = 'monthly';
  let dict = null;

  function fmt(n) {
    return '৳' + Math.round(n).toLocaleString('en-US');
  }

  function priceFor(base) {
    return base * (1 - DISCOUNT[billing]);
  }

  function tierForUsers(users) {
    if (users <= RANGE.starter[1]) return 'starter';
    if (users <= RANGE.standard[1]) return 'standard';
    return 'enterprise';
  }

  function renderTierCards() {
    document.querySelectorAll('[data-tier-price]').forEach((el) => {
      const tier = el.getAttribute('data-tier-price');
      el.textContent = BASE_PRICE[tier] ? fmt(priceFor(BASE_PRICE[tier])) : el.textContent;
    });
    document.querySelectorAll('[data-billed-note]').forEach((el) => {
      if (dict) el.textContent = dict.pricing.billing[BILLED_KEY[billing]];
    });
    document.querySelectorAll('.billing-toggle button').forEach((btn) => {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-billing') === billing ? 'true' : 'false');
    });
  }

  function renderCalc() {
    const input = document.getElementById('calc-users');
    const display = document.getElementById('calc-users-display');
    const tierOut = document.getElementById('calc-tier');
    const priceOut = document.getElementById('calc-price');
    const totalOut = document.getElementById('calc-total');
    const enterpriseNote = document.getElementById('calc-enterprise-note');
    const resultRows = document.getElementById('calc-result-rows');
    if (!input || !dict) return;

    const users = Math.max(1, parseInt(input.value, 10) || 1);
    if (display) display.textContent = users;
    const tier = tierForUsers(users);

    if (tier === 'enterprise') {
      if (resultRows) resultRows.hidden = true;
      if (enterpriseNote) enterpriseNote.hidden = false;
      return;
    }
    if (resultRows) resultRows.hidden = false;
    if (enterpriseNote) enterpriseNote.hidden = true;

    const perUser = priceFor(BASE_PRICE[tier]);
    const total = perUser * users;

    if (tierOut) tierOut.textContent = dict.pricing.tiers[tier].name;
    if (priceOut) priceOut.textContent = fmt(perUser);
    if (totalOut) totalOut.textContent = fmt(total);
  }

  function renderAll() {
    renderTierCards();
    renderCalc();
  }

  document.addEventListener('smartmgts:langchange', (e) => {
    dict = e.detail.dict;
    renderAll();
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.billing-toggle button').forEach((btn) => {
      btn.addEventListener('click', () => {
        billing = btn.getAttribute('data-billing');
        renderAll();
      });
    });
    const input = document.getElementById('calc-users');
    if (input) input.addEventListener('input', renderCalc);
  });
})();
