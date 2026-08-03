/**
 * footer.js — injects the shared footer into any element with id="footer-include".
 * Kept in one file so the footer only needs to be edited once across all pages.
 * Runs synchronously (script tag at the end of <body>) so its data-i18n
 * elements are already in the DOM when i18n.js applies translations.
 */
;(function () {
  const target = document.getElementById('footer-include')
  if (!target) return

  target.innerHTML = `
    <div class="container">
      <div class="footer-grid">

        <div>
          <a href="index.html" class="brand" style="color:#fff; margin-bottom: var(--sp-3); display:inline-flex;">
            <img src="/assets/images/logo.png" alt="SmartMGTS" />
          </a>
          <p data-i18n="footer.blurb">SaaS platforms and web apps for sales &amp; distribution</p>
          <div class="social-row">
            <a href="https://wa.me/8801701019437" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20l1.4-4.2A8 8 0 1 1 9 18.6L4 20Z"/></svg></a>
            <a href="https://www.facebook.com/profile.php?id=61556083424285" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 4h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3V4Z"/></svg></a>
            <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="9" width="4" height="11"/><circle cx="5" cy="5" r="1.6"/><path d="M11 20v-6a3 3 0 0 1 6 0v6M11 9v11"/></svg></a>
            <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6" width="18" height="12" rx="3"/><path d="M11 10l4 2-4 2v-4Z" fill="currentColor" stroke="none"/></svg></a>
          </div>
        </div>
       
        <div>
          <h4 data-i18n="footer.companyTitle">Company</h4>
          <ul class="footer-links">
            <li><a href="about.html" data-i18n="nav.about">About</a></li>
            <li><a href="about.html#team" data-i18n="teamSection.title">The team</a></li>
            <li><a href="contact.html" data-i18n="nav.contact">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 data-i18n="footer.contactTitle">Contact</h4>
          <ul class="footer-links">
            <li><span data-i18n="footer.findUs" style="color:#7284A0; display:block; font-size:0.78rem;">Find us here</span><span data-i18n="footer.address">House 12, Road 13, Sector 4, Uttara, Dhaka</span></li>
            <li><a href="tel:+8801701019437">01701-019437</a></li>
            <li><a href="mailto:contact@smartmgts.com">contact@smartmgts.com</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <span>&copy; <span data-current-year>2026</span> SmartMGTS. <span data-i18n="footer.rights">All rights reserved.</span></span>
        
      </div>
    </div>
  `
})()
