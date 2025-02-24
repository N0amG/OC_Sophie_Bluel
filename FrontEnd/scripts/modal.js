import { displayProjects } from "./display.js";
import { sendRequest } from "./utils/api.js";

function displayModal() {
	let html = `
	<div class="modal">
		<div>
			<span class="close">&times;</span>
			<h3>Galerie Photo</h3>
		</div>
		<div class="gallery-modal">
		</div>
		<a href="#" class="add-button button">Ajouter une photo</a>
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

	displayProjects(".gallery-modal").then(() => {
		const galleryModal = document.querySelector(".gallery-modal");
		const children = Array.from(galleryModal.children);
		children.forEach(child => {
			child.querySelector(".fa-trash-can").addEventListener("click", () => {
				const projectId = child.classList[0].split('-').pop();
				deleteProject(projectId);
			})
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
		document.querySelectorAll(`.project-${id}`).forEach(project => {
			project.parentNode.removeChild(project)
		})
	}).catch((response) => {
		return Error(`Erreur: ${response.status} ${response.statusText}`);
	})
}



document.querySelector(".modify-button").addEventListener("click", displayModal);