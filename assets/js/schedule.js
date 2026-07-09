/* schedule.js — 일정 트랙: 오늘 날짜 기준으로 지난/진행 중 단계 동그라미 색칠 */
(() => {
  "use strict";

  const track = document.getElementById("schedule-track");
  if (!track) return;

  const items = Array.from(track.querySelectorAll(".track__item"));
  const rail = track.querySelector(".track__rail");
  const fill = track.querySelector(".track__rail-fill");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 각 단계: start 이 되었거나 지나면 완료(색칠), [start, end] 사이면 진행 중
  let lastDone = -1;
  items.forEach((li, i) => {
    const start = new Date(li.dataset.start + "T00:00:00");
    const end = new Date((li.dataset.end || li.dataset.start) + "T23:59:59");
    if (today >= start) {
      li.classList.add("is-done");
      lastDone = i;
    }
    if (today >= start && today <= end) {
      li.classList.add("is-current");
    }
  });

  // 레일 위치/진행 길이를 실제 동그라미 위치에 맞춰 계산
  const layoutRail = () => {
    if (!rail) return;
    const dots = items.map((li) => li.querySelector(".track__dot"));
    if (dots.length < 2) return;
    const base = track.getBoundingClientRect().top;
    const centerY = (el) =>
      el.getBoundingClientRect().top - base + el.offsetHeight / 2;
    const first = centerY(dots[0]);
    const last = centerY(dots[dots.length - 1]);
    rail.style.top = `${first}px`;
    rail.style.height = `${last - first}px`;
    if (fill) {
      if (lastDone >= 0) {
        fill.style.top = `${first}px`;
        fill.style.height = `${centerY(dots[lastDone]) - first}px`;
      } else {
        fill.style.height = "0px";
      }
    }
  };

  layoutRail();
  window.addEventListener("resize", layoutRail);
  // 폰트/레이아웃 안정화 후 한 번 더
  window.addEventListener("load", layoutRail);
})();
