import { getData } from "./utils/api.js";

// Récupère les données des projets via l'API
export async function storeProjects() {
	const data = await getData("works");
	// Stocker les données dans le local storage
	localStorage.setItem("projets", JSON.stringify(data));
}

// Retourne le code HTML d'un projet
function returnOneProject(project, gallery) {
	if (gallery === ".gallery") {
		return `
		<figure class="project-${project.id}">
			<img src="${project.imageUrl}" alt="${project.title}">
			<figcaption>${project.title}</figcaption>
		</figure>
	`;
	}
	else if (gallery === ".gallery-modal") {
		return `
		<figure class="project-${project.id}">
			<img src="${project.imageUrl}" alt="${project.title}">
			<i class="fa-solid fa-trash-can"></i>
		</figure>
	`;
	}
}

const noProjectsMessage = '<span class="no-projects">Aucun projets<span>';
const noDatabaseMessage = '<span class="no-projects">Erreur de connexion à la base de données<span>';

// Retourne le code HTML de tous les projets en fonction de la catégorie
function returnAllProjects(category, gallery) {
	let projects = JSON.parse(localStorage.getItem("projets"));
	let html = '';
	projects.forEach(project => {
		if (category.toLowerCase().trim() === "tous" || project.category.name === category.trim()) {
			html += returnOneProject(project, gallery);
		}
	});
	if (html === '')
		html = noProjectsMessage;
	return html;
}

export function displayProjects(gallery, category = "Tous") {
	try {
		let html = returnAllProjects(category, gallery);
		document.querySelector(gallery).innerHTML = html;
		return true;
	} catch (error) {
		document.querySelector(gallery).innerHTML = noDatabaseMessage;
		return error;
	}
}

// Gestions des filtres
let currentCategory = "Tous";
async function storeCategories() {
	let categories = { "Tous": "Tous" };
	const data = await getData("categories");
	data.forEach(category => {
		categories[category.name] = category.id;
	});
	localStorage.setItem("categories", JSON.stringify(categories));
}

// Génère les boutons de filtres
function generateFilters() {
	let categories = JSON.parse(localStorage.getItem("categories"));
	const portfolio = document.querySelector("#portfolio");
	const gallery = document.querySelector(".gallery");
	let ul = document.createElement("ul");
	ul.id = "filters";
	let html = '';
	Object.keys(categories).forEach(category => {
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
	portfolio.insertBefore(ul, gallery);
}

// Gestion des boutons filtres et de l'affichage des projets en conséquence
function filterManager() {
	generateFilters()

	let filtersButtons = document.querySelectorAll(".filter-button");
	filtersButtons.forEach(button => {
		button.addEventListener("click", () => {
			filtersButtons.forEach(button => button.classList.remove("active"));
			button.classList.add("active");
			currentCategory = button.textContent;
			displayProjects(".gallery", currentCategory);
		});
	});

}

// Affiche la page d'accueil en fonction de la connexion de l'utilisateur
function display() {
	// Afficher le mode d'édition si l'utilisateur est connecté
	displayProjects(".gallery");
	if (localStorage.getItem("authToken")) {
		document.querySelector(".edit-banner").classList.remove("no-display");
		document.querySelector(".login").parentElement.remove();

		document.querySelector(".logout").addEventListener("click", () => {
			localStorage.removeItem("authToken");
			localStorage.removeItem("userId");
			window.location.reload();
		});

		import("./modal.js");
	}

	// Mode d'affiche par défaut
	else {
		document.querySelector(".logout").parentElement.remove();
		// Affiche les projets par défaut
		filterManager();
		document.querySelector(".modify-button").remove();
	}
}

// Attendre que le local storage soit a jour avant d'afficher le site
storeProjects().then(() => display());
storeCategories();

