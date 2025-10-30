import { showNotification } from "/MyLib/components/notification.js";
import { showConfirmModal } from "/MyLib/components/confirmModal.js";

let allBooks = [];

async function getBooks() {
  try {
    const res = await fetch("http://localhost:5001/MyLib/books");
    const data = await res.json();
    console.log(data)
    if (!res.ok) throw new Error("failed to fetch books");

    allBooks = data.data || [];
    renderBooks(allBooks);
  } catch (err) {
    showNotification({ message: "❌ Gagal memuat buku", type: "error" });
    console.error("Fetch error:", err);
  }
}

document.querySelector(".search-container").addEventListener("submit", (e) => {
  e.preventDefault();
  const keyword = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();

  if (!keyword) {
    renderBooks(allBooks);
    return;
  }

  const matched = allBooks.filter((book) => {
  const keywordLower = keyword.toLowerCase();
  return (
    book.title.toLowerCase().includes(keywordLower) ||
    book.author.toLowerCase().includes(keywordLower) ||
    book.publisher.toLowerCase().includes(keywordLower) ||
    (Array.isArray(book.genre) &&
      book.genre.some((g) => g.toLowerCase().includes(keywordLower)))
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

// 🔹 Render daftar buku
function renderBooks(books) {
  const container = document.getElementById("book-list");
  container.innerHTML = "";

  if (!books.length) {
    container.innerHTML = "<p>Tidak ada buku ditemukan.</p>";
    return;
  }

  books.forEach((book, i) => {
    setTimeout(() => {
      card.classList.add("show");
    }, 250 * i);
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <img src="${book.coverUrl || "/MyLib/public/no-cover.png"}" alt="${
      book.title
    }">
      <div class="book-info">
        <h2>${book.title}</h2>
        <p><b>Penulis:</b> ${book.author}</p>
        <p><b>Penerbit:</b> ${book.publisher}</p>
        <p><b>Tahun:</b> ${book.year}</p>
        <p><b>Genre:</b> ${book.genre.map((g) => g).join(", ")}</p>
        <p><b>Rating:</b> ${book.rating || 0}⭐</p>
        <div class="card-buttons">
          <button class="edit" data-id="${book._id}">✏️ Edit</button>
          <button class="delete" data-id="${book._id}">🗑️ Delete</button>
        </div>
      </div>
    `;
    container.appendChild(card);

  });

  addEventListeners(books);
}

// 🔹 Event edit & delete
function addEventListeners(books) {
  document.querySelectorAll(".edit").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const book = books.find((b) => b._id === id);
      if (book) openEditForm(book);
    });
  });

  document.querySelectorAll(".delete").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      const confirm = await showConfirmModal("Hapus buku ini?");
      if (!confirm) return;

      try {
        const res = await fetch(
          `http://localhost:5001/MyLib/delete_book/${id}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error("delete failed");

        showNotification({
          message: "🗑️ Buku berhasil dihapus",
          type: "success",
        });
        getBooks();
      } catch (err) {
        showNotification({ message: "❌ Gagal menghapus buku", type: "error" });
      }
    });
  });
}

// 🔹 Edit form
function openEditForm(book) {
  const formDiv = document.getElementById("edit-form");
  formDiv.classList.add("show");

  for (const key of [
    "title",
    "author",
    "publisher",
    "year",
    "synopsis",
    "rating",
    "coverUrl",
  ]) {
    const input = document.getElementById(`edit-${key}`);
    if (input) input.value = book[key] ?? "";
  }
  document.getElementById("edit-genre").value = (book.genre || []).join(", ");
  document.getElementById("edit-id").value = book._id;
}

document.getElementById("cancelEdit").addEventListener("click", () => {
  document.getElementById("edit-form").classList.remove("show");
});

document
  .getElementById("updateBookForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("edit-id").value;
    const updatedBook = {
      title: document.getElementById("edit-title").value,
      author: document.getElementById("edit-author").value,
      publisher: document.getElementById("edit-publisher").value,
      year: Number(document.getElementById("edit-year").value),
      genre: document
        .getElementById("edit-genre")
        .value.split(",")
        .map((g) => g.trim()),
      synopsis: document.getElementById("edit-synopsis").value,
      rating: Number(document.getElementById("edit-rating").value),
      coverUrl: document.getElementById("edit-coverUrl").value,
    };

    try {
      const res = await fetch(`http://localhost:5001/MyLib/update_book/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBook),
      });

      if (!res.ok) throw new Error("update failed");

      showNotification({
        message: "✅ Buku berhasil diperbarui",
        type: "success",
      });
      document.getElementById("edit-form").classList.remove("show");
      getBooks();
    } catch (err) {
      showNotification({ message: "❌ Gagal memperbarui buku", type: "error" });
    }
  });

// 🔹 Load awal
getBooks();
