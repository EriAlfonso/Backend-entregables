import { newPassword } from "../../controllers/session.controller";

document.querySelector('.password-reset-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email= document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirmation = document.getElementById('passwordconfirmation').value;
    if (password !== passwordConfirmation) {
        alert("Passwords do not match. Please re-enter Password.");
        return;
    }
    const response = await fetch('/passwordReset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    });
    const result = await response.json();
    if (!result.success) {
        if (result.message === 'Same as old password') {
            alert("New password can't be the same as the old one. Please choose a different password.");
        } else {
            alert("Password change failed: " + result.message);
        }
        return;
    }
    alert("Password successfully changed!");
    this.submit();
});

