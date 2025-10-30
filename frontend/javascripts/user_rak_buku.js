import { showNotification } from "/MyLib/components/notification.js";

let allBooks = [];
let matched = [];
let currentBooks = [];
let container = null;

document.addEventListener("DOMContentLoaded", async () => {
  const modal = document.getElementById("modal-sinopsis");
  const modalTitle = document.getElementById("sinopsis-title");
  const modalText = document.getElementById("sinopsis-text");
  const closeBtn = document.querySelector(".close-btn");
  container = document.getElementById("book-container");

  try {
    const res = await fetch("http://localhost:5001/MyLib/rack_books");
    const data = await res.json();
    allBooks = data.data || [];

    renderBooks(allBooks);

    document
      .querySelector(".search-container")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = document
          .getElementById("searchInput")
          .value.trim()
          .toLowerCase();

        if (!keyword) {
          matched = [];
          renderBooks(allBooks);
          return;
        }

        matched = allBooks.filter((book) => {
          const key = keyword.toLowerCase();
          return (
            book.title.toLowerCase().includes(key) ||
            book.author.toLowerCase().includes(key) ||
            book.publisher.toLowerCase().includes(key) ||
            (Array.isArray(book.genre) &&
              book.genre.some((g) => g.toLowerCase().includes(key)))
          );
        });

        if (matched.length === 0) {
          showNotification({
            message: `❗ Tidak ada buku dengan kata "${keyword}"`,
            type: "warning",
          });
        }

        renderBooks(matched);
      });

    function attachEventListeners() {
      document.querySelectorAll(".btn-sinopsis").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = e.target.dataset.id;
          const selected = currentBooks.find((b) => b._id === id);
          if (!selected) return;

          modalTitle.textContent = selected.title;
          modalText.textContent =
            selected.synopsis || "Sinopsis belum tersedia.";
          modal.style.display = "block";
        });
      });

      document.querySelectorAll(".btn-pinjam").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = e.target.dataset.id;
          const selected = currentBooks.find((b) => b._id === id);
          if (!selected) return;

          showNotification({
            message: "📚 Kamu memilih buku: " + selected.title,
            type: "success",
          });

          const payload = {
            bookId: selected._id,
            bookTitle: selected.title,
          };
          localStorage.setItem("selectedBook", JSON.stringify(payload));

          setTimeout(() => {
            window.location.href =
              "http://localhost:5001/MyLib/user/buat_pinjaman.html";
          }, 1000);
        });
      });
    }

    function renderBooks(books) {
      currentBooks = books;
      container.innerHTML = "";

      if (!books.length) {
        container.innerHTML = "<p>Tidak ada buku ditemukan.</p>";
        return;
      }

      books.forEach((book, i) => {
        const card = document.createElement("div");
        card.className = "book-card";
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "all 0.4s ease";

        card.innerHTML = `
          <img rel="preload" src="${book.coverUrl}" alt="${book.title}" />
          <div class="book-info">
            <h2>${book.title}</h2>
            <p><b>Penulis:</b> ${book.author}</p>
            <p><b>Penerbit:</b> ${book.publisher}</p>
            <p><b>Tahun:</b> ${book.year}</p>
            <p><b>Genre:</b> ${book.genre?.join(", ") || "-"}</p>
            <p><b>Rating:</b> ${book.rating ?? 0}⭐</p>
          </div>
          <div class="card-buttons">
            <button class="btn-sinopsis" data-id="${book._id}">📘 Lihat Sinopsis</button>
            <button class="btn-pinjam" data-id="${book._id}">📖 Pinjam Buku</button>
          </div>
        `;
        container.appendChild(card);

        // animasi delay tiap kartu
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 100 * i);
      });

      attachEventListeners(); // ✅ panggil di sini setelah render
    }

    // Close modal
    closeBtn.addEventListener("click", () => (modal.style.display = "none"));
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  } catch (err) {
    console.error("Gagal memuat buku:", err);
    container.innerHTML = `<p style="color:red;">Gagal memuat data buku.</p>`;
  }
});
