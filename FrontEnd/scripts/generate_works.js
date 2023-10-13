///////////// WORKS //////////////

// Récupération des works depuis l'API
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();
// console.log(works);

// Génération des articles (avec createElement)
function generateWorks(works) {
  for (let i = 0; i < works.length; i++) {
    const figure = works[i];
    // Récupération de l'élément du DOM qui accueillera les fiches
    if (document.querySelector(".gallery")) {
      const sectionGallery = document.querySelector(".gallery");
      // Création d’une balise dédiée à un work
      const workElement = document.createElement("figure");
      workElement.dataset.id = works[i].id;
      // Création de la balise img
      const imageElement = document.createElement("img");
      imageElement.src = figure.imageUrl;
      // Création de la balise figcaption
      const titleElement = document.createElement("figcaption");
      titleElement.innerText = figure.title ?? "(aucun titre)";
      // On rattache la balise figure a la section Gallery
      sectionGallery.appendChild(workElement);
      workElement.appendChild(imageElement);
      workElement.appendChild(titleElement);
    }
  }
}

// generateWorks(works);


// Génération des articles (avec Template literals)
function generateWorksWithTemplateLiterals(works) {
  for (let i = 0; i < works.length; i++) {
    const figure = works[i];
    // Récupération de l'élément du DOM qui accueillera les fiches
    if (document.querySelector('.gallery')) {
      const sectionGallery = document.querySelector('.gallery');
      // Création d’une balise dédiée à un work
      const workElement = document.createElement("figure");
      workElement.dataset.id = works[i].id;
      // Création des variables à indenter imagesUrl et title
      const imageUrl = figure.imageUrl;
      const title = figure.title ?? "(aucun titre)";
      // Ajout des variables et du Html associé à workElement
      workElement.innerHTML=
        `<img src="${imageUrl}" alt="${title}">
        <figcaption> ${title}</figcaption>`
      ;
      // On rattache la balise figure a la section Gallery
      sectionGallery.appendChild(workElement);
    }
  }
}

generateWorksWithTemplateLiterals(works);

///////////// FILTERS //////////////

// Récupération des categories depuis l'API
const reponseCategories = await fetch("http://localhost:5678/api/categories");
const categories = await reponseCategories.json();

// Création de l'ensemble des filtres
let filters = []
filters.push("Tous")
categories.forEach(element => {
  filters.push(element.name)
});
const filtersWithoutDuplicate = [...new Set(filters)]

// Génération des filtres
function generateFilters(filters) {
  for (let i = 0; i < filters.length; i++) {
      const categorie = filters[i];
      if (document.querySelector('.filters')) {
        // Récupération de l'élément du DOM qui accueillera les fiches
        const sectionFilters = document.querySelector('.filters');
        // Création d’une div dédiée à une catégorie
        const filterCategory = document.createElement("div");
        // Ajout du Html associé à workElement
        filterCategory.innerHTML = categorie;
        // Ajout du css
        filterCategory.classList.add("filter");
        // On rattache la balise figure a la section Gallery
        sectionFilters.appendChild(filterCategory);
      }
    }
}
generateFilters(filtersWithoutDuplicate);

// Bouton Filtrer pour chaque categorie

function filterByCategory() {

  if (document.querySelectorAll(".filter")) {
    const buttonCategories = document.querySelectorAll(".filter");

    buttonCategories.forEach(buttonCategory => {
      if (buttonCategory.innerText === "Tous") {
        buttonCategory.addEventListener("click", function () {
          document.querySelector(".gallery").innerHTML = "";
          generateWorksWithTemplateLiterals(works);
        });
      } else {
        buttonCategory.addEventListener("click", function () {
          const FilteredWorks = works.filter(function (work) {
            return work.category.name === buttonCategory.innerText;
          });
          document.querySelector(".gallery").innerHTML = "";
          generateWorksWithTemplateLiterals(FilteredWorks);
        });
      };
    });
  }
}

filterByCategory();

////////////////// EDIT MODE /////////////////////////////

function bannerEdit() {
  const bannerEdit = document.createElement("div");
  bannerEdit.innerHTML = `
    <i class="fas fa-edit"></i>
    <p>&nbsp;Mode édition</p>
  `
  bannerEdit.classList.add("edit-mode-banner");

  const headerHTML = document.querySelector("header");
  const headerMenu = document.querySelector(".header-menu");
  headerHTML.insertBefore(bannerEdit, headerMenu);
}

function editButton() {
  const editButton = document.createElement("button");
  editButton.innerHTML = `<i class="fas fa-edit"></i> modifier`;
  editButton.classList.add("edit-btn");
  editButton.classList.add("js-open-button");

  const titlePortfolio = document.getElementById("title-portfolio");
  titlePortfolio.after(editButton);
}

function removeFilters() {
  const filters = document.querySelector(".filters");
  filters.remove();
}

function generateModal() {

}

function EditPage() {
  if (window.localStorage.getItem("token")) {
    console.log("token");
    bannerEdit();
    editButton();
    removeFilters();
    // generateModal();
  } else {
    console.log("no token");
  }
}

EditPage();