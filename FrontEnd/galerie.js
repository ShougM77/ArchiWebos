let works = [];
const galleryList = document.querySelector(".gallery");
// Construction de la fonction appel API
async function appelTravaux() {

    const reponse = await fetch("http://localhost:5678/api/works");
    works = await reponse.json();
    
// Appel de la fonction pour générer les travaux après avoir obtenu les données
genererTravaux(works);
    
 };

function genererTravaux(works) {
  // Récupération de l'élément du DOM qui accueillera les travaux
  //const galleryList = document.querySelector(".gallery"); **élément affiché en haut de page**

  for (let i = 0; i < works.length; i++) {
    const travail = works[i];

    // Création d'une balise dédiée à un travail
    const figureElement = document.createElement("figure");

    // Création de la balise image
    const imageElement = document.createElement("img");
    imageElement.src = travail.imageUrl;

    // Création de la balise figcaption
    const figCaptionElement = document.createElement("figcaption");
    figCaptionElement.innerText = travail.title;

    // On rattache les éléments enfants aux parents
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figCaptionElement);

    // On rattache figure à son parent
    galleryList.appendChild(figureElement);
  }
  
};

// Appel de la fonction pour récupérer les données
appelTravaux();

/*Récupération des boutons dans le DOM
const globalButton = document.querySelector("#btnGlobal");
const objetsButton = document.querySelector("#btnObjets");
const appartementsButton = document.querySelector("#btnAppartements");
const hotelsRestaurantsButton = document.querySelector("#btnHotels");

// Ajout d'un gestionnaire d'événements à chaque bouton


globalButton.addEventListener("click",function(event){
 
  event.preventDefault();
  // Afficher tous les travaux (aucun filtrage)
  galleryList.innerHTML = "";
  genererTravaux(works);
});

//Bouton afficher objets
objetsButton.addEventListener("click",function(event){
  event.preventDefault();
  //Création de mon contenu de filtre pour objet
  const objetsFiltres = works.filter((work) => work.categoryId===1);
 //Initialisation de l'affichage de ma galerie
  galleryList.innerHTML = "";
  //Affichage des valeurs de mon filtre objets
  genererTravaux(objetsFiltres);
  });


//Bouton afficher appartements
appartementsButton.addEventListener("click",function(event){
  event.preventDefault();
  //Création de mon contenu de filtre pour appartements
  const appartementsFiltres = works.filter((work) => work.categoryId===2);
 //Initialisation de l'affichage de ma galerie
  galleryList.innerHTML = "";
  //Affichage des valeurs de mon filtre appartements
  genererTravaux(appartementsFiltres);
  });


  //Bouton afficher hôtels restaurants
  hotelsRestaurantsButton.addEventListener("click",function(event){
    event.preventDefault();
    //Création de mon contenu de filtre pour hôtels restaurants
    const hotelsRestaurantsFiltres = works.filter((work) => work.categoryId===3);
   //Initialisation de l'affichage de ma galerie
    galleryList.innerHTML = "";
    //Affichage des valeurs de mon filtre hôtels restaurants
    genererTravaux(hotelsRestaurantsFiltres);
    });*/