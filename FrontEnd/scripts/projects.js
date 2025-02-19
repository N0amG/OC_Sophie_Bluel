import { getData } from "./utils/api.js";

console.log("display.js chargé");

// Récupère les données des projets via l'API
async function getProjectsData() {
    const data = await getData("works");
    return data;
}

// Retourne le code HTML d'un projet
function returnOneProject(project) {
    return `
        <figure>
            <img src="${project.imageUrl}" alt="${project.title}">
            <figcaption>${project.title}</figcaption>
        </figure>
    `;
}

// Retourne le code HTML de tous les projets en fonction de la catégorie
async function returnAllProjects(category) {
    let projects = await getProjectsData();
    let html = '';
    projects.forEach(project => {
        if (category.toLowerCase().trim() === "tous" || project.category.name === category.trim()) {
            html += returnOneProject(project);
        }
    });
    return html;
}

// Gestions des filtres
let currentCategory = "Tous";


// Génère les boutons de filtres
function generateFilters() {
    let categories = ["Tous", "Objets", "Appartements", "Hotels & restaurants"];
    const portfolio = document.querySelector("#portfolio-title");
    let ul = document.createElement("ul");
    ul.id = "filters";
    let html = '';
    categories.forEach(category => {
        let activeClass = category === currentCategory ? 'active' : '';
        html += `
            <li>
                <button id="${category.toLowerCase().trim()}-button" class="filter-button ${activeClass}" type="button">
                    ${category}
                </button>
            </li>
        `;
    });
    ul.innerHTML = html;
    portfolio.insertAdjacentElement("afterend", ul);
}

// Gestion des boutons filtres et de l'affichage des projets en conséquence
async function displayManager() {
    generateFilters();
    let html = await returnAllProjects(currentCategory);
    document.querySelector(".gallery").innerHTML = html;
    
    let filtersButtons = document.querySelectorAll(".filter-button");
    filtersButtons.forEach(button => {
        button.addEventListener("click", async () => {
            filtersButtons.forEach(button => button.classList.remove("active"));
            button.classList.add("active");
            currentCategory = button.textContent;
            let html = await returnAllProjects(currentCategory);
            document.querySelector(".gallery").innerHTML = html;
        });
    });
}

// Affiche les projets par défaut
displayManager();