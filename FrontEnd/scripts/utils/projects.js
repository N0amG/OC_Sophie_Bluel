import { getData } from "./api.js";

console.log("display.js chargé");

// Affichage des projets
async function getProjectsData() {
    const data = await getData("works");
    return data;
}

function returnOneProject(project) {
    return `
        <figure>
            <img src="${project.imageUrl}" alt="${project.title}">
            <figcaption>${project.title}</figcaption>
        </figure>
    `;
}

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

// Gestion des filtres et de l'affichage
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

displayManager();