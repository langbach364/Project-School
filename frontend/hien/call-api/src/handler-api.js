async function login(username, email, password) {
  try {
    const data = {
      username: username,
      email: email,
      password: password,
    };
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await axios.post('http://127.0.0.1:8080/login', data, config);
    const success = response.data.success;
    return { success: Boolean(success) };
  } catch (error) {
    console.error("error frontend:", error);
    throw error;
  }
}

export { login };
