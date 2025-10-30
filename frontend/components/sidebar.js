if (window.location.pathname.endsWith(".html")) {
  const cleanPath = window.location.pathname.replace(".html", "");
  window.location.replace(cleanPath);
}

async function loadSidebar() {
  const container = document.getElementById("sidebar-container");
  if (!container) return;

  const response = await fetch("/components/sidebar.html");
  const html = await response.text();
  container.innerHTML = html;

  const currentPath = window.location.pathname.replace(/\/+$/, "");

  document.querySelectorAll(".sidebar a").forEach((link) => {
    const href = new URL(link.href, window.location.origin).pathname.replace(
      /\/+$/,
      ""
    );

    if (href === "/MyLib" || href.endsWith("/MyLib/")) return;

    const currentSlug = currentPath.split("/").pop();
    const hrefSlug = href.split("/").pop();

    if (
      currentSlug === hrefSlug ||
      currentPath === href ||
      currentPath.includes(href)
    ) {
      link.classList.add("active");
    }
  });

  // Logout handler
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      const res = Cookies.remove("token");
      if (res) {
        window.location.href = "http://localhost/MyLib/";
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", loadSidebar);
