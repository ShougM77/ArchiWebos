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
        addButton.classList.add('button-ajouter-photo');
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
        //  ajouter les fichiers form data

        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        })
        .then(response => response.json())
        .then(newProject => {
            console.log('Nouveau projet ajouté:', newProject);
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

    // Fonction pour gérer la suppression des photos
    function deletePhoto(photoId, photoContainer) {
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
    }
});