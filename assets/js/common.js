/* common.js — 헤더/푸터 삽입, 활성 메뉴 표시, 모바일 메뉴 토글, 스크롤 리빌 */
(() => {
  "use strict";

  /** 현재 페이지 식별자 (data-nav 값과 매칭) */
  const currentPage = () => {
    const path = window.location.pathname;
    const file = path.substring(path.lastIndexOf("/") + 1);
    if (file === "" || file === "index.html") return "index";
    return file.replace(/\.html$/, "");
  };

  /** partial HTML을 fetch 해서 대상 요소에 삽입 */
  const injectPartial = async (targetId, url) => {
    const target = document.getElementById(targetId);
    if (!target) return null;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${url} → ${res.status}`);
      target.innerHTML = await res.text();
      return target;
    } catch (err) {
      console.error("[common] partial 삽입 실패:", err);
      return null;
    }
  };

  /** 활성 메뉴 항목에 .active 부여 */
  const markActiveNav = (root) => {
    const page = currentPage();
    root.querySelectorAll("[data-nav]").forEach((link) => {
      if (link.dataset.nav === page) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  };

  /** 모바일 햄버거 메뉴 토글 */
  const wireNavToggle = (root) => {
    const toggle = root.querySelector("[data-nav-toggle]");
    const header = root.querySelector("[data-header]");
    if (!toggle || !header) return;

    const close = () => {
      header.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "메뉴 열기");
    };

    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    });

    // 링크 클릭 또는 데스크톱 확대 시 닫기
    root.querySelectorAll(".nav-list a").forEach((a) =>
      a.addEventListener("click", close)
    );
    window.matchMedia("(min-width: 769px)").addEventListener("change", (e) => {
      if (e.matches) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  };

  /** IntersectionObserver 기반 스크롤 진입 애니메이션 */
  const wireReveal = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = document.querySelectorAll("[data-reveal]");
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((el) => io.observe(el));
  };

  document.addEventListener("DOMContentLoaded", async () => {
    const header = await injectPartial("site-header", "partials/header.html");
    if (header) {
      markActiveNav(header);
      wireNavToggle(header);
    }
    await injectPartial("site-footer", "partials/footer.html");
    wireReveal();
  });
})();
