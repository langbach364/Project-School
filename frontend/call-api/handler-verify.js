function handleVerify(event) {
    event.preventDefault();
    var email = sessionStorage.getItem("forget_password_email");
    var code = document.getElementById("Verification").value;
    var data = {
        email: email,
        code: code
    };

    axios.post("https://api.langbach.io.vn/verify_code", JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            var data = response.data;
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
