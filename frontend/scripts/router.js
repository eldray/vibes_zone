const pages = {
  home: "pages/home.html",
  explore: "pages/explore.html",
  reels: "pages/reels.html",
  messages: "pages/messages.html",
  auth: "pages/auth.html",
  profile: "pages/profile.html",
  notifications: "pages/notifications.html",
  about: "pages/about.html",
  careers: "pages/careers.html",
  brand: "pages/brand.html",
  press: "pages/press.html",
  help: "pages/help.html",
  safety: "pages/safety.html",
  guidelines: "pages/guidelines.html",
  terms: "pages/terms.html",
  stories: "pages/stories.html",
  live: "pages/live.html",
  events: "pages/events.html",
};

const protectedPages = ["profile", "messages", "notifications", "stories"];

const loadPage = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get("page") || "home";
  const contentDiv = document.getElementById("content");

  // Check for protected pages
  const user = JSON.parse(localStorage.getItem("user"));
  if (protectedPages.includes(page) && (!user || !user.id)) {
    history.pushState({}, "", "?page=auth");
    return loadPage(); // Recursively load auth page
  }

  if (!pages[page]) {
    contentDiv.innerHTML = `
      <div class="text-center py-12">
        <h2 class="text-2xl font-bold text-gray-900">404 - Page Not Found</h2>
        <p class="text-gray-500">The page "${page}" does not exist.</p>
      </div>`;
    return;
  }

  try {
    const response = await fetch(pages[page]);
    if (!response.ok) {
      throw new Error(`Failed to load ${pages[page]}: ${response.statusText}`);
    }
    const html = await response.text();
    contentDiv.innerHTML = html;

    // Re-run scripts in the loaded page
    const scripts = contentDiv.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      newScript.type = oldScript.type || "text/javascript";
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  } catch (err) {
    console.error(`Error loading page "${page}":`, err);
    contentDiv.innerHTML = `
      <div class="text-center py-12">
        <h2 class="text-2xl font-bold text-gray-900">Error Loading Page</h2>
        <p class="text-gray-500">Could not load "${page}". Please try again later.</p>
      </div>`;
  }

  // Update active nav link
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    if (link.dataset.page === page) {
      link.classList.add("border-pink-500", "text-gray-900");
      link.classList.remove("border-transparent", "text-gray-500");
    } else {
      link.classList.remove("border-pink-500", "text-gray-900");
      link.classList.add("border-transparent", "text-gray-500");
    }
  });
};

// Load page on initial load and popstate
document.addEventListener("DOMContentLoaded", loadPage);
window.addEventListener("popstate", loadPage);

// Handle nav link clicks
document.addEventListener("click", (e) => {
  const link = e.target.closest(".nav-link");
  if (link) {
    e.preventDefault();
    const page = link.dataset.page;
    history.pushState({}, "", `?page=${page}`);
    loadPage();
  }
});
