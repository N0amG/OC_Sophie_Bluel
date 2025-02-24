import { getData } from "./utils/api.js";

console.log("display.js chargé");

// Récupère les données des projets via l'API
async function getProjectsData() {
	const data = await getData("works");
	return data;
}

// Retourne le code HTML d'un projet
function returnOneProject(project, gallery) {
	if (gallery === ".gallery") {
	return `
		<figure class="project-${project.id}">
			<img src="${project.imageUrl}" alt="${project.title}">
			<figcaption>${project.title}</figcaption>
		</figure>
	`;}
	else if (gallery === ".gallery-modal") {
		return `
		<figure class="project-${project.id}">
			<img src="${project.imageUrl}" alt="${project.title}">
			<i class="fa-solid fa-trash-can"></i>
		</figure>
	`;
	}
}

// Retourne le code HTML de tous les projets en fonction de la catégorie
async function returnAllProjects(category, gallery) {
	let projects = await getProjectsData();
	let html = '';
	projects.forEach(project => {
		if (category.toLowerCase().trim() === "tous" || project.category.name === category.trim()) {
			html += returnOneProject(project, gallery);
		}
	});
	return html;
}

export async function displayProjects(gallery, category = "Tous") {
	try {
		let html = await returnAllProjects(category, gallery);
		document.querySelector(gallery).innerHTML = html;
		return true;
	} catch (error) {
		console.error(error);
		return error;
	}
}

// Gestions des filtres
let currentCategory = "Tous";
async function getAllCategories() {
	let categories = [];
	categories.push(currentCategory);
	const data = await getData("categories");
	data.forEach(category => {
		categories.push(category.name);
	});
	return categories;
}

// Génère les boutons de filtres
async function generateFilters() {
	let categories = await getAllCategories();
	console.log(categories);
	const portfolio = document.querySelector("#portfolio");
	const gallery = document.querySelector(".gallery");
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
	portfolio.insertBefore(ul, gallery);
}

// Gestion des boutons filtres et de l'affichage des projets en conséquence
async function filterManager() {
	generateFilters().then(() => {

		let filtersButtons = document.querySelectorAll(".filter-button");
		filtersButtons.forEach(button => {
			button.addEventListener("click", async () => {
				filtersButtons.forEach(button => button.classList.remove("active"));
				button.classList.add("active");
				currentCategory = button.textContent;
				displayProjects(".gallery", currentCategory);
			});
		});
	});
}

// Affiche la page d'accueil en fonction de la connexion de l'utilisateur
function display() {
	// Afficher le mode d'édition si l'utilisateur est connecté
	if (localStorage.getItem("authToken")) {
		document.querySelector(".edit-banner").classList.remove("no-display");
		document.querySelector(".login").parentElement.remove();

		document.querySelector(".logout").addEventListener("click", () => {
			localStorage.removeItem("authToken");
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

displayProjects(".gallery");
display();  