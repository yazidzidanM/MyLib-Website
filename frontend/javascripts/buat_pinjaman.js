import { showNotification } from "/MyLib/components/notification.js";

document.addEventListener("DOMContentLoaded", async () => {
  const usernameInput = document.getElementById("username");
  const bookSelect = document.getElementById("book");
  const tanggalPinjamInput = document.getElementById("tanggal_pinjaman");
  const deadlineInput = document.getElementById("deadline");
  const form = document.getElementById("formPeminjaman");

  const { username } = JSON.parse(localStorage.getItem("user") || "{}");
  if (!username) return showNotification({
      message:"user belum login",
      type: "warning"
    });

  usernameInput.value = username;

  const today = new Date().toISOString().split("T")[0];
  tanggalPinjamInput.value = today;

  const stored = localStorage.getItem("selectedBook");
  let selectedBookId = null;
  if (stored) {
    const { bookId } = JSON.parse(stored);
    selectedBookId = bookId;
  }

  let books = [];

  try {
    const res = await fetch("http://localhost:5001/MyLib/rack_books");
    const data = await res.json();
    books = data.data || data.books || data;

    bookSelect.innerHTML = `<option value="">-- choose book --</option>`;

    books.forEach((book) => {
      const opt = document.createElement("option");
      opt.value = book._id;
      opt.textContent = `${book.title} — ${book.author}`;
      bookSelect.appendChild(opt);
    });

    if (selectedBookId) {
      const selectedBookObj = books.find((b) => b._id === selectedBookId);
      if (selectedBookObj) bookSelect.value = selectedBookId;
    }
  } catch (err) {
    showNotification({
      message: err || "cannet get data",
      type: "error"
    });

  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedBookId = bookSelect.value;
    const selectedBook = books.find((b) => b._id === selectedBookId);
    localStorage.removeItem("selectedBook");

    if (!selectedBook) {
      showNotification({
            message:"choose book first",
            type: "info"
          });
      return;
    }

    const payload = {
      name: document.getElementById("name").value,
      username: usernameInput.value,
      book: selectedBookId,
      tanggal_pinjaman: new Date(tanggalPinjamInput.value)
        .toISOString()
        .replace("T", " ")
        .slice(0, 19),
      tanggal_pengembalian: null,
      deadline_pengembalian: deadlineInput.value,
      status: "dipinjam",
      data_book: selectedBook,
    };

    try {
      const res = await fetch("http://localhost:5001/MyLib/create_loan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        showNotification({
          message: result.message || "✅ Loan successfully saved!",
          type: "success",
        });
      } else {
        showNotification({
          message: result.message || "❌ Loan failed!",
          type: "error",
        });
      }
    } catch (error) {
      showNotification({
            message:"error while save loans : ", err,
            type: "error"
          });
    }
  });
});
