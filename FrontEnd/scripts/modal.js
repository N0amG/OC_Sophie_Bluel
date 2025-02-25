import { displayProjects } from "./display.js";
import { sendRequest } from "./utils/api.js";

function displayModal(html) {
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
}

function displayGalleryModal() {
	let html = `
	<div class="modal">
		<div>
			<div class="modal-nav">
				<span class="close">&times;</span>
			</div>
			<h3>Galerie Photo</h3>
		</div>
		<div class="gallery-modal">
		</div>
		<a class="add-button button">Ajouter une photo</a>
	</div>`;

	displayModal(html);

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
			'Authorization': `Bearer ${localStorage.getItem("authToken")}`
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