/**
 * products-data.js
 * Structural product data (ids, icons, real links) lives here.
 * Translated text (name, description, status label...) comes from
 * assets/lang/en.json / bn.json via the data-i18n dictionary, keyed by id.
 * Cards are (re)rendered whenever the language changes.
 */
(function () {
  // const ICONS = {
  //   shield: '<path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6Z"/><path d="m9 12 2 2 4-4"/>',
  //   grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  //   bag: '<path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  //   store: '<path d="M4 9 5 4h14l1 5"/><path d="M4 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0"/><path d="M5 9v11h14V9"/>',
  //   chart: '<path d="M4 20V10M11 20V4M18 20v-7"/>',
  //   users: '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5.2a3.2 3.2 0 0 1 0 6.1M21.5 20a6 6 0 0 0-5-5.9"/>'
  // };

  const DESC_LIMIT = 80;

  const PRODUCTS = [
    { id: 'dist', icon: 'grid', links: [
      { label: 'peerless.smartmgts.com', url: 'https://peerless.smartmgts.com/' },
      { label: 'fdh.smartmgts.com', url: 'https://fdh.smartmgts.com/' },
      { label: 'mnc.smartmgts.com', url: 'https://mnc.smartmgts.com/' }
    ] },
    { id: 'iso', icon: 'shield', links: [{ label: 'peerless-iso.smartmgts.com', url: 'https://peerless-iso.smartmgts.com/' }] },
    
    { id: 'taj', icon: 'bag', links: [{ label: 'tajmahaltakeaway.smartmgts.com', url: 'https://tajmahaltakeaway.smartmgts.com/' }] },
    { id: 'dokaner', icon: 'store', links: [{ label: 'dokanerponno.smartmgts.com', url: 'https://dokanerponno.smartmgts.com/' }] },
    { id: 'fmcgpro', icon: 'chart', links: [{ label: 'fmcgprobd.smartmgts.com', url: 'https://fmcgprobd.smartmgts.com/' }] },
    { id: 'fmcgprofessionals', icon: 'users', links: [{ label: 'fmcgprofessionals.org', url: 'https://fmcgprofessionals.org/' }] }
  ];

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function card(product, dict) {
    const t = dict.products[product.id];
    const badge = dict.badges[t.status];
    const linksHtml = product.links
      .map((l) => `<a href="${l.url}" target="_blank" rel="noopener">${l.label} &#8599;</a>`)
      .join('');

    const fullDesc = t.desc || '';
    const isLong = fullDesc.length > DESC_LIMIT;
    const shortDesc = isLong ? fullDesc.slice(0, DESC_LIMIT).trim() + '…' : fullDesc;
    const moreLabel = (dict.ui && dict.ui.more) || 'More';

    return `
      <article class="card card--product reveal is-visible">
        <div class="card_img_container">
          <img class="js-lightbox-trigger" src="/assets/images/products/${product.id}.png" alt="${escapeHtml(t.name)}" />
          <span class="badge badge--${t.status} badge--on-image">${badge}</span>
        </div>
        <span class="card--product__tag mono">${t.tag}</span>
        <h4 class="card--product_title">${t.name}</h4>
        <p class="card--product__desc" data-full="${escapeHtml(fullDesc)}">${shortDesc}</p>
        ${isLong ? `<a class="card--product__more" href="/products/${product.id}.html">${moreLabel}&#8594;</a>` : ''}
       
      </article>`;
  }
//  <div class="card--product__links">${linksHtml}</div>
//  <p class="card--product__tag mono">${t.clients}</p>

  function render(dict) {
    document.querySelectorAll('[data-product-grid]').forEach((grid) => {
      grid.innerHTML = PRODUCTS.map((p) => card(p, dict)).join('');
    });
  }

  document.addEventListener('smartmgts:langchange', (e) => render(e.detail.dict));
})();