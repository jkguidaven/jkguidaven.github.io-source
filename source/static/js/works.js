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
      container.innerHTML = "<p>Could not load repositories.</p>";
      return;
    }

    repositories.forEach(function (repo) {
      var col = document.createElement("div");
      col.className = "column is-4";

      var languagesHtml = repo.languages
        .map(function (lang) { return "<span>" + lang + "</span>"; })
        .join("");

      col.innerHTML =
        "<div class='repo-card fade-up'>" +
          "<a href='" + repo.link + "' target='_blank' rel='noopener noreferrer'>" +
            "<h3>" + repo.name + "</h3>" +
          "</a>" +
          "<p>" + (repo.description || "No description") + "</p>" +
          "<div class='repo-languages'>" + languagesHtml + "</div>" +
        "</div>";

      container.appendChild(col);
    });
  });
});
