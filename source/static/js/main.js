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
  const aboutBox = document.querySelector("#about-box");
  const MAX_OFFSET = aboutBox.offsetHeight - 80;
  const bottom = aboutBox.offsetTop + aboutBox.offsetHeight;
  const top = window.scrollY + window.innerHeight;
  const offset = bottom - top + MAX_OFFSET;

  const margin = Math.min(MAX_OFFSET - offset, MAX_OFFSET);
  document.querySelector(".skillset-content").style.marginTop =
    -1 * margin + "px";

  /*
   * This will fadely show or hide the role icons
   */
  if (margin >= MAX_OFFSET - 100) {
    document.querySelectorAll(".role-icon").forEach((icon) => {
      icon.style.opacity = 1;
    });

    document.querySelectorAll(".role-label, .role-content").forEach((box) => {
      box.style.transform = "translate(0)";
      box.style.opacity = "1";
    });
  } else {
    document.querySelectorAll(".role-icon").forEach((icon) => {
      icon.style.opacity = 0;
    });

    document.querySelectorAll(".role-label").forEach((box, i) => {
      box.style.transform = "translate(0, 100%)";
      box.style.opacity = "0";
    });

    document.querySelectorAll(".role-content").forEach((box, i) => {
      box.style.opacity = "0";
    });
  }
}

function animateAffiliationBox() {
  const label = document.querySelector(".companies-info-container .subtitle");
  const hr = document.querySelector(".companies-info-container hr");

  if (window.innerHeight > label.getBoundingClientRect().top + 200) {
    label.style.transform = "translate(0)";
    label.style.opacity = "1";
    hr.style.transform = "translate(0)";
    hr.style.opacity = "1";
  } else {
    label.style.transform = "translate(-100%)";
    label.style.opacity = "0";
    hr.style.transform = "translate(100%)";
    hr.style.opacity = "0";
  }

  if (window.innerHeight > hr.getBoundingClientRect().top + 400) {
    document.querySelectorAll(".company-box").forEach((box) => {
      box.style.transform = "translate(0)";
      box.style.opacity = "1";
    });
  } else {
    document.querySelectorAll(".company-box").forEach((box, i) => {
      const animationType = (i + 1) % 3;

      switch (animationType) {
        case 0:
          box.style.transform = "translate(-100%)";
          break;
        case 1:
          box.style.transform = "translate(100%)";
          break;
        case 2:
          box.style.transform = "translate(0,100%)";
          break;
      }
      box.style.opacity = "0";
    });
  }
}
