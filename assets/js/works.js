/* works.js — 발표영상 페이지: 탭 + 카테고리별 렌더링 */
(() => {
  "use strict";

  const CATEGORIES = {
    math: "수학",
    physics: "물리",
    chemistry: "화학",
    biology: "생물",
    earth: "지구과학",
    humanities: "인문",
  };
  const ORDER = Object.keys(CATEGORIES);
  const ALL = "all";                 // '전체' 탭 — 모든 분야 표시
  const TABS = [ALL, ...ORDER];      // 탭 순서 (전체가 맨 앞)
  const DEFAULT_CAT = ALL;

  const els = {
    tabs: document.getElementById("work-tabs"),
    grid: document.getElementById("work-grid"),
    empty: document.getElementById("work-empty"),
  };

  let works = [];

  /** 유효한 탭인지 확인 (전체 포함) */
  const normalizeCat = (raw) =>
    TABS.includes(raw) ? raw : DEFAULT_CAT;

  /** 현재 해시에서 카테고리 결정 */
  const catFromHash = () =>
    normalizeCat(window.location.hash.replace(/^#/, ""));

  /** 안전한 텍스트 노드 생성용 escape */
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  /** 작품 카드 마크업 (showCat: 전체 보기에서 분야 라벨 표시) */
  const cardHTML = (w, showCat) => {
    const team = Array.isArray(w.team) ? w.team.join(", ") : "";
    const desc = w.description
      ? `<p class="work-card__desc">${esc(w.description)}</p>`
      : "";
    const award = w.award
      ? `<span class="work-card__award">${esc(w.award)}</span>`
      : "";
    const cat = showCat && CATEGORIES[w.category]
      ? `<span class="work-card__cat">${esc(CATEGORIES[w.category])}</span>`
      : "";
    // YouTube ID는 이미 URL-safe → 인코딩하지 않음
    const embed = `https://www.youtube-nocookie.com/embed/${w.youtubeId}`;
    const watch = `https://youtu.be/${w.youtubeId}`;
    return `
      <article class="work-card" data-reveal>
        <div class="work-card__video">
          <iframe
            src="${embed}"
            title="${esc(w.title)}"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen></iframe>
        </div>
        <div class="work-card__body">
          ${cat}
          ${award}
          <h3 class="work-card__title">${esc(w.title)}</h3>
          <p class="work-card__team">${esc(team)}</p>
          ${desc}
          <a class="work-card__link" href="${watch}" target="_blank" rel="noopener noreferrer">
            YouTube에서 보기 · 좋아요 · 댓글
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </article>`;
  };

  /** 지정 카테고리 렌더 */
  const render = (cat) => {
    const list = cat === ALL ? works : works.filter((w) => w.category === cat);

    // 탭 활성 상태
    els.tabs.querySelectorAll("[data-cat]").forEach((btn) => {
      const on = btn.dataset.cat === cat;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", String(on));
      btn.tabIndex = on ? 0 : -1;
    });

    if (list.length === 0) {
      els.grid.hidden = true;
      els.grid.innerHTML = "";
      els.empty.hidden = false;
      return;
    }
    els.empty.hidden = true;
    els.grid.hidden = false;
    els.grid.innerHTML = list.map((w) => cardHTML(w, cat === ALL)).join("");

    // 새로 삽입된 카드 리빌 처리
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.grid.querySelectorAll("[data-reveal]").forEach((el) =>
        el.classList.add("is-visible")
      );
    } else {
      requestAnimationFrame(() =>
        els.grid.querySelectorAll("[data-reveal]").forEach((el, i) => {
          el.style.transitionDelay = `${Math.min(i, 6) * 40}ms`;
          el.classList.add("is-visible");
        })
      );
    }
  };

  /** 탭 이벤트 (해시 갱신 → hashchange 에서 렌더) */
  const wireTabs = () => {
    els.tabs.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cat]");
      if (!btn) return;
      const cat = btn.dataset.cat;
      if (catFromHash() === cat) render(cat);
      else window.location.hash = cat;
    });

    // 좌우 화살표 키로 탭 이동
    els.tabs.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const cur = catFromHash();
      const idx = TABS.indexOf(cur);
      const next =
        e.key === "ArrowRight"
          ? TABS[(idx + 1) % TABS.length]
          : TABS[(idx - 1 + TABS.length) % TABS.length];
      window.location.hash = next;
      els.tabs.querySelector(`[data-cat="${next}"]`)?.focus();
    });

    window.addEventListener("hashchange", () => render(catFromHash()));
  };

  const init = async () => {
    if (!els.tabs || !els.grid) return;
    try {
      const res = await fetch("data/works.json");
      if (!res.ok) throw new Error(`works.json → ${res.status}`);
      const data = await res.json();
      works = Array.isArray(data.works) ? data.works : [];
    } catch (err) {
      console.error("[works] 데이터 로드 실패:", err);
      els.grid.hidden = true;
      els.empty.hidden = false;
      els.empty.innerHTML =
        "<p>작품 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>";
      return;
    }
    wireTabs();
    render(catFromHash());
  };

  document.addEventListener("DOMContentLoaded", init);
})();
