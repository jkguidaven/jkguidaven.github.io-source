document.addEventListener("DOMContentLoaded", () => {
  // Navbar burger toggle
  const burgers = document.querySelectorAll(".navbar-burger");
  burgers.forEach((el) => {
    el.addEventListener("click", () => {
      const target = document.querySelector(`#${el.dataset.target}`);
      el.classList.toggle("is-active");
      el.setAttribute("aria-expanded", el.classList.contains("is-active"));
      target.classList.toggle("is-active");
    });
  });

  // Subtle fade-in on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".skill-card, .company-card, .timeline-entry").forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });
});
