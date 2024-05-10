function togglePasswordVisibility() {
    var passwordInput = document.getElementById("password");
    var passwordIcon = document.getElementById("togglePassword");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordIcon.classList.remove("bxs-lock-alt");
        passwordIcon.classList.add("bxs-lock-open-alt");
    } else {
        passwordInput.type = "password";
        passwordIcon.classList.remove("bxs-lock-open-alt");
        passwordIcon.classList.add("bxs-lock-alt");
    }
}

function toggleRepeatPasswordVisibility() {
    var repeatPasswordInput = document.getElementById("repeat-password");
    var repeatPasswordIcon = document.getElementById("toggleRepeatPassword");

    if (repeatPasswordInput.type === "password") {
        repeatPasswordInput.type = "text";
        repeatPasswordIcon.classList.remove("bxs-lock-alt");
        repeatPasswordIcon.classList.add("bxs-lock-open-alt");
    } else {
        repeatPasswordInput.type = "password";
        repeatPasswordIcon.classList.remove("bxs-lock-open-alt");
        repeatPasswordIcon.classList.add("bxs-lock-alt");
    }
}
