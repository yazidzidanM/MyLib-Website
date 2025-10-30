import { showNotification } from "/MyLib/components/notification.js";

document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("peminjamanTableBody");

  try {
    const response = await fetch("http://localhost:5001/MyLib/loans");
    const result = await response.json();

    if (!response.ok) throw new Error(result.message);

    const data = result.data;
    tableBody.innerHTML = "";

    data.forEach((item, index) => {
      if(item.book_title == "Book has not exist") return
      const statusClass = item.status.toLowerCase().replace(/\s+/g, "-");
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.username}</td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="${item.cover_url || '/MyLib/public/no-cover.png'}" 
                 alt="${item.book_title}" width="40" height="60"
                 style="object-fit:cover; border-radius:4px;">
            <span>${item.book_title}</span>
          </div>
        </td>
        <td>${item.tanggal_pinjaman}</td>
        <td>${item.tanggal_pengembalian || "-"}</td>
        <td><span class="status ${statusClass}">${item.status}</span></td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    tableBody.innerHTML = `<tr><td colspan="6" class="loading">❌ Gagal memuat data peminjaman.</td></tr>`;
  }
});
