function handleVerify(event) {
    event.preventDefault();
    const email = sessionStorage.getItem("forget_password_email");
    const code = document.getElementById("Verification").value;
    const data = {
        email: email,
        code: code
    };

    axios.post("http://127.0.0.1:8080/verify_code", JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            const data = response.data;
            if (!data.success) {
                showToast("Sai mã xác thực")
            } else {
                showToast("Mã xác thực thành công");
                setTimeout(function () {
                    window.location.href = "change_password.html";
                }, 2000);
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("Button").addEventListener("click", handleVerify);
});
