// 🔔 Komponen Notifikasi Global
export function showNotification({ message, type = "info" }) {
  // cek kalau container belum ada, buat
  let notifContainer = document.getElementById("notif-container");
  if (!notifContainer) {
    notifContainer = document.createElement("div");
    notifContainer.id = "notif-container";
    document.body.appendChild(notifContainer);
  }

  // buat elemen notifikasi
  const notif = document.createElement("div");
  notif.className = `notif-card ${type}`;
  notif.innerHTML = `
    <div class="notif-content">
      <span>${message}</span>
    </div>
  `;

  notifContainer.appendChild(notif);

  // animasi masuk
  setTimeout(() => notif.classList.add("show"), 100);

  // hilang setelah 3 detik
  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}
