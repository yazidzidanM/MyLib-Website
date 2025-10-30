import { showNotification } from "/MyLib/components/notification.js";

document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("anggotaTableBody");

  try {
    const response = await fetch("http://localhost:5001/MyLib/users");
    const result = await response.json();

    if (!response.ok) {
      throw showNotification({
            message:"failed to get all users",
            type: "error"
          });
    }

    if (Array.isArray(result.data) && result.data.length > 0) {
      const sortedUsers = result.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      tableBody.innerHTML = "";
      sortedUsers.forEach((user, index) => {
        if(user.username === "admin1234")return
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${user.username}</td>
          <td>${user.name}</td>
          <td>${new Date(user.created_at).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })}</td>
        `;
        tableBody.appendChild(row);
      });
    } else {
      tableBody.innerHTML = `<tr><td colspan="4" class="loading">No one member founded.</td></tr>`;
    }
  } catch (error) {
    showNotification({
            message:"failed get all users",
            type: "error"
          });
    console.error(error);
    tableBody.innerHTML = `<tr><td colspan="4" class="loading">❌ failed to load data member.</td></tr>`;
  }
});
