function handleRegister(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const data = {
    email: email,
    username: username,
    password: password,
  };

  axios.post(":8080/register", JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

document.getElementById("sign_up").addEventListener("click", handleRegister);
