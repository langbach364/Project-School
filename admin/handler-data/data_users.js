import { users, handleUsers, handleDeleteUsers } from "../call-api/handler-user.js";

function displayUsers(users) {
  console.log("Đang hiển thị danh sách người dùng:", users);
  const tableBody = document.getElementById("user-table-body");
  tableBody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${user.user_id}</td>
        <td>${user.username}</td>
        <td>${user.phonenumber}</td>
        <td>${user.email}</td>
        <td><button class="btn btn-danger delete-btn" data-userid="${user.user_id}"><i class="bi bi-x-lg"></i></button></td>
    `;
    row.querySelector(".delete-btn").addEventListener("click", function () {
        handleDeleteUsers(this.getAttribute("data-userid"));
    });

    tableBody.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Trang đã tải xong, đang lấy dữ liệu người dùng");
  handleUsers()
    .then(() => {
      displayUsers(users);
    })
    .catch((error) => {
      console.error("Không thể tải dữ liệu người dùng:", error);
    });
});
