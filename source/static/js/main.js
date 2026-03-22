document.addEventListener("DOMContentLoaded", () => {
  // ---------- Navbar burger toggle ----------
  const burgers = document.querySelectorAll(".navbar-burger");
  burgers.forEach((el) => {
    el.addEventListener("click", () => {
      const target = document.querySelector(`#${el.dataset.target}`);
      el.classList.toggle("is-active");
      el.setAttribute("aria-expanded", el.classList.contains("is-active"));
      target.classList.toggle("is-active");
    });
  });

  // ---------- Logo split-merge animation + nav reveal ----------
  const brandLogo = document.getElementById("brand-logo");
  if (brandLogo) {
    setTimeout(() => {
      brandLogo.classList.add("logo-animate");
    }, 100);

    setTimeout(() => {
      document.querySelectorAll(".nav-reveal").forEach((item) => {
        item.classList.add("nav-shown");
      });
    }, 900);
  }

  // ---------- Hero cascade animation ----------
  const heroCascadeEls = document.querySelectorAll(".hero-cascade");
  heroCascadeEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add("animate");
    }, 300 + i * 200);
  });

  // ---------- Scroll direction tracking ----------
  let lastScrollY = window.scrollY;
  let scrollDirection = "down";

  // ---------- Scroll reveal observer ----------
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else if (scrollDirection === "up") {
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(
      ".fade-up, .slide-left, .pop-in, .icon-bounce, .blur-in, .tilt-in, .reveal-wipe, .bubble-in"
    )
    .forEach((el) => {
      revealObserver.observe(el);
    });

  // ---------- Single unified scroll handler ----------
  const navbar = document.querySelector(".navbar");
  const scrollBtn = document.getElementById("scroll-top");
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        scrollDirection = scrollY > lastScrollY ? "down" : "up";
        lastScrollY = scrollY;

        // Navbar
        if (navbar) {
          if (scrollY > 50) {
            navbar.classList.add("scrolled");
            navbar.classList.remove("at-top");
          } else {
            navbar.classList.remove("scrolled");
            navbar.classList.add("at-top");
          }

          if (scrollDirection === "down" && scrollY > 100) {
            navbar.classList.add("navbar-hidden");
          } else {
            navbar.classList.remove("navbar-hidden");
          }
        }

        // Scroll-to-top button
        if (scrollBtn) {
          if (scrollY > 400) {
            scrollBtn.classList.add("show");
          } else {
            scrollBtn.classList.remove("show");
          }
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ---------- Scroll-to-top click ----------
  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
