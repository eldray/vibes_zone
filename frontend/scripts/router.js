document.addEventListener("DOMContentLoaded", () => {
  const contentDiv = document.getElementById("content");
  const navLinks = document.querySelectorAll(".nav-link");

  const loadPage = async (page) => {
    try {
      const response = await fetch(`partials/${page}.html`);
      if (!response.ok) throw new Error("Page not found");
      contentDiv.innerHTML = await response.text();
      document.title = `VibeZone | ${
        page.charAt(0).toUpperCase() + page.slice(1)
      }`;

      // Highlight active nav link
      navLinks.forEach((link) => {
        link.classList.remove("border-indigo-500", "text-gray-900");
        link.classList.add("border-transparent", "text-gray-500");
        if (link.dataset.page === page) {
          link.classList.add("border-indigo-500", "text-gray-900");
          link.classList.remove("border-transparent", "text-gray-500");
        }
      });

      // Execute scripts in the loaded content
      const scripts = contentDiv.querySelectorAll("script");
      scripts.forEach((script) => {
        const newScript = document.createElement("script");
        newScript.type = script.type || "text/javascript";
        newScript.textContent = script.textContent;
        document.body.appendChild(newScript).parentNode.removeChild(newScript);
      });
    } catch (error) {
      contentDiv.innerHTML =
        '<p class="text-center text-red-500">Error loading page</p>';
      console.error(error);
    }
  };

  // Handle URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get("page") || "home";
  loadPage(page);

  // Handle nav link clicks
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      window.history.pushState({}, "", `?page=${page}`);
      loadPage(page);
    });
  });

  // Handle browser back/forward
  window.addEventListener("popstate", () => {
    const page =
      new URLSearchParams(window.location.search).get("page") || "home";
    loadPage(page);
  });
});
