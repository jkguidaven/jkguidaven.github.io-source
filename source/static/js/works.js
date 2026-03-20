const GITHUB_REPOSITORY_ENDPOINT =
  "https://api.github.com/users/jkguidaven/repos";

const REPO_LOCAL_STORAGE_KEY = "REPOS";

function gitHubRepositoryFetch() {
  if (localStorage.getItem(REPO_LOCAL_STORAGE_KEY)) {
    const cache = JSON.parse(localStorage.getItem(REPO_LOCAL_STORAGE_KEY));
    const currentTimestamp = new Date();
    const timestamp = new Date(cache.timestamp);
    const ONE_HOUR = 60 * 60 * 1000;

    if (
      cache.repositories.length > 0 &&
      ONE_HOUR > currentTimestamp - timestamp
    ) {
      return Promise.resolve(cache.repositories);
    }
  }

  return new Promise((resolve) => {
    axios
      .get(GITHUB_REPOSITORY_ENDPOINT)
      .then(({ data }) => {
        const forResolve = data
          .filter((repo) => repo.name !== "jkguidaven.github.io")
          .map((repository) => getMoreDetails(repository));

        Promise.all(forResolve).then((repositories) => {
          persistData(repositories);
          resolve(repositories);
        });
      })
      .catch((_) => resolve([]));
  });
}

function getMoreDetails(repository) {
  return new Promise((resolve) => {
    axios.get(repository.languages_url).then(({ data }) => {
      resolve({
        name: repository.name,
        description: repository.description,
        link: repository.html_url,
        languages: Object.keys(data),
      });
    });
  });
}

function persistData(repositories) {
  localStorage.setItem(
    REPO_LOCAL_STORAGE_KEY,
    JSON.stringify({
      timestamp: new Date(),
      repositories,
    })
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#github-repositories-container");

  gitHubRepositoryFetch().then((repositories) => {
    container.innerHTML = "";
    repositories.forEach(({ name, description, link, languages }) => {
      const card = document.createElement("div");
      card.classList.add("repo-card");

      let languagesHtml = "";
      languages.forEach((language) => {
        languagesHtml += `<span>${language}</span>`;
      });

      card.innerHTML = `
        <a href='${link}' target='_blank' rel='noreferrer'>
          <h1>${name}</h1>
        </a>
        <p>${description || "No description"}</p>
        <div class='repo-languages'>${languagesHtml}</div>
      `;

      container.append(card);
    });
  });
});
