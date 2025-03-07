import { sendRequest } from "./utils/api.js";

//récuperer les données du formulaire
const form = document.getElementById("login-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const username = formData.get("username");
    const password = formData.get("password");

    // Vérifier si les champs sont remplis et envoyer la requête
    if (username.trim() && password.trim())
        loginRequest(username, password);
    else 
        printLoginError();
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

    sendRequest("users/login", request).then(data => {
        if (!data.token) {
            throw new Error("Token is undefined");
        }
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.userId);
        // renvoyer vers index.html
        window.location = "../index.html";
    })
        .catch(error => {
            printLoginError();
            return error;
        });
}

function printLoginError() {
    const errorMessage = document.querySelector(".error");
    if (!errorMessage) {
        const errorElement = document.createElement("p");
        errorElement.className = "error";
        errorElement.textContent = "Erreur dans l'email ou le mot de passe";
        const form = document.getElementById("login-form");
        form.appendChild(errorElement);
    } else {
        // Ajouter la classe 'shake' pour déclencher l'animation
        errorMessage.classList.add("shake");

        // Retirer la classe 'shake' après l'animation
        setTimeout(() => {
            errorMessage.classList.remove("shake");
        }, 500);
    }
}