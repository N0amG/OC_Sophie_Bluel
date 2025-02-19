import { getData } from "../api/api.js";

console.log("display.js chargé");

// Affichage des projets
async function getProjects() {
    const data = await getData("works");
    console.log(data);
    return data;
}

function addProject(project) {
    let figure = document.createElement("figure");
    let img = document.createElement("img");
    let figcaption = document.createElement("figcaption");

    img.src = project.imageUrl;
    img.alt = project.title;
    figcaption.textContent = project.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    document.querySelector(".gallery").appendChild(figure);
}

function displayProjects(category) {
    let projects = getProjects();
    projects.then(projects => {
        projects.forEach(project => {
            if (category.toLowerCase() === "tous" || project.category.name === category)
                addProject(project);
        });
    });
}

// Gestions des filtres
let currentCategory = "Tous";

function generateFilters() {
    let categories = ["Tous", "Objets", "Appartements", "Hotels & restaurants"];
    const portfolio = document.querySelector("#portfolio-title");
    let ul = document.createElement("ul");
    ul.id = "filters";
    categories.forEach(category => {
        let li = document.createElement("li");
        let button = document.createElement("button");
        button.id = `${category.toLowerCase().trim()}-button`;
        button.className = "filter-button"
        button.type = "button";
        button.textContent = category;

        if (category === currentCategory)
            button.classList.toggle('active')
        li.appendChild(button);
        ul.appendChild(li);
    });
    portfolio.insertAdjacentElement("afterend", ul);
}

function filtersManager() {
    generateFilters();
    displayProjects(currentCategory);
    
    let filtersButtons = document.querySelectorAll(".filter-button");
    filtersButtons.forEach(button => {
        button.addEventListener("click", () => {
            filtersButtons.forEach(button => button.classList.remove("active"));
            button.classList.add("active");
            currentCategory = button.textContent;
            document.querySelector(".gallery").innerHTML = "";
            displayProjects(currentCategory);
        });
    });
}


filtersManager();
