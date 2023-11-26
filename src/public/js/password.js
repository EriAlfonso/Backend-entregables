import { newPassword } from "../../controllers/session.controller";

document.querySelector('.password-reset-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const password = document.getElementById('password').value;
    const passwordConfirmation = document.getElementById('passwordconfirmation').value;
    if (password !== passwordConfirmation) {
        alert("Passwords do not match. Please re-enter Password.");
        return;
    }
    const checkPassword = await newPassword(password);
    if (checkPassword) {
        alert("New password can't be the same as the old one. Please choose a different password.");
        return;
    }
    this.submit();
});

