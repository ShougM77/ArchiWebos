document.addEventListener('DOMContentLoaded', function() {
    // Sélection des éléments HTML nécessaires
    const gallery = document.getElementById('gallery');
    const filterMenu = document.getElementById('filter-menu');
    const photoModal = document.getElementById('modal');
    const modalGallery = document.getElementById('modal-gallery');
    const addPhotoModal = document.getElementById('addPhotoModal');
    const modifierButton = document.getElementById('modifier');
    const closeModalButtons = document.querySelectorAll('.close');
    const authToken = localStorage.getItem('authToken');

    // Afficher le bouton "modifier" si un token d'authentification est présent
    if (authToken) {
        modifierButton.style.display = 'inline';
    }
    
    // Changer le texte du lien de connexion et gérer la déconnexion
    const loginLink = document.getElementById('login-link');
    if (authToken) {
        loginLink.textContent = 'Logout';
        loginLink.addEventListener('click', function(event) {
            event.preventDefault();
            localStorage.removeItem('authToken');
            window.location.href = 'index.html';
        });
    } else {
        loginLink.textContent = 'Login';
    }

    // Récupération des projets depuis l'API
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(projects => {
            console.log('Projets récupérés:', projects);
            displayProjects(projects); 
            createFilterMenu(projects); 
            populateModal(projects); 
        })
        .catch(error => console.error('Erreur lors de la récupération des projets :', error));

    // Affichage des projets dans la galerie principale
    function displayProjects(projects) {
        gallery.innerHTML = ''; 
        projects.forEach(project => {
            const figure = document.createElement('figure');
            figure.innerHTML = `
                <img src="${project.imageUrl}" alt="${project.title}">
                <figcaption>${project.title}</figcaption>
            `;
            gallery.appendChild(figure); 
        });
    }

    // Création du menu de filtres
    function createFilterMenu(projects) {
        const categories = new Set(projects.map(project => project.category.name));
        categories.add('Tous'); 
        filterMenu.innerHTML = ''; 

        // Si l'utilisateur n'est pas authentifié, créer les boutons de filtre
    if (!authToken) {

        // Bouton pour afficher tous les projets
        const allButton = document.createElement('button');
        allButton.textContent = 'Tous';
        allButton.addEventListener('click', () => {
            displayProjects(projects);
        });
        filterMenu.appendChild(allButton);

        // Créer un bouton pour chaque catégorie
        categories.forEach(category => {
            if (category !== 'Tous') {
                const button = document.createElement('button');
                button.textContent = category;
                button.addEventListener('click', () => {
                    const filteredProjects = projects.filter(project => project.category.name === category);
                    displayProjects(filteredProjects); 
                });
                filterMenu.appendChild(button);
            }
        });
    }
    }

    // Gestion de l'ouverture de la modale
    modifierButton.addEventListener('click', function() {
        photoModal.style.display = 'block'; 
    });

    // Gestion de la fermeture des modales
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            photoModal.style.display = 'none';
            addPhotoModal.style.display = 'none';
        });
    });

    // Fermeture des modales lorsque l'utilisateur clique en dehors du contenu de la modale
    window.addEventListener('click', function(event) {
        if (event.target === photoModal || event.target === addPhotoModal) {
            photoModal.style.display = 'none';
            addPhotoModal.style.display = 'none';
        }
    });

    // Ajout des images des projets dans la modale avec des icônes de poubelle
    function populateModal(projects) {
        modalGallery.innerHTML = ''; 
        projects.forEach(project => {
            const photoContainer = document.createElement('div');
            photoContainer.className = 'photo-container';

            const img = document.createElement('img');
            img.src = project.imageUrl;
            img.alt = project.title;

            const trashIcon = document.createElement('i');
            trashIcon.className = 'fa-solid fa-trash-can';
            trashIcon.addEventListener('click', () => deletePhoto(project.id, photoContainer));

            photoContainer.appendChild(img);
            photoContainer.appendChild(trashIcon);
            modalGallery.appendChild(photoContainer); 
        });

        // Ajouter un bouton "Ajouter une photo" dans la modale
        const addButtonContainer = document.createElement('div');
        addButtonContainer.classList.add('add-photo-button-container');

        const addButton = document.createElement('button');
        addButton.textContent = "Ajouter une photo";
        addButton.classList.add('btn-ajouter-photo');
        addButton.addEventListener('click', function() {
            addPhotoModal.style.display = 'block'; 
        });

        addButtonContainer.appendChild(addButton);
        modalGallery.appendChild(addButtonContainer);
    }

    // Gestion formulaire pour ajouter une photo
    const addPhotoForm = document.getElementById('addPhotoForm');
    addPhotoForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(addPhotoForm);
        const selectedFile = photoFileInput.files[0];
    formData.append('image', selectedFile);
        //  ajouter les fichiers form data

        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        })
        .then(response => response.json())
        .then(newWork => {
            console.log('Nouveau projet ajouté:', newWork);
            addPhotoModal.style.display = 'none';
            // Actualiser la liste des projets    
            fetch('http://localhost:5678/api/works') 
                .then(response => response.json())
                .then(projects => {
                    displayProjects(projects);
                    populateModal(projects);
                });
        })
        .catch(error => console.error('Erreur ajout du projet :', error));
    });

    // Fonction pour gérer la suppression des photos avec demande de confirmation
    function deletePhoto(photoId, photoContainer) {
        // Afficher une boîte de dialogue de confirmation
        if (confirm("Êtes-vous sûr de vouloir supprimer cette photo ?")) {
            // Envoyer une requête DELETE à l'API pour supprimer la photo
            fetch(`http://localhost:5678/api/works/${photoId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then(response => {
                if (response.ok) {
                    photoContainer.remove();
                } else {
                    console.error('Erreur lors de la suppression de la photo');
                }
            })
            .catch(error => console.error('Erreur lors de la suppression de la photo :', error));
        } else {
            console.log('Suppression annulée');
        }
    }
});

// Sélection de l'input de fichier et de l'élément d'image pour la prévisualisation
const photoFileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');

// Événement pour les changements de fichier
photoFileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    // Vérification si un fichier est sélectionné
    if (file) {
        const reader = new FileReader();
        // Chargement du contenu de l'image en tant qu'URL de données
        reader.readAsDataURL(file);
        reader.onload = function() {
            // Mise à jour de la source de l'image avec l'URL de l'image chargée
            imagePreview.src = reader.result;
            // Afficher l'image prévisualisée
            imagePreview.style.display = 'block'; // Rendre l'image visible
            // Masquer l'icône, le bouton et le texte supplémentaire
            document.querySelector('.photo-upload-container i').style.display = 'none';
            document.querySelector('.photo-upload-container label').style.display = 'none';
            document.querySelector('.photo-upload-container p').style.display = 'none';
        };
    } else {
        // Si aucun fichier n'est sélectionné, désactiver l'affichage de l'image de prévisualisation
        imagePreview.style.display = 'none';
        // Afficher l'icône, le bouton et le texte supplémentaire
        document.querySelector('.photo-upload-container i').style.display = 'block';
        document.querySelector('.photo-upload-container label').style.display = 'block';
        document.querySelector('.photo-upload-container p').style.display = 'block';
    }
});
// Récupération du bouton de retour dans la modal addPhotoModal
const backButtonAddModal = document.getElementById('backButtonAddModal');

// Gestionnaire d'événements pour le bouton de retour dans la modal addPhotoModal
backButtonAddModal.addEventListener('click', function() {
    addPhotoModal.style.display = 'none'; // Fermer la modal addPhotoModal
    modal.style.display = 'block'; // Afficher la modal principale
});
// Récupération de l'élément de la liste déroulante des catégories
const categoryDropdown = document.getElementById('category');

// Récupération des catégories depuis API
fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(categories => {
        categoryDropdown.innerHTML = '';

        // Ajouter chaque catégorie à la liste déroulante
        categories.forEach(category => {
            const option = document.createElement('option');
            option.textContent = category.name;
            option.value = category.id;
            categoryDropdown.appendChild(option);
        });
    })
    .catch(error => console.error('Erreur lors de la récupération des catégories :', error));


