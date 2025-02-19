import { sendRequest } from "./utils/api.js";

//récuperer les données du formulaire
const form = document.getElementById("login-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const username = formData.get("username");
    const password = formData.get("password");
    
    loginRequest(username, password);
});


function loginRequest(username, password) {
    const loginData = {
        email: username,
        password: password
    };

    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    }

    const response = sendRequest("users/login", request);

    return response;
}