const GITHUB_REPOSITORY_ENDPOINT =
  "https://api.github.com/users/jkguidaven/repos?sort=updated&per_page=100";

const REPO_LOCAL_STORAGE_KEY = "REPOS";

function gitHubRepositoryFetch() {
  if (localStorage.getItem(REPO_LOCAL_STORAGE_KEY)) {
    try {
      const cache = JSON.parse(localStorage.getItem(REPO_LOCAL_STORAGE_KEY));
      const ONE_HOUR = 60 * 60 * 1000;

      if (
        cache.repositories.length > 0 &&
        ONE_HOUR > Date.now() - new Date(cache.timestamp).getTime()
      ) {
        return Promise.resolve(cache.repositories);
      }
    } catch (_) {
      localStorage.removeItem(REPO_LOCAL_STORAGE_KEY);
    }
  }

  return fetch(GITHUB_REPOSITORY_ENDPOINT)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var filtered = data.filter(function (repo) {
        return repo.name !== "jkguidaven.github.io";
      });

      return Promise.all(filtered.map(function (repo) {
        return fetch(repo.languages_url)
          .then(function (res) { return res.json(); })
          .then(function (langs) {
            return {
              name: repo.name,
              description: repo.description,
              link: repo.html_url,
              languages: Object.keys(langs),
            };
          });
      }));
    })
    .then(function (repositories) {
      persistData(repositories);
      return repositories;
    })
    .catch(function () { return []; });
}

function persistData(repositories) {
  localStorage.setItem(
    REPO_LOCAL_STORAGE_KEY,
    JSON.stringify({
      timestamp: new Date(),
      repositories: repositories,
    })
  );
}

document.addEventListener("DOMContentLoaded", function () {
  var container = document.querySelector("#github-repositories-container");
  if (!container) return;

  gitHubRepositoryFetch().then(function (repositories) {
    container.innerHTML = "";
    container.removeAttribute("aria-hidden");

    if (repositories.length === 0) {
      container.innerHTML = "<p class='repos-empty'>Could not load repositories — try refreshing.</p>";
      return;
    }

    var INITIAL_COUNT = 6;

    repositories.forEach(function (repo, i) {
      var card = document.createElement("div");
      card.className = "repo-card fade-up";
      card.style.transitionDelay = (i * 0.06) + "s";

      if (i >= INITIAL_COUNT) {
        card.classList.add("repo-hidden");
      }

      var languagesHtml = repo.languages
        .map(function (lang) { return "<span>" + lang + "</span>"; })
        .join("");

      card.innerHTML =
        "<a class='repo-link' href='" + repo.link + "' target='_blank' rel='noopener noreferrer'>" +
          "<h3 class='repo-name'>" + repo.name + "</h3>" +
          "<p class='repo-desc'>" + (repo.description || "No description") + "</p>" +
          "<div class='repo-languages'>" + languagesHtml + "</div>" +
          "<span class='repo-arrow'>&rarr;</span>" +
        "</a>";

      container.appendChild(card);
    });

    // "Show More" button
    if (repositories.length > INITIAL_COUNT) {
      var remaining = repositories.length - INITIAL_COUNT;
      var btnWrap = document.createElement("div");
      btnWrap.className = "repos-show-more fade-up";

      var btn = document.createElement("button");
      btn.className = "btn-primary-arrow";
      btn.innerHTML =
        "<span class='btn-text'>Show " + remaining + " More</span>" +
        "<span class='btn-arrow'>&rarr;</span>";

      btn.addEventListener("click", function () {
        container.querySelectorAll(".repo-hidden").forEach(function (el, j) {
          el.style.transitionDelay = (j * 0.06) + "s";
          el.classList.remove("repo-hidden");
          observer.observe(el);
        });
        btnWrap.remove();
      });

      btnWrap.appendChild(btn);
      container.parentNode.appendChild(btnWrap);
    }

    // Observe dynamically added cards for scroll-reveal
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    container.querySelectorAll(".fade-up:not(.repo-hidden)").forEach(function (el) {
      observer.observe(el);
    });
    // Also observe the button wrapper
    var btnEl = container.parentNode.querySelector(".repos-show-more");
    if (btnEl) observer.observe(btnEl);
  });
});
