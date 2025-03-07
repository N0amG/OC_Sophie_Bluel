import { displayProjects, storeProjects } from "./display.js";
import { sendRequest } from "./utils/api.js";

function displayModal(html, parent) {
	let overlay = document.getElementById("overlay");
	if (!overlay) {
		overlay = document.createElement("div");
		overlay.id = "overlay";
		overlay.className = "overlay";
	}
	overlay.innerHTML = html;
	const portfolio = document.getElementById("portfolio");
	const parentDiv = document.querySelector(parent);

	portfolio.insertBefore(overlay, parentDiv);

	const close = document.querySelector(".close");
	close.addEventListener("click", () => {
		portfolio.removeChild(overlay)
	});
	const arrow = document.querySelector(".fa-arrow-left");
	if (arrow) {
		arrow.addEventListener("click", () => {
			close.click();
			displayGalleryModal();
		}
		)
	};
}


function displayGalleryModal() {
	let html = `
	<div class="modal">
		<div>
			<div class="modal-nav">
				<i class="fa-solid fa-xmark close"></i>
			</div>
			<h3>Galerie Photo</h3>
		</div>
		<div class="gallery-modal">
		</div>
		<a class="add-button button">Ajouter une photo</a>
	</div>`;

	displayModal(html, ".gallery-modal");
	document.querySelector(".add-button").addEventListener("click", addProjectModal);

	displayProjects(".gallery-modal")
	const galleryModal = document.querySelector(".gallery-modal");
	const children = Array.from(galleryModal.children);
	children.forEach(child => {
		const trash = child.querySelector(".fa-trash-can");
		if (trash) {
			trash.addEventListener("click", () => {
				const projectId = child.classList[0].split('-').pop();
				deleteProject(projectId);
			})
		}
	});
}



function deleteProject(id = "") {
	const request = {
		method: 'DELETE',
		headers: {
			'Content-type': 'None',
			'Authorization': `Bearer ${localStorage.getItem("authToken")}`
		}
	}
	sendRequest(`works/${id}`, request).then(() => {
		let displayReload = false;
		let projects = JSON.parse(localStorage.getItem("projets"));
		document.querySelectorAll(`.project-${id}`).forEach(project => {
			if (project.parentNode.childElementCount === 1)
				displayReload = true;
			project.parentNode.removeChild(project);
		});
		projects = projects.filter(project => project.id !== Number(id));
		localStorage.setItem("projets", JSON.stringify(projects));
		// Si la galerie est vide, on recharge pour afficher le message d'information
		if (displayReload) {
			displayProjects(".gallery");
			displayProjects(".gallery-modal");
		}
	}).catch((response) => {
		return Error(`Erreur: ${response.status} ${response.statusText}`);
	})
}




document.querySelector(".modify-button").addEventListener("click", displayGalleryModal);



// Modal d'ajout de projet

function addProjectModal() {
	let html = `
		<div class="modal">
			<div class="form-container">
				<div>
					<div class="modal-nav">
						<i class="fa-solid fa-xmark close"></i>
						<i class="fa-solid fa-arrow-left arrow"></i>
					</div>
					<h3>Ajout photo</h3>
				</div>
				<form method="post">

					<div class="modal-content">
						<div class="upload-section">
							<label for="photo-upload" class="upload-label">
								<div class="upload-preview">
									<div class="img-container">
										<img id="preview-image" class="no-display" src="#" alt="Aperçu">
									</div>
									<i class="fa-regular fa-image"></i>
								</div>
								<input type="file" id="photo-upload" accept="image/png, image/jpeg" hidden>
								<a class="button add-pic">+ Ajouter photo</a>
								<span class="info">jpg, png : 4mo max</span>
							</label>
						</div>
						<div>
							<label class="form-label" for="photo-title">Titre</label>
							<input type="text" id="photo-title">
						</div>
						<div>
							<label class="form-label" for="photo-category">Catégorie</label>
							<div class="select-container">
								<i class="fa-solid fa-chevron-down"></i>
								<select id="photo-category">
									<option value="" disabled selected></option>
									<option value="Objets">Objets</option>
									<option value="Appartements">Appartements</option>
									<option value="Hotels & restaurants">Hotels & restaurants</option>
								</select>
							</div>
						</div>
					</div>
					<button id="validate-button" disabled>Valider</button>
				</div>
			</div>
		</form>`;

	displayModal(html);
	imgPreview();
	verifyAndAddProject();
}

function imgPreview() {
	const fileInput = document.getElementById("photo-upload");
	const previewImage = document.getElementById("preview-image");

	fileInput.addEventListener("change", (event) => {
		// Supprime le message d'erreur s'il existe déjà
		const existingError = document.querySelector(".upload-section .error");
		let shake = "";
		if (existingError) {
			existingError.remove();
			shake = "shake";
		}

		const file = event.target.files[0];

		if (file && file.size <= 4 * 1024 * 1024 &&
			(file.type === "image/png" || file.type === "image/jpeg")) { // Fichier valide (<= 4 Mo)
			const reader = new FileReader();
			reader.onload = (e) => {
				previewImage.src = e.target.result;
				previewImage.style.display = "block"; // Réaffiche l'image après le chargement
			};
			reader.readAsDataURL(file);

			// Met à jour la zone de prévisualisation
			const uploadPreview = document.querySelector(".upload-label");
			uploadPreview.innerHTML = "";
			uploadPreview.appendChild(fileInput);
			uploadPreview.appendChild(previewImage);
		} else {
			// Réinitialise l'input pour autoriser une nouvelle sélection
			fileInput.value = "";
			// Affiche le message d'erreur sans supprimer les autres éléments
			const uploadSection = document.querySelector(".upload-label");
			if (file.size > 4 * 1024 * 1024)
				uploadSection.parentElement.insertAdjacentHTML("beforeend", `<span class="error ${shake}">Fichier trop volumineux</span>`);
			else
				uploadSection.parentElement.insertAdjacentHTML("beforeend", `<span class="error ${shake}">Type de fichier invalide</span>`);
		}
	});
}

function verifyAndAddProject() {
	const fileInput = document.getElementById("photo-upload");
	const titleInput = document.getElementById("photo-title");
	const categorySelect = document.getElementById("photo-category");
	const validateButton = document.getElementById("validate-button");

	function updateValidateButtonState() {
		const file = fileInput.files[0];
		const isFileValid = file && file.size <= 4 * 1024 * 1024 &&
			(file.type === "image/png" || file.type === "image/jpeg");
		const isTitleValid = titleInput.value.trim() !== "";
		const isCategoryValid = categorySelect.value !== "";

		validateButton.disabled = !(isFileValid && isTitleValid && isCategoryValid);
	}
	// Vérification des champs avant l'envoi du formulaire
	fileInput.addEventListener("change", updateValidateButtonState);
	titleInput.addEventListener("input", updateValidateButtonState);
	categorySelect.addEventListener("change", updateValidateButtonState);
	validateButton.addEventListener("click", (event) => {
		event.preventDefault();
		// Envoi du formulaire
		sendProject(fileInput.files[0], titleInput.value, categorySelect.value);
	});
}

async function sendProject(file, title, category) {
	try {
		if (!file || !title.trim() || !category.trim()) {
			throw new Error("Veuillez remplir tous les champs");
		}
		const error = document.querySelector(".error")
		if (error)
			error.remove();
		const allCategories = JSON.parse(localStorage.getItem("categories"));
		const categoryId = allCategories[category];

		const formData = new FormData();
		formData.append("title", title);
		formData.append("image", file);
		formData.append("category", categoryId);

		const request = {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("authToken")}`,
			},
			body: formData
		};
		const response = await sendRequest("works", request);
		// Actualision du local storage
		storeProjects().then(() => {
			// Actualisation de la galerie après l'ajout du projet dans local storage
			displayProjects(".gallery");
		});

		// Afficher le message de succès
		let shake = "";
		const modal = document.querySelector(".modal");
		const existingSuccess = document.querySelector(".success");
		if (existingSuccess) {
			existingSuccess.remove();
			shake = "shake";
		}
		modal.insertAdjacentHTML("beforeend", `<span class="success ${shake}">Projet ajouté avec succès</span>`);

	} catch (error) {
		// Retirer le message de succes s'il y en a un
		const existingSuccess = document.querySelector(".success");
		if (existingSuccess) {
			existingSuccess.remove();
		}

		// Afficher le message d'erreur
		let shake = "";
		const modal = document.querySelector(".modal");
		const existingError = document.querySelector(".error");
		if (existingError) {
			existingError.remove();
			shake = "shake";
		}
		modal.insertAdjacentHTML("beforeend", `<span class="error ${shake}">${error.message}</span>`);
	}
}