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

function addProjectModal() {
    let html = `
    <form>
			<div class="modal">
				<div class="form-container">
					<div>
						<div class="modal-nav">
							<span class="close">&times;</span>
						</div>
						<h3>Ajout photo</h3>
					</div>
					<div class="modal-content">
						<div class="upload-section">
							<label for="photo-upload" class="upload-label">
								<div class="upload-preview">
									<img id="preview-image" src="#" alt="Aperçu" style="display: none;">
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
    updateImagePreview();
    // const fileInput = document.getElementById("photo-upload");
    // const previewImage = document.getElementById("preview-image");
    // const validateButton = document.getElementById("validate-button");
    // const titleInput = document.getElementById("photo-title");
    // const categorySelect = document.getElementById("photo-category");
	
    // fileInput.addEventListener("change", (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             previewImage.src = e.target.result;
    //             previewImage.style.display = "block";
    //         };
    //         reader.readAsDataURL(file);
    //     }
    //     checkFormValidity();
    // });

    // titleInput.addEventListener("input", checkFormValidity);
    // categorySelect.addEventListener("change", checkFormValidity);

    // function checkFormValidity() {
    //     if (fileInput.files.length > 0 && titleInput.value.trim() !== "" && categorySelect.value !== "") {
    //         validateButton.disabled = false;
    //     } else {
    //         validateButton.disabled = true;
    //     }
    // }

    // validateButton.addEventListener("click", () => {
    //     console.log("Formulaire soumis !");
    //     fileInput.value = "";
    //     titleInput.value = "";
    //     categorySelect.selectedIndex = 0;
    //     previewImage.style.display = "none";
    //     validateButton.disabled = true;
    // });
}


document.querySelector(".modify-button").addEventListener("click", displayGalleryModal);

function updateImagePreview() {
    console.log("updateImagePreview called");
    const fileInput = document.getElementById("photo-upload");
    const previewImage = document.getElementById("preview-image");
    fileInput.addEventListener("change", (event) => {
        console.log("File selected !");
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

addProjectModal();