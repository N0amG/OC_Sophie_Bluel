import { displayProjects } from "./display.js";

function displayModal() {
    let html = `
    <div class="modal">
        <span class="close">&times;</span>
        <h3>Galerie Photo</h3>
        <div class="gallery-modal">
        </div>
    </div>`;

    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.className = "overlay";
    overlay.innerHTML = html;

    const portfolio = document.getElementById("portfolio");
    const gallery = document.querySelector(".gallery-modal");

    portfolio.insertBefore(overlay, gallery);

    const close = document.querySelector(".close");
    close.addEventListener("click", () => {
        portfolio.removeChild(overlay);
    });

    displayProjects(".gallery-modal");

}

document.querySelector(".modify-button").addEventListener("click", displayModal);