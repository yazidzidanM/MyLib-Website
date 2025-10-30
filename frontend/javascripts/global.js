
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  try {
    const response = await originalFetch(...args);
    if(response.status === 403)return showNotification({
      message: "canno found token or expired, please login",
      type: "error"
    });
    let data;

    try {
      data = await response.clone().json(); 
    } catch {
      return response; 
    }
    
    if (
      data &&
      data.message &&
      data.message.toLowerCase().includes("access denied") &&
      data.status === 403
    ) {
      showNotification("Sesi kamu sudah habis, silakan login ulang.", "error");

      document.cookie = "token=; Max-Age=0; path=/;";

      setTimeout(() => {
        window.location.href = data.redirect || "/MyLib/login";
      }, 1500);

      return Promise.reject("Unauthorized");
    }

    return response;
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
};

function showNotification(message, type = "info") {
  const notif = document.createElement("div");
  notif.textContent = message;
  notif.className = `notif ${type}`;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}
