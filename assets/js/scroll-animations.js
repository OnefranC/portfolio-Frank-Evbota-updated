/**
 * Scroll animations for Frank Evbota portfolio.
 * Uses data-animate / .fe-reveal + optional data-delay / data-stagger.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function qsAll(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function setupReveals() {
    var nodes = qsAll("[data-animate], .fe-reveal");
    if (!nodes.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }

    // Stagger siblings that share a data-stagger parent
    qsAll("[data-stagger]").forEach(function (parent) {
      var step = parseFloat(parent.getAttribute("data-stagger")) || 90;
      var kids = qsAll(":scope > [data-animate], :scope > .fe-reveal", parent);
      kids.forEach(function (kid, i) {
        if (!kid.style.getPropertyValue("--fe-delay")) {
          kid.style.setProperty("--fe-delay", i * step + "ms");
        }
      });
    });

    nodes.forEach(function (el) {
      var delay = el.getAttribute("data-delay");
      if (delay && !el.style.getPropertyValue("--fe-delay")) {
        el.style.setProperty("--fe-delay", delay + "ms");
      }
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    nodes.forEach(function (el) {
      io.observe(el);
    });
  }

  function setupParallax() {
    var items = qsAll("[data-parallax]");
    if (!items.length || reduceMotion) return;

    var ticking = false;

    function update() {
      var vh = window.innerHeight;
      items.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.12;
        var rect = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var offset = (center - vh / 2) * speed * -1;
        el.style.setProperty("--fe-parallax-y", offset.toFixed(2) + "px");
      });
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  function setupHeader() {
    var header = document.querySelector(".fe-header");
    if (!header) return;

    // Always reset inline transform on initialization to prevent
    // leftover styles from previous page scroll state
    header.style.transform = "";
    header.classList.remove("is-scrolled");

    var lastY = window.scrollY;
    var ticking = false;

    function update() {
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 24);

      // Hide on scroll down past 240px, show on scroll up (desktop feel)
      if (!reduceMotion && window.innerWidth > 900) {
        if (y > 240 && y > lastY + 4) {
          header.style.transform = "translateY(-100%)";
        } else if (y < lastY - 4 || y <= 240) {
          header.style.transform = "translateY(0)";
        }
      } else {
        header.style.transform = "";
      }

      lastY = y;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    // Determines header scrolled state (hide/show on scroll)
    // Header is always dark theme — no light/dark switching

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  function setupImageHoverLift() {
    // Subtle scale-in for project/media frames when they enter
    var media = qsAll(".fe-project__media, .fe-case-cover img, .fe-about__media, .fe-case-gallery img");
    if (!media.length || reduceMotion || !("IntersectionObserver" in window)) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    media.forEach(function (el) {
      el.classList.add("fe-media-reveal");
      io.observe(el);
    });
  }

  function setupMenu() {
    var btn = document.querySelector("[data-fe-menu]");
    var nav = document.querySelector("[data-fe-nav]");
    if (!btn || !nav) return;

    // Drop any legacy inner close button: the burger itself is now the X.
    var legacyClose = nav.querySelector("[data-fe-close]");
    if (legacyClose && legacyClose.parentNode === nav) {
      legacyClose.parentNode.removeChild(legacyClose);
    }

    var closing = false;

    function openMenu() {
      closing = false;
      nav.classList.remove("is-closing");
      nav.classList.add("is-open");
      btn.classList.add("is-active");
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-label", "Close menu");
    }

    function closeMenu() {
      if (!nav.classList.contains("is-open") || closing) return;
      var done = function () {
        nav.classList.remove("is-open");
        nav.classList.remove("is-closing");
        btn.classList.remove("is-active");
        closing = false;
        btn.setAttribute("aria-expanded", "false");
        btn.setAttribute("aria-label", "Open menu");
      };
      if (reduceMotion) {
        done();
        return;
      }
      closing = true;
      nav.classList.add("is-closing");
      window.setTimeout(done, 170);
    }

    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "fe-nav");
    nav.id = nav.id || "fe-nav";

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (nav.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    qsAll("a", nav).forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (!nav.contains(e.target) && !btn.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (e) {
      if ((e.key === "Escape" || e.key === "Esc") && nav.classList.contains("is-open")) {
        closeMenu();
        if (btn && btn.focus) {
          try { btn.focus({ preventScroll: true }); } catch (err) { /* noop */ }
        }
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 960 && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open", "is-closing");
        btn.classList.remove("is-active");
        closing = false;
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  function init() {
    document.documentElement.classList.add("fe-anim-ready");
    setupMenu();
    setupReveals();
    setupParallax();
    setupHeader();
    setupImageHoverLift();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
