/* results.js — 대회결과 페이지: award가 지정된 작품만 분야·등급별로 표시 */
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
  const CAT_ORDER = Object.keys(CATEGORIES);
  // 시상 등급 정렬 순서 (앞쪽이 상위)
  const AWARD_ORDER = ["대상", "금상", "은상", "동상", "장려상"];

  const els = {
    pending: document.getElementById("results-pending"),
    announced: document.getElementById("results-announced"),
    groups: document.getElementById("results-groups"),
  };

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  const awardRank = (a) => {
    const i = AWARD_ORDER.indexOf(a);
    return i === -1 ? AWARD_ORDER.length : i;
  };

  const winnerHTML = (w) => {
    const team = Array.isArray(w.team) ? w.team.join(", ") : "";
    const watch = `https://youtu.be/${w.youtubeId}`;
    return `
      <li class="winner" data-reveal>
        <span class="winner__award award--${esc(w.award)}">${esc(w.award)}</span>
        <div class="winner__body">
          <h3 class="winner__title">
            <a href="${watch}" target="_blank" rel="noopener noreferrer">${esc(w.title)}</a>
          </h3>
          <p class="winner__team">${esc(team)}</p>
        </div>
      </li>`;
  };

  const groupHTML = (cat, winners) => {
    winners.sort((a, b) => awardRank(a.award) - awardRank(b.award));
    return `
      <section class="results-group" data-reveal>
        <h2 class="results-group__title">
          <span class="results-group__label">${esc(CATEGORIES[cat])}</span>
        </h2>
        <ul class="winner-list">
          ${winners.map(winnerHTML).join("")}
        </ul>
      </section>`;
  };

  const render = (works) => {
    const winners = works.filter((w) => w.award);

    if (winners.length === 0) {
      els.pending.hidden = false;
      els.announced.hidden = true;
      return;
    }

    els.pending.hidden = true;
    els.announced.hidden = false;

    const html = CAT_ORDER.map((cat) => {
      const group = winners.filter((w) => w.category === cat);
      return group.length ? groupHTML(cat, group) : "";
    }).join("");

    els.groups.innerHTML = html;
    els.groups
      .querySelectorAll("[data-reveal]")
      .forEach((el) => el.classList.add("is-visible"));
  };

  const init = async () => {
    if (!els.pending || !els.announced) return;
    try {
      const res = await fetch("data/works.json");
      if (!res.ok) throw new Error(`works.json → ${res.status}`);
      const data = await res.json();
      render(Array.isArray(data.works) ? data.works : []);
    } catch (err) {
      console.error("[results] 데이터 로드 실패:", err);
      els.pending.hidden = false;
      els.announced.hidden = true;
    }
  };

  document.addEventListener("DOMContentLoaded", init);
})();
