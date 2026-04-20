var DEV_TO_ENDPOINT =
  "https://dev.to/api/articles?username=jkguidaven&per_page=100";

var ARTICLES_CACHE_KEY = "DEVTO_ARTICLES";
var CACHE_TTL_MS = 60 * 60 * 1000;

function devToArticlesFetch() {
  if (localStorage.getItem(ARTICLES_CACHE_KEY)) {
    try {
      var cache = JSON.parse(localStorage.getItem(ARTICLES_CACHE_KEY));
      if (
        cache.articles.length > 0 &&
        CACHE_TTL_MS > Date.now() - new Date(cache.timestamp).getTime()
      ) {
        return Promise.resolve(cache.articles);
      }
    } catch (_) {
      localStorage.removeItem(ARTICLES_CACHE_KEY);
    }
  }

  return fetch(DEV_TO_ENDPOINT)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var articles = data.map(function (a) {
        return {
          title: a.title,
          description: a.description,
          url: a.url,
          cover: a.cover_image || a.social_image || null,
          date: a.readable_publish_date,
          readingMinutes: a.reading_time_minutes,
          tags: Array.isArray(a.tag_list) ? a.tag_list : [],
        };
      });
      persistArticles(articles);
      return articles;
    })
    .catch(function () { return []; });
}

function persistArticles(articles) {
  localStorage.setItem(
    ARTICLES_CACHE_KEY,
    JSON.stringify({ timestamp: new Date(), articles: articles })
  );
}

function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

document.addEventListener("DOMContentLoaded", function () {
  var container = document.querySelector("#devto-articles-container");
  if (!container) return;

  devToArticlesFetch().then(function (articles) {
    container.innerHTML = "";
    container.removeAttribute("aria-hidden");

    if (articles.length === 0) {
      container.innerHTML =
        "<p class='blog-empty'>No articles yet — check back soon, or visit " +
        "<a href='https://dev.to/jkguidaven' target='_blank' rel='noopener noreferrer'>dev.to/jkguidaven</a>.</p>";
      return;
    }

    articles.forEach(function (article, i) {
      var card = document.createElement("article");
      card.className = "blog-card fade-up";
      card.style.transitionDelay = (i * 0.06) + "s";

      var cover = article.cover
        ? "<div class='blog-cover'><img src='" + escapeHtml(article.cover) +
          "' alt='' loading='lazy'></div>"
        : "";

      var tagsHtml = article.tags.slice(0, 3).map(function (t) {
        return "<span>#" + escapeHtml(t) + "</span>";
      }).join("");

      var meta = [];
      if (article.date) meta.push(escapeHtml(article.date));
      if (article.readingMinutes)
        meta.push(article.readingMinutes + " min read");

      card.innerHTML =
        "<a class='blog-link' href='" + escapeHtml(article.url) +
          "' target='_blank' rel='noopener noreferrer'>" +
          cover +
          "<div class='blog-body'>" +
            "<h3 class='blog-title'>" + escapeHtml(article.title) + "</h3>" +
            "<p class='blog-desc'>" + escapeHtml(article.description) + "</p>" +
            (tagsHtml ? "<div class='blog-tags'>" + tagsHtml + "</div>" : "") +
            "<div class='blog-meta'>" + meta.join(" · ") + "</div>" +
          "</div>" +
        "</a>";

      container.appendChild(card);
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    container.querySelectorAll(".fade-up").forEach(function (el) {
      observer.observe(el);
    });
  });
});
