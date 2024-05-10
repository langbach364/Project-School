export function handleLogin(event) {
  event.preventDefault();
  const log = document.getElementById("log").value;
  const password = document.getElementById("password").value;

  const data = {
    email: log,
    username: log,
    password: password,
  };

  axios.post("http://127.0.0.1:8080/login", JSON.stringify(data), {
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

document.getElementById("sign_in").addEventListener("click", handleLogin);
