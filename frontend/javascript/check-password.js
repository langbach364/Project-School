document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form").addEventListener("submit", function (event) {
        var password = document.getElementById("password").value;
        var repeatPassword = document.getElementById("repeat-password").value;
        var passwordError = document.getElementById("passwordError");

        if (password === repeatPassword) {
            passwordError.style.display = 'none';
        } else {
            passwordError.style.display = 'block';
            passwordError.textContent = "Passwords do not match.";
            event.preventDefault();
        }
    });
});
