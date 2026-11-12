/**
 * hero-premium.js — Premium scroll reveals + mouse-tracked 3D tilt
 *
 * Replaces the basic IntersectionObserver reveals on the home page with
 * smoother GSAP ScrollTrigger choreography, and adds a subtle 3D tilt to the
 * hero content that tracks the cursor.
 *
 * Copy and button text in the hero are untouched.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ----------------------------------------------------------------
  // 1. Mouse-tracked 3D tilt on hero content
  // ----------------------------------------------------------------
  function initHeroTilt() {
    var wrap = document.querySelector(".fe-hero__card-wrap");
    var hero = document.querySelector(".fe-hero");
    if (!wrap || !hero || reduceMotion) return;

    var rect = hero.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var maxTilt = 6; // degrees

    function onMove(e) {
      var dx = (e.clientX - cx) / (rect.width / 2); // -1..1
      var dy = (e.clientY - cy) / (rect.height / 2); // -1..1

      // Invert Y so tilting the mouse down tilts the card top downward.
      var rotY = dx * maxTilt;
      var rotX = -dy * maxTilt;

      wrap.style.transform =
        "perspective(1000px) rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)";
    }

    hero.addEventListener("mousemove", onMove);

    hero.addEventListener("mouseleave", function () {
      wrap.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    });
  }

  // ----------------------------------------------------------------
  // 2. Premium GSAP scroll reveals
  // ----------------------------------------------------------------
  function initScrollReveals() {
    if (reduceMotion) {
      document
        .querySelectorAll(".fe-reveal-premium, [data-animate-premium]")
        .forEach(function (el) {
          el.classList.add("is-in");
        });
      return;
    }

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      // GSAP unavailable: fall back to CSS-only reveals. Mark elements in so
      // they are visible without animation.
      document
        .querySelectorAll(".fe-reveal-premium, [data-animate-premium]")
        .forEach(function (el) {
          el.classList.add("is-in");
        });
      // Re-enance the CSS hero keyframes since GSAP won't drive the entrance.
      document.documentElement.classList.remove("fe-gsap");
      return;
    }

    document.documentElement.classList.add("fe-gsap");
    gsap.registerPlugin(ScrollTrigger);

    var nodes = gsap.utils.toArray(
      ".fe-reveal-premium, [data-animate-premium]"
    );

    nodes.forEach(function (node) {
      var animateType =
        node.getAttribute("data-animate-premium") || "up";
      var delay = parseFloat(node.getAttribute("data-delay") || "0");
      var duration = 0.85;
      var ease = "power2.out";

      var from = {};
      var to = { opacity: 1, ease: ease, delay: delay };

      if (animateType === "up") {
        from = { y: 40, scale: 0.985, opacity: 0 };
        to.y = 0;
        to.scale = 1;
      } else if (animateType === "down") {
        from = { y: -40, scale: 0.985, opacity: 0 };
        to.y = 0;
        to.scale = 1;
      } else if (animateType === "fade") {
        from = { opacity: 0, filter: "blur(8px)" };
        to.filter = "blur(0px)";
      } else if (animateType === "scale") {
        from = { scale: 0.92, opacity: 0 };
        to.scale = 1;
      } else {
        from = { y: 34, scale: 0.985, opacity: 0 };
        to.y = 0;
        to.scale = 1;
      }

      gsap.fromTo(
        node,
        from,
        to,
        {
          scrollTrigger: {
            trigger: node,
            start: "top 88%",
            end: "bottom 60%",
            toggleActions: "play none none reverse",
            once: true,
          },
          duration: duration,
          clearProps: "none",
        }
      );
    });
  }

  // ----------------------------------------------------------------
  // 3. Hero entrance — staggered, premium (GSAP)
  // ----------------------------------------------------------------
  function initHeroEntrance() {
    if (reduceMotion) return;
    if (typeof gsap === "undefined") return;

    var content = document.querySelector(".fe-hero__content");
    if (!content) return;

    var h1 = content.querySelector("h1");
    var lead = content.querySelector(".fe-hero__lead");
    var btn = content.querySelector(".fe-btn");

    var tl = gsap.timeline();

    tl.set([h1, lead, btn], { y: 30, opacity: 0 })
      .to(h1, {
        y: 0,
        opacity: 1,
        duration: 0.95,
        ease: "power3.out",
      }, 0)
      .to(
        lead,
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
        },
        0.14
      )
      .to(
        btn,
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
        },
        0.28
      );
  }

  // ----------------------------------------------------------------
  // Init
  // ----------------------------------------------------------------
  function init() {
    initHeroTilt();
    initHeroEntrance();
    initScrollReveals();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
