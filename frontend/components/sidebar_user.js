if (window.location.pathname.endsWith(".html")) {
  const cleanPath = window.location.pathname.replace(".html", "");
  window.location.replace(cleanPath);
}

document.addEventListener("DOMContentLoaded", async () => {
  const sidebarContainer = document.getElementById("sidebar-container");
  if (sidebarContainer) {
    try {
      const res = await fetch("/MyLib/components/sidebar_user.html");
      const html = await res.text();
      sidebarContainer.innerHTML = html;

      // Set active link otomatis
      const currentPath = window.location.pathname.replace(/\/+$/, ""); // hapus trailing slash

      document.querySelectorAll(".sidebar a").forEach((link) => {
        const href = new URL(
          link.href,
          window.location.origin
        ).pathname.replace(/\/+$/, "");

        // skip link logout
        if (
          href === "/MyLib" ||
          href.endsWith("/MyLib/") ||
          link.textContent.includes("Logout")
        )
          return;

        // ambil segmen terakhir dari path (misal: 'dashboard', 'rak_buku', 'dashboard.html')
        const currentSlug = currentPath.split("/").filter(Boolean).pop();
        const hrefSlug = href.split("/").filter(Boolean).pop();

        // bandingkan langsung antara slug atau path penuh
        if (currentSlug === hrefSlug || currentPath === href) {
          link.classList.add("active");
        }
      });

      // Logout handler
      const logoutBtn = document.getElementById("logoutBtn");
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user");
        localStorage.removeItem("currentLoan");
        setTimeout(() => {
          window.location.href = "http://localhost:5001/MyLib/login.html";
        }, 500);
      });
    } catch (error) {
      console.error("Gagal memuat sidebar user:", error);
    }
  }
});
