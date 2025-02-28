import { displayProjects } from "./display.js";
import { sendRequest, getData } from "./utils/api.js";

function displayModal(html, parent) {
	const overlay = document.createElement("div");
	overlay.id = "overlay";
	overlay.className = "overlay";
	overlay.innerHTML = html;

	const portfolio = document.getElementById("portfolio");
	const parentDiv = document.querySelector(parent);

	portfolio.insertBefore(overlay, parentDiv);

	const closes = document.querySelectorAll(".close");
	closes.forEach(close => {
		close.addEventListener("click", () => {
			document.querySelectorAll(".overlay").forEach(overlay => portfolio.removeChild(overlay));
		});
	});

	const arrow = document.querySelector(".fa-arrow-left");
	if (arrow) {
		arrow.addEventListener("click", () => {
			arrow.closest(".overlay").remove();
		});
	}
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

	displayProjects(".gallery-modal").then(() => {
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
	});
}



function deleteProject(id = "") {
	const request = {
		method: 'DELETE',
		headers: {
			'Content-type': 'None',
			'Authorization': `Bearer ${localStorage.getItem("authToken").token}`
		}
	}
	sendRequest(`works/${id}`, request).then(() => {
		let displayReload = false;
		document.querySelectorAll(`.project-${id}`).forEach(project => {
			if (project.parentNode.childElementCount === 1)
				displayReload = true;
			project.parentNode.removeChild(project)
		})
		if (displayReload) {
			displayProjects(".gallery")
			displayProjects(".gallery-modal")
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
									<option value="objets">Objets</option>
									<option value="appartements">Appartements</option>
									<option value="hotels & restaurants">Hotels & restaurants</option>
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
	checkFormValidity();
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

			// Met à jour la zone de prévisualisation sans supprimer les éléments
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
				uploadSection.insertAdjacentHTML("beforeend", `<span class="error ${shake}">Fichier trop volumineux</span>`);
			else
				uploadSection.insertAdjacentHTML("beforeend", `<span class="error ${shake}">Type de fichier invalide</span>`);
		}
	});
}

function checkFormValidity() {
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
	fileInput.addEventListener("change", updateValidateButtonState);
	titleInput.addEventListener("input", updateValidateButtonState);
	categorySelect.addEventListener("change", updateValidateButtonState);
	validateButton.addEventListener("click", (event) => {
		event.preventDefault();
		// Envoi du formulaire
		//sendProject(fileInput.files[0], titleInput.value, categorySelect.value);
	});
}

function sendProject(img, title, category) {
	request = {
		headers: {
			"Content-Type": "application/json"
		},
		body: {
			"id": getData("works").length,
			"title": title,
			"imageUrl": img,
			"category": category,
			"userId": localStorage.getItem("authToken").userId
		}
	}
}
