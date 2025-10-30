// 🔹 confirmModal.js
export function showConfirmModal(message = "You Want?") {
  return new Promise((resolve) => {
    // kalau modal belum ada, buat
    let modal = document.getElementById("confirm-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "confirm-modal";
      modal.innerHTML = `
        <div class="confirm-backdrop"></div>
        <div class="confirm-box">
          <h3 id="confirm-message"></h3>
          <div class="confirm-actions">
            <button id="confirm-yes">Yes</button>
            <button id="confirm-no">No</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    modal.querySelector("#confirm-message").textContent = message;
    modal.classList.add("show");

    const yesBtn = modal.querySelector("#confirm-yes");
    const noBtn = modal.querySelector("#confirm-no");
    const backdrop = modal.querySelector(".confirm-backdrop");

    // fungsi tutup modal
    function closeModal(value) {
      modal.classList.remove("show");
      setTimeout(() => {
        modal.remove();
        resolve(value);
      }, 200);
    }

    yesBtn.onclick = () => closeModal(true);
    noBtn.onclick = () => closeModal(false);
    backdrop.onclick = () => closeModal(false);
  });
}
