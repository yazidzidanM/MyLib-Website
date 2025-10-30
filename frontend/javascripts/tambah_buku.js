import { showNotification } from "/MyLib/components/notification.js";
import { showConfirmModal } from "/MyLib/components/confirmModal.js";


const form = document.getElementById("formTambahBuku");
const jsonBox = document.getElementById("jsonData");
const applyJsonBtn = document.getElementById("applyJson");

document.getElementById("pasteCoverUrl").addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    document.getElementById("coverUrl").value = text.trim();
    updateJsonPreview();
  } catch (err) {
    showNotification({
            message:"❌ cannot access clipboard, allow access clipboard in browser",
            type: "info"
          });
    console.error(err);
  }
});

document.getElementById("pasteJson").addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    console.log(text)
    document.getElementById("jsonData").value = text.trim();
  } catch (err) {
    showNotification({
                message:"cannot access clipboard, allow access clipboard in browser",
                type: "error"
              });
    console.error(err);
  }
});

const inputs = {
  title: document.getElementById("title"),
  author: document.getElementById("author"),
  publisher: document.getElementById("publisher"),
  year: document.getElementById("year"),
  genre: document.getElementById("genre"),
  synopsis: document.getElementById("synopsis"),
  rating: document.getElementById("rating"),
  coverUrl: document.getElementById("coverUrl"),
};

function updateJsonPreview() {
  const data = {
    title: inputs.title.value,
    author: inputs.author.value,
    publisher: inputs.publisher.value,
    year: Number(inputs.year.value),
    genre: inputs.genre.value.split(",").map((g) => g.trim()),
    synopsis: inputs.synopsis.value,
    rating: Number(inputs.rating.value),
    coverUrl: inputs.coverUrl.value || "",
  };

  jsonBox.value = JSON.stringify(data, null, 2);
}

Object.values(inputs).forEach((input) => {
  input.addEventListener("input", updateJsonPreview);
});

applyJsonBtn.addEventListener("click", () => {
  try {
    const parsed = JSON.parse(jsonBox.value);
    for (let key in parsed) {
      if (inputs[key]) {
        inputs[key].value =
          key === "genre" ? parsed[key].join(", ") : parsed[key];
      }
    }
    showNotification({
                message:"✅ Data JSON applied to form",
                type: "success"
              });
    updateJsonPreview();
  } catch (e) {
    showNotification({
            message:"❌ JSON format not valid",
            type: "error"
          });
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = JSON.parse(jsonBox.value);

  try {
    const response = await fetch("http://localhost:5001/MyLib/add_book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      showNotification({
            message:"successfully saved the book",
            type: "success"
          });
      const lastCover = inputs.coverUrl.value;

      form.reset();
      inputs.coverUrl.value = lastCover;

      updateJsonPreview();
    } else {
      showNotification({
                  message:"failed to save the book",
                  type: "error"
                });
    }
  } catch (err) {
    showNotification({
                message:"something wrong with server",
                type: ""
              });onsole.error(err);
  }
});

const resetBtn = document.createElement("button");
resetBtn.textContent = "🧹 Reset Form";
resetBtn.type = "button";
resetBtn.className = "btn-apply";
resetBtn.style.marginLeft = "10px";
resetBtn.addEventListener("click", async () => {
  const confirm = await showConfirmModal("really want to reset?");
  if (confirm) {
    form.reset();
    updateJsonPreview();
  }
});

applyJsonBtn.insertAdjacentElement("afterend", resetBtn);

updateJsonPreview();