import { showConfirmModal } from "/MyLib/components/confirmModal.js";
import { showNotification } from "/MyLib/components/notification.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("book-container");
  const containerDikembalikan = document.getElementById("returned-container");
  const { username } = JSON.parse(localStorage.getItem("user"));

  if (!username) {
    container.innerHTML = "<p>Please login first.</p>";
    return;
  }

  try {
    const res = await fetch(`http://localhost:5001/MyLib/your_loans?username=${username}`);
    const data = await res.json();
    const pinjaman = data.data || data;

    if (!pinjaman.length) {
      container.innerHTML = "<p>there are no books you can borrow yet.</p>";
      return;
    }

    container.innerHTML = "";
    containerDikembalikan.innerHTML = "";

    pinjaman.forEach((item) => {
      const dataBook = JSON.parse(item.datas_book);
      const card = document.createElement("div");
      card.className = "book-card";

      const cover = dataBook.coverUrl;
      const title = dataBook.title;
      const author = dataBook.author;

      const pinjam = new Date(item.tanggal_pinjaman).toLocaleDateString("id-ID");
      const deadline = new Date(item.deadline_pengembalian).toLocaleDateString("id-ID");

      card.innerHTML = `
        <img src="${cover}" alt="${title}">
        <div class="book-info">
          <h2>${title}</h2>
          <p><strong>Penulis:</strong> ${author}</p>
          <p><strong>Dipinjam:</strong> ${pinjam}</p>
          <p><strong>Deadline:</strong> ${deadline}</p>
          <p class="status ${item.status}"><strong>Status:</strong> ${item.status}</p>
        </div>
        ${
          item.status === "dipinjam"
            ? `<button class="btn-kembalikan" data-id="${item.id}">Return book</button>`
            : `<button class="btn-hapus" data-id="${item.id}">🗑️ Delete history</button>`
        }
      `;

      if (item.status === "dipinjam") container.appendChild(card);
      else containerDikembalikan.appendChild(card);
    });

    // 🔹 Event tombol kembalikan
    container.addEventListener("click", async (e) => {
      const btn = e.target.closest(".btn-kembalikan");
      if (!btn) return;

      const id = btn.dataset.id;
      const pinjamItem = pinjaman.find((p) => p.id == id || p._id == id);
      if (!pinjamItem) return showNotification({
                  message:"data cannot found",
                  type: "error"
                });

      const today = new Date();
      const deadline = new Date(pinjamItem.deadline_pengembalian);
      const status = today <= deadline ? "dikembalikan" : "terlambat";

      const tanggal_pengembalian = new Date()
        .toLocaleString("sv-SE", { hour12: false })
        .replace("T", " ");
      console.log(tanggal_pengembalian);

      const payload = { tanggal_pengembalian, status };

      try {
        const response = await fetch(`http://localhost:5001/MyLib/return_book/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        showNotification({
                    message:"book successfully return",
                    type: "success"
                  });
        btn.closest(".book-card").querySelector(".status").textContent = status;
        btn.remove();
      } catch (err) {
        console.error("❌ Error update:", err);
        showNotification({
                    message:"failed to updating the loans",
                    type: "error"
                  });
      }
    });

    containerDikembalikan.addEventListener("click", async (e) => {
      const btn = e.target.closest(".btn-hapus");
      if (!btn) return;

      const id = btn.dataset.id;
      const confirm = await showConfirmModal("are you sure you want to delete this history?");
      if (!confirm) return;

      try {
        const res = await fetch(`http://localhost:5001/MyLib/delete_loan/${id}`, {
          method: "DELETE",
        });

        const result = await res.json();
        if (res.ok) {
          showNotification({
                      message:"History of borrowing has been deleted.",
                      type: "success"
                    });
          btn.closest(".book-card").remove();
        } else {
          showNotification({
                      message:"Failed to Delete",
                      type: "error"
                    });
        }
      } catch (err) {
        showNotification({
                    message:"something wrong while delete history",
                    type: "error"
                  });
        console.error("❌ Error hapus:", err);
      }
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>failed to get data.</p>";
  }
});
