document.addEventListener('DOMContentLoaded', function() {
  function togglePasswordVisibility(id, icon) {
    const passwordField = document.getElementById(id);
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    icon.setAttribute('uk-icon', type === 'password' ? 'icon: lock' : 'icon: unlock');
  }

  function rememberMe() {
    const rememberCheckbox = document.querySelector('input[type="checkbox"]');
    const usernameInput = document.getElementById('log');
    const passwordInput = document.getElementById('password');

    if (rememberCheckbox && usernameInput && passwordInput) {
      if (rememberCheckbox.checked) {
        localStorage.setItem('rememberedUser', usernameInput.value);
        localStorage.setItem('rememberedPassword', btoa(passwordInput.value));
      } else {
        localStorage.removeItem('rememberedUser');
        localStorage.removeItem('rememberedPassword');
      }
    }
  }

  function fillRememberedCredentials() {
    const usernameInput = document.getElementById('log');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.querySelector('input[type="checkbox"]');

    if (usernameInput && passwordInput && rememberCheckbox) {
      const rememberedUser = localStorage.getItem('rememberedUser');
      const rememberedPassword = localStorage.getItem('rememberedPassword');

      if (rememberedUser) {
        usernameInput.value = rememberedUser;
        passwordInput.value = atob(rememberedPassword);
        rememberCheckbox.checked = true;
      }
    }
  }

  fillRememberedCredentials();

  const signInButton = document.getElementById('sign_in');
  if (signInButton) {
    signInButton.addEventListener('click', rememberMe);
  }

  window.togglePasswordVisibility = togglePasswordVisibility;
});
