function handleChange(event) {
    event.preventDefault();
    const password = document.getElementById("password").value;
    const repeatPassword = document.getElementById("repeat-password").value;
    const email = sessionStorage.getItem("forget_password_email");
    
    const data = {
        email: email,
        NewPassword: repeatPassword
    };

    var check = password === repeatPassword;
    
    if (check) {
    axios.post("http://127.0.0.1:8080/change_password", JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            const data = response.data;
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
