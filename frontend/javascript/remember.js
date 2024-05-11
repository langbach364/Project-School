function handleLogin(event) {
  event.preventDefault();
  const log = document.getElementById("log").value;
  const password = document.getElementById("password").value;

  const data = {
    email: log,
    username: log,
    password: password,
  };

  axios.post("http://127.0.0.1:8080/login", JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      console.log(response.data);
      // Lưu token vào cookie, giả sử response.data.token là token bạn muốn lưu
      document.cookie = "authToken=" + response.data.token + "; path=/; max-age=3600"; // Token sẽ hết hạn sau 1 giờ
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

window.onload = function () {
  if (document.cookie.includes("authToken=")) {
    window.location.href = "/dashboard.html"; // Điều hướng đến trang dashboard nếu người dùng đã đăng nhập
  }
}