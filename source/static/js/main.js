document.addEventListener("DOMContentLoaded", () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach((el) => {
      el.addEventListener("click", () => {
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.querySelector(`#${target}`);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle("is-active");
        el.setAttribute("aria-expanded", true);
        $target.classList.toggle("is-active");
      });
    });
  }

  document.addEventListener("scroll", () => {
    animateSkillsetBox();
    animateAffiliationBox();
  });
});

function animateSkillsetBox() {
  /*
   * This will slightly slide the about box above by 150px when the
   * viewport is getting closer to the element.
   */
  const MAX_OFFSET = 150;
  const aboutBox = document.querySelector("#about-box");
  const bottom = aboutBox.offsetTop + aboutBox.offsetHeight;
  const top = window.scrollY + window.innerHeight;
  const offset = bottom - top + MAX_OFFSET;

  const margin = Math.min(MAX_OFFSET - offset, MAX_OFFSET);
  document.querySelector(".skillset-content").style.marginTop =
    -1 * margin + "px";

  /*
   * This will fadely show or hide the role icons
   */
  document.querySelectorAll(".role-icon").forEach((icon) => {
    if (margin === MAX_OFFSET) {
      icon.style.opacity = 1;
      icon.style.filter = "sepia(60%)";
    } else {
      icon.style.opacity = 0;
      icon.style.filter = "sepia(0)";
    }
  });
}

function animateAffiliationBox() {}
