document.addEventListener("DOMContentLoaded", () => {
  // Navbar burger toggle
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );

  if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach((el) => {
      el.addEventListener("click", () => {
        const target = el.dataset.target;
        const $target = document.querySelector(`#${target}`);
        el.classList.toggle("is-active");
        el.setAttribute("aria-expanded", el.classList.contains("is-active"));
        $target.classList.toggle("is-active");
      });
    });
  }

  // Scroll fade-in animation
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

  document.querySelectorAll(".fade-up").forEach((el) => {
    observer.observe(el);
  });
});
