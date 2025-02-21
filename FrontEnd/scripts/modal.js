
function displayModal() {
    let html = `
    <div class="modal">
        <h3>Galerie Photo</h3>
        <span class="close">&times;</span>
        <div class="gallery">
        </div>
    </div>`;

    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.className = "overlay";
    overlay.innerHTML = html;

    const portfolio = document.getElementById("portfolio");
    const gallery = document.querySelector(".gallery");

    portfolio.insertBefore(overlay, gallery);

    const close = document.querySelector(".close");
    close.addEventListener("click", () => {
        portfolio.removeChild(overlay);
    });
}
document.querySelector(".modify-button").addEventListener("click", displayModal);