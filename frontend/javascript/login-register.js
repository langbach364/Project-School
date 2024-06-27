function togglePasswordVisibility(id, icon) {
  const passwordField = document.getElementById(id);
  const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordField.setAttribute('type', type);
  icon.setAttribute('uk-icon', type === 'password' ? 'icon: unlock' : 'icon: lock');
}
