/**
 * main.js — shared site behavior (mobile nav, scroll reveal, small utilities)
 */
;(function () {
  document.addEventListener('DOMContentLoaded', () => {
    /* Mobile nav toggle */
    const navToggle = document.querySelector('[data-nav-toggle]')
    const nav = document.getElementById('primary-nav')
    if (navToggle && nav) {
      navToggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open')
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
      })
      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          nav.classList.remove('is-open')
          navToggle.setAttribute('aria-expanded', 'false')
        })
      })
    }

    /* Mark current page in nav */
    const path = window.location.pathname.split('/').pop() || 'index.html'
    document.querySelectorAll('.nav__list a[href]').forEach(link => {
      link.removeAttribute('aria-current') // clear any hardcoded/stale value first
      const href = link.getAttribute('href')
      if (href === path || (path === '' && href === 'index.html')) {
        link.setAttribute('aria-current', 'page')
      }
    })

    /* Scroll reveal */
    const revealEls = document.querySelectorAll('.reveal')
    if ('IntersectionObserver' in window && revealEls.length) {
      const io = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              io.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      )
      revealEls.forEach(el => io.observe(el))
    } else {
      revealEls.forEach(el => el.classList.add('is-visible'))
    }

    /* Footer year */
    document.querySelectorAll('[data-current-year]').forEach(el => {
      el.textContent = new Date().getFullYear()
    })

    /* Contact form: demo-only submit (no backend wired up yet) */
    const contactForm = document.querySelector('[data-contact-form]')
    if (contactForm) {
      contactForm.addEventListener('submit', e => {
        e.preventDefault()
        const status = contactForm.querySelector('[data-form-status]')
        if (status) status.hidden = false
        contactForm.reset()
      })
    }
  })
})()


// lightbox functionality
document.addEventListener("DOMContentLoaded", function () {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("lightbox-close");

  if (!lightbox || !lightboxImg || !closeBtn) {
    console.warn("Lightbox: required elements not found in the DOM.");
    return;
  }

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  }

  // Event delegation: works for images that don't exist yet at page load,
  // like the product cards rendered later by products-data.js
  document.body.addEventListener("click", (e) => {
    const trigger = e.target.closest(".js-lightbox-trigger");
    if (trigger) {
      openLightbox(trigger.src, trigger.alt);
    }
  });

  closeBtn.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
});