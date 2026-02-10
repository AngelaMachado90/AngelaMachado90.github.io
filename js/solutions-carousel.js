/* solutions-carousel.js - simple accessible carousel for Solutions section */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector(".solutions-carousel");
    if (!carousel) return;

    const track = carousel.querySelector(".sc-track");
    const slides = Array.from(carousel.querySelectorAll(".sc-slide"));
    const prev = carousel.querySelector(".sc-prev");
    const next = carousel.querySelector(".sc-next");
    const dotsWrap = carousel.querySelector(".sc-dots");
    let index = 0;

    // build dots
    slides.forEach((s, i) => {
      const btn = document.createElement("button");
      btn.setAttribute("aria-label", "Ir para slide " + (i + 1));
      btn.dataset.index = i;
      if (i === 0) btn.classList.add("active");
      btn.addEventListener("click", () => {
        goTo(i);
      });
      dotsWrap.appendChild(btn);
    });

    function update() {
      const offset = -index * 100;
      track.style.transform = `translateX(${offset}%)`;
      Array.from(dotsWrap.children).forEach((b, i) =>
        b.classList.toggle("active", i === index),
      );
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      update();
    }

    if (prev) prev.addEventListener("click", () => goTo(index - 1));
    if (next) next.addEventListener("click", () => goTo(index + 1));

    // keyboard
    carousel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(index - 1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(index + 1);
      }
    });

    // optional swipe support (touch)
    let startX = null;
    carousel.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
      },
      { passive: true },
    );
    carousel.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) goTo(index + 1);
        else goTo(index - 1);
      }
      startX = null;
    });

    // make container focusable for keyboard
    carousel.setAttribute("tabindex", "0");

    // expose for debugging
    window.__solutionsCarousel = { goTo };
  });
})();
