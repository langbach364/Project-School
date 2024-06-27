function handleForget(event) {
    event.preventDefault();
    const email = document.getElementById("forget_password").value;

    const data = {
        email: email,
    };

    if (email === "" || email.slice(- 10) !== "@gmail.com") {
        showToast("Vui lòng nhập email");
    } else {
    sessionStorage.setItem("forget_password_email", email);
    axios.post("http://127.0.0.1:8080/send_code", JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            const data = response.data;
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
