/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
class View {
  constructor() {
    this.gallery = document.querySelector(".gallery");
    this.allBtn = document.querySelector(".tous");
    this.objetsBtn = document.querySelector(".objets");
    this.appartementsBtn = document.querySelector(".apparts");
    this.hotelsRestaurantsBtn = document.querySelector(".hotels");
    this.emailEl = document.querySelector("#email");
    this.passwordEl = document.querySelector("#password");
    this.errorMsgEl = document.querySelector("#error-message");
    this.modal = document.querySelector("#modal");
    this.modalGallery = document.querySelector("#modal-gallery");
    this.editButton = document.querySelector("#edit-button");
    this.closeModalBtn = document.querySelector("#close-modal");
    this.deleteProject = document.querySelector("#trash");
  }

  displayProjects(projectsArray) {
    this.gallery.innerHTML = "";

    // Crée une nouvelle instance de la classe Project pour chaque projet dans le tableau passé en argument
    for (let i = 0; i < projectsArray.length; i += 1) {
      const project = new Project(projectsArray[i]);
      this.gallery.innerHTML += `
          <figure>
              <img src="${project.imageUrl}" alt="${project.title}" />
              <figcaption>${project.title}</figcaption>
          </figure>
        `;
    }
  }

  styleActiveFilterBtn(clickedButton) {
    // Boucle dans un array avec tous les boutons de filtre
    [
      this.allBtn,
      this.objetsBtn,
      this.appartementsBtn,
      this.hotelsRestaurantsBtn,
    ].forEach((button) => {
      // Applique le style par défaut
      button.style.color = "#1d6154";
      button.style.backgroundColor = "white";
    });
    // Applique le style du bouton de filtre actif / cliqué

    clickedButton.style.color = "white";
    clickedButton.style.backgroundColor = "#1d6154";
  }

  displayProjectsInModal(projectsArray) {
    this.modalGallery.innerHTML = "";

    for (let i = 0; i < projectsArray.length; i += 1) {
      const project = new Project(projectsArray[i]);
      this.modalGallery.innerHTML += `
      <figure>
        <img src="${project.imageUrl}" alt="${project.title}" />
        <i class="fa-regular fa-trash-can trash" id="trash" data-project-id="${project.id}"></i>
        <button>éditer</button>
      </figure>
    `;
    }
  }

  openModal() {
    this.modal.style.display = "flex";
  }

  closeModal() {
    this.modal.style.display = "none";
  }
}
