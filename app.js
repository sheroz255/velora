/* ============================================================
   Velora — Static frontend (no backend)
   Routing via hash: # / #product/slug / #category/slug / #deals
   ============================================================ */

(function () {
  "use strict";

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

  function starsHtml(rating) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.4;
    let html = '<span class="stars" aria-label="' + rating + ' out of 5">';
    for (let i = 0; i < 5; i++) {
      if (i < full) html += "★";
      else if (i === full && half) html += "★";
      else html += "☆";
    }
    html += "</span>";
    return html;
  }

  function badgeClass(badge) {
    if (!badge) return "";
    const b = badge.toLowerCase();
    if (b.includes("flash") || b.includes("deal")) return "flash";
    if (b.includes("premium") || b.includes("rare") || b.includes("choice")) return "premium";
    return "";
  }

  /* ---------- Render helpers ---------- */

  function productCard(p) {
    const btn = p.buttonText || "Check Price";
    return `
      <article class="product-card" data-slug="${p.slug}" role="link" tabindex="0">
        <div class="product-img-wrap">
          ${p.badge ? `<span class="badge ${badgeClass(p.badge)}">${escapeHtml(p.badge)}</span>` : ""}
          <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)}" loading="lazy" />
        </div>
        <div class="product-body">
          <span class="product-brand">${escapeHtml(p.brand || "")}</span>
          <h3 class="product-title">${escapeHtml(p.title)}</h3>
          <div class="product-rating">
            ${starsHtml(p.rating)}
            <span>(${Number(p.reviewCount || 0).toLocaleString()})</span>
          </div>
          <a class="card-btn" href="${escapeAttr(p.amazonUrl)}" target="_blank" rel="noopener noreferrer sponsored" onclick="event.stopPropagation()">
            ${escapeHtml(btn)}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </article>`;
  }

  function productGrid(list) {
    if (!list.length) {
      return `<div class="empty-state"><h3>No products found</h3><p>Try another search or category.</p></div>`;
    }
    return `<div class="product-grid">${list.map(productCard).join("")}</div>`;
  }

  function section(kicker, title, extra = "", body) {
    return `
      <section class="section">
        <div class="section-head">
          <div>
            <p class="section-kicker">${kicker}</p>
            <h2 class="section-title">${title}</h2>
          </div>
          ${extra}
        </div>
        ${body}
      </section>`;
  }

  /* ---------- Views ---------- */

  function viewHome() {
    const featured = PRODUCTS.filter((p) => p.featured);
    const deals = PRODUCTS.filter((p) => p.badge && /deal|flash|choice/i.test(p.badge));
    const all = PRODUCTS.slice(0, 16);

    const catHtml = CATEGORIES.map(
      (c) => `
      <a href="#category/${c.slug}" class="cat-card" data-cat="${c.slug}">
        <span class="cat-icon">${c.label.slice(0, 1)}</span>
        <span class="cat-label">${c.label}</span>
      </a>`
    ).join("");

    return `
      <section class="hero">
        <div>
          <p class="hero-kicker">Curated · Amazon</p>
          <h1>Finds worth opening a new tab for</h1>
          <p>Hand-picked products with real ratings. Check live price on Amazon.</p>
          <a href="#deals" class="hero-cta">
            Browse deals
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </div>
        <div class="hero-stats">
          <div class="hero-stat"><strong>${PRODUCTS.length}</strong><span>Products</span></div>
          <div class="hero-stat"><strong>${CATEGORIES.length}</strong><span>Categories</span></div>
          <div class="hero-stat"><strong>4.7★</strong><span>Avg rating</span></div>
        </div>
      </section>

      ${section("Browse", "Departments", "", `<div class="cat-grid">${catHtml}</div>`)}

      ${section(
        "Limited",
        "Deals & picks",
        `<a href="#deals" class="section-link">View all →</a>`,
        productGrid(deals.length ? deals.slice(0, 8) : featured.slice(0, 8))
      )}

      ${section("Featured", "Editor picks", "", productGrid(featured))}

      ${section("Shop", "All products", "", productGrid(all))}
    `;
  }

  function viewCategory(slug) {
    const cat = CATEGORIES.find((c) => c.slug === slug);
    const list = PRODUCTS.filter((p) => p.category === slug);
    const title = cat ? cat.label : slug;
    return `
      <a href="#" class="back-link">← Back to home</a>
      ${section("Category", title, `<span style="color:var(--muted);font-size:0.85rem">${list.length} items</span>`, productGrid(list))}
    `;
  }

  function viewDeals() {
    const list = PRODUCTS.filter((p) => p.badge && /deal|flash|choice|best/i.test(p.badge));
    const show = list.length ? list : PRODUCTS.filter((p) => p.featured);
    return `
      <a href="#" class="back-link">← Back to home</a>
      ${section("Limited time", "Deals & picks", `<span style="color:var(--muted);font-size:0.85rem">${show.length} items</span>`, productGrid(show))}
    `;
  }

  function viewSearch(q) {
    const term = q.toLowerCase().trim();
    const list = PRODUCTS.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(term)) ||
        (p.brand && p.brand.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term)) ||
        (p.description && p.description.toLowerCase().includes(term))
    );
    return `
      <a href="#" class="back-link">← Back to home</a>
      ${section("Search", `Results for “${escapeHtml(q)}”`, `<span style="color:var(--muted);font-size:0.85rem">${list.length} found</span>`, productGrid(list))}
    `;
  }

  function viewProduct(slug) {
    const p = PRODUCTS.find((x) => x.slug === slug);
    if (!p) {
      return `<div class="empty-state"><h3>Product not found</h3><a href="#" class="back-link">← Home</a></div>`;
    }
    const btn = p.buttonText || "Check Price";
    return `
      <a href="#" class="back-link">← Back</a>
      <div class="detail">
        <div class="detail-img">
          <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)}" />
        </div>
        <div class="detail-info">
          ${p.badge ? `<span class="badge ${badgeClass(p.badge)}" style="position:static;align-self:flex-start">${escapeHtml(p.badge)}</span>` : ""}
          <span class="detail-brand">${escapeHtml(p.brand || "")}</span>
          <h1 class="detail-title">${escapeHtml(p.title)}</h1>
          <div class="detail-meta">
            ${starsHtml(p.rating)}
            <span>${p.rating} · ${Number(p.reviewCount || 0).toLocaleString()} reviews</span>
          </div>
          <p class="detail-desc">${escapeHtml(p.description || "")}</p>
          <a class="buy-btn" href="${escapeAttr(p.amazonUrl)}" target="_blank" rel="noopener noreferrer sponsored">
            ${escapeHtml(btn)}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
          <p style="font-size:0.75rem;color:var(--subtle);margin-top:0.25rem">Opens Amazon in a new tab · affiliate link</p>
        </div>
      </div>
    `;
  }

  /* ---------- Router ---------- */

  function parseHash() {
    const h = (location.hash || "#").slice(1);
    if (!h || h === "/") return { view: "home" };
    if (h === "deals") return { view: "deals" };
    if (h.startsWith("category/")) return { view: "category", slug: h.slice(9) };
    if (h.startsWith("product/")) return { view: "product", slug: h.slice(8) };
    if (h.startsWith("search/")) return { view: "search", q: decodeURIComponent(h.slice(7)) };
    return { view: "home" };
  }

  function render() {
    const route = parseHash();
    const app = $("#app");
    let html = "";

    switch (route.view) {
      case "product":
        html = viewProduct(route.slug);
        break;
      case "category":
        html = viewCategory(route.slug);
        break;
      case "deals":
        html = viewDeals();
        break;
      case "search":
        html = viewSearch(route.q || "");
        break;
      default:
        html = viewHome();
    }

    app.innerHTML = html;
    bindCards();
    updateNav(route);
    window.scrollTo(0, 0);
  }

  function bindCards() {
    $$(".product-card").forEach((card) => {
      const go = () => {
        location.hash = "product/" + card.dataset.slug;
      };
      card.addEventListener("click", go);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go();
        }
      });
    });
  }

  function updateNav(route) {
    $$(".nav-desktop a").forEach((a) => {
      const cat = a.dataset.cat;
      a.classList.toggle("active", route.view === "category" && route.slug === cat);
    });
  }

  function buildNav() {
    const nav = $("#nav-cats");
    if (!nav) return;
    nav.innerHTML = CATEGORIES.map(
      (c) => `<a href="#category/${c.slug}" data-cat="${c.slug}">${c.label}</a>`
    ).join("");
  }

  /* ---------- Search ---------- */

  let searchTimer;
  function setupSearch() {
    const input = $("#search-input");
    if (!input) return;
    input.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        const q = input.value.trim();
        if (q.length >= 2) {
          location.hash = "search/" + encodeURIComponent(q);
        } else if (!q && location.hash.startsWith("#search")) {
          location.hash = "";
        }
      }, 280);
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const q = input.value.trim();
        if (q) location.hash = "search/" + encodeURIComponent(q);
      }
    });
  }

  /* ---------- Utils ---------- */

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }

  /* ---------- Boot ---------- */

  document.addEventListener("DOMContentLoaded", () => {
    buildNav();
    setupSearch();
    render();
    window.addEventListener("hashchange", render);
  });
})();
