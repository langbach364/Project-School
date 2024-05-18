function handleLogin(event) {
  event.preventDefault();
  const log = document.getElementById("log").value;
  const password = document.getElementById("password").value;

  const data = {
    email: log,
    username: log,
    password: password,
  };

  axios.post("https://191.168.1.171:8443/login", JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("sign_in").addEventListener("click", handleLogin);
});
