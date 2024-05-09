import { login } from '../call-api/src/handler-api.js';

document.addEventListener('DOMContentLoaded', () => {
    const signInButton = document.getElementById('sign_in');
    signInButton.addEventListener('click', async () => {
        const username = document.getElementById('log').value;
        const password = document.getElementById('password').value;
        
        try {
            const result = await login(username, username, password);
            
            if (result.success) {
                window.alert('Login successful');
            } else {
                window.alert('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            window.alert('Login failed');
        }
    });
});
