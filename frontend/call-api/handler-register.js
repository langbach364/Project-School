function handleRegister(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  var checkLength = true;

  if (password.length < 8) {
    showToast("Mật khẩu phải có độ dài từ 8 ký tự trở lên");
    checkLength = false;
  }

  const lastTenChars = email.slice(-10);
  var checkEmail = true;
  if (lastTenChars !== "@gmail.com") {
    showToast("Vui lòng nhập gmail để làm tài khoản đăng ký");
    checkEmail = false;
  }

  if (!checkLength || !checkEmail) {
    return;
  }

  const data = {
    email: email,
    username: username,
    password: password,
  };


  function checkPassword() {
    var repeatPassword = document.getElementById("repeat-password").value;
    return password === repeatPassword;
  }
  const check = checkPassword();

  if (!check) {
    showToast("Mật khẩu không trùng khớp");
  } else {
    axios.post("http://127.0.0.1:8080/register", JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json'
      },
    })

      .then(response => {
        const data = response.data;
        if (!data.success) {
          showToast("Email hoặc tên đăng nhập đã tồn tại")
        } else {
          showToast("Đăng ký thành công")
          window.location.href = "sign_in.html";
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("sign_up").addEventListener("click", handleRegister);
});