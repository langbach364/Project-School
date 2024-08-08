function handleLogin(event) {
  event.preventDefault();
  
  var log = document.getElementById("log").value;
  var save_email = "";
  var save_username = "";
  
  if (log.slice(-10) === "@gmail.com") {
    save_email = log;
  } else {
    save_username = log;
  }
  var password = document.getElementById("password").value;

  var data = {
    email: save_email,
    username: save_username,
    password: password,
  };

  axios.post("https://api.langbach.io.vn/login", JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      var data = response.data;
       if (!data.success) {
        showToast("Tên đăng nhập hoặc mật khẩu không đúng");
       } else {
        showToast("Đăng nhập thành công");
         window.location.href = "home.html";
       }
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("sign_in").addEventListener("click", handleLogin);

  // Ngăn người dùng quay lại trang trước đó
  history.pushState(null, null, window.location.href);
  window.onpopstate = function() {
    history.pushState(null, null, window.location.href);
  };
});
