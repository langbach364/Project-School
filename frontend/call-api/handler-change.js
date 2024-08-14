function handleChange(event) {
    event.preventDefault();
    var password = document.getElementById("password").value;
    var repeatPassword = document.getElementById("repeat-password").value;
    var email = sessionStorage.getItem("forget_password_email");
    
    var data = {
        email: email,
        NewPassword: repeatPassword
    };

    var check = password === repeatPassword;
    
    if (check) {
    axios.post("https://api.langbach.io.vn/change_password", JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            var data = response.data;
            if (!data.success) {
                showToast("Email chưa từng đăng ký hãy quay lại trang đăng ký");
            } else {
                showToast("Đổi mật khẩu thành công");
                setTimeout(function () {
                    window.location.href = "home.html";
                }, 2000);
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    } else {
        showToast("Mật khẩu không khớp");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("sign_up").addEventListener("click", handleChange);
});
