(function () {
  const data = window.TESTIMONIALS || [];
  const track = document.querySelector("[data-testimonial-track]");
  const dotsWrap = document.querySelector("[data-testimonial-dots]");
  const prevBtn = document.querySelector("[data-testimonial-prev]");
  const nextBtn = document.querySelector("[data-testimonial-next]");
  const carouselWrap = document.querySelector("[data-testimonial-carousel]");
  if (!track || !data.length) return;

  function getLang() {
    return document.documentElement.getAttribute("lang") || "en";
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function cardHTML(item) {
    const lang = getLang();
    const quote = (item.quote && (item.quote[lang] || item.quote.en)) || "";
    const role = (item.role && (item.role[lang] || item.role.en)) || "";
    const logoInner = item.logo
      ? `<img src="${item.logo}" alt="${item.company} logo" loading="lazy" />`
      : escapeHTML(item.initials || item.company.slice(0, 2).toUpperCase());

    return `
      <li class="testimonial-card">
        <div class="testimonial-card__inner">
          <svg class="testimonial-card__quote-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7 7c-2.2 0-4 1.8-4 4v6h6v-6H6c0-1.1.9-2 2-2V7Zm10 0c-2.2 0-4 1.8-4 4v6h6v-6h-3c0-1.1.9-2 2-2V7Z"/>
          </svg>
          <p class="testimonial-card__quote">${escapeHTML(quote)}</p>
          <div class="testimonial-card__meta">
            <span class="testimonial-card__logo">${logoInner}</span>
            <div>
              <div class="testimonial-card__name">${escapeHTML(item.company)} — ${escapeHTML(item.product)}</div>
              <div class="testimonial-card__role">${escapeHTML(role)}</div>
            </div>
          </div>
        </div>
      </li>`;
  }

  function render() {
    track.innerHTML = data.map(cardHTML).join("");
    update();
  }

  // Re-render whenever the site's EN/বাং toggle actually changes the <html lang="">
  // attribute (i18n.js sets this). Watching the attribute itself — rather than the
  // button click — avoids a race with i18n.js's own click handler, which could fire
  // after ours and leave the carousel one click behind on the first switch.
  new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === "lang") {
        render();
        break;
      }
    }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  let index = 0;
  let perView = getPerView();
  let autoplayTimer = null;

  function getPerView() {
    const w = window.innerWidth;
    if (w >= 1080) return 3;
    if (w >= 720) return 2;
    return 1;
  }

  function maxIndex() {
    return Math.max(0, data.length - perView);
  }

  function update() {
    const firstCard = track.children[0];
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 0;
    const gap = parseFloat(getComputedStyle(track).gap || "0");
    const offset = index * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
    renderDots();
  }

  function renderDots() {
    if (!dotsWrap) return;
    const dotCount = maxIndex() + 1;
    dotsWrap.innerHTML = "";
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-selected", i === index ? "true" : "false");
      dot.setAttribute("aria-label", `Go to review ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function goTo(i) {
    index = Math.min(Math.max(i, 0), maxIndex());
    update();
    restartAutoplay();
  }

  function next() {
    goTo(index >= maxIndex() ? 0 : index + 1);
  }

  function prev() {
    goTo(index <= 0 ? maxIndex() : index - 1);
  }

  prevBtn && prevBtn.addEventListener("click", prev);
  nextBtn && nextBtn.addEventListener("click", next);

  window.addEventListener("resize", () => {
    perView = getPerView();
    index = Math.min(index, maxIndex());
    update();
  });

  // Touch swipe support
  let startX = 0;
  let isTouching = false;
  track.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      isTouching = true;
      stopAutoplay();
    },
    { passive: true }
  );
  track.addEventListener("touchend", (e) => {
    if (!isTouching) return;
    isTouching = false;
    const delta = e.changedTouches[0].clientX - startX;
    if (delta > 40) prev();
    else if (delta < -40) next();
    else restartAutoplay();
  });

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(next, 6000);
  }
  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }
  function restartAutoplay() {
    startAutoplay();
  }

  if (carouselWrap) {
    carouselWrap.addEventListener("mouseenter", stopAutoplay);
    carouselWrap.addEventListener("mouseleave", startAutoplay);
  }

  render();
  startAutoplay();
})();