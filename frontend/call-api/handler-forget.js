function handleForget(event) {
    event.preventDefault();
    var email = document.getElementById("forget_password").value;

    var data = {
        email: email,
    };

    if (email === "" || email.slice(- 10) !== "@gmail.com") {
        showToast("Vui lòng nhập email");
    } else {
    sessionStorage.setItem("forget_password_email", email);
    axios.post("https://api.langbach.io.vn/send_code", JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            var data = response.data;
            if (!data.success) {
                showToast("Email không tồn tại")
            } else {
                showToast("Mã xác nhận đã được gửi đến email của bạn")
                setTimeout(function () {
                    window.location.href = "verify.html";
                }, 2000);
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("resetButton").addEventListener("click", handleForget);
});
