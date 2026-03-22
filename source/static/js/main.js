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

    // After logo finishes, reveal all nav items at once
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

  window.addEventListener("scroll", () => {
    scrollDirection = window.scrollY > lastScrollY ? "down" : "up";
    lastScrollY = window.scrollY;
  });

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

  // ---------- Sticky navbar + progress bar ----------
  const navbar = document.querySelector(".navbar");


  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
        navbar.classList.remove("at-top");
      } else {
        navbar.classList.remove("scrolled");
        navbar.classList.add("at-top");
      }

      if (scrollDirection === "down" && window.scrollY > 100) {
        navbar.classList.add("navbar-hidden");
      } else {
        navbar.classList.remove("navbar-hidden");
      }

    });
  }

  // ---------- Scroll-to-top button ----------
  const scrollBtn = document.getElementById("scroll-top");
  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        scrollBtn.classList.add("show");
      } else {
        scrollBtn.classList.remove("show");
      }
    });

    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
