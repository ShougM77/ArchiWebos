document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery');
    const filterMenu = document.getElementById('filter-menu');
    const modal = document.getElementById('modal');
    const modifierButton = document.getElementById('modifier');
    const closeModalButton = document.querySelector('.close');
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
        // Afficher le bouton "modifier" s'il y a un token d'authentification
        modifierButton.style.display = 'inline';
    }
    // Changer le texte du lien de connexion en fonction de la présence du token
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

    // Récupération du site
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(projects => {
            console.log('Projets récupérés:', projects);
            displayProjects(projects);
            createFilterMenu(projects);
            populateModal(projects);
        })
        .catch(error => console.error('Erreur lors de la récupération des projets :', error));

    // Affichage des projets gallery
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

        const allButton = document.createElement('button');
        allButton.textContent = 'Tous';
        allButton.addEventListener('click', () => {
            displayProjects(projects);
        });
        filterMenu.appendChild(allButton);

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

    // Ouverture et fermeture de la modale
    modifierButton.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    closeModalButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // modale avec les images des projets
    function populateModal(projects) {
        const modalContent = modal.querySelector('.modal-content');
        projects.forEach(project => {
            const img = document.createElement('img');
            img.src = project.imageUrl;
            img.alt = project.title;
            modalContent.appendChild(img);
        });
         // Créer une div pour contenir le bouton "Ajouter une photo"
    const addButtonContainer = document.createElement('div');
    addButtonContainer.classList.add('add-photo-button-container');

        // Créer le bouton "Ajouter une photo"
    const addButton = document.createElement('button');
    addButton.textContent = "Ajouter une photo";
    addButton.classList.add('button-ajouter-photo');
    addButton.addEventListener('click', function() {

        console.log("Bouton 'Ajouter une photo' cliqué");
    });

    // Ajouter le bouton "Ajouter une photo" à la div
    addButtonContainer.appendChild(addButton);

    // Ajouter la div au contenu modal
    modalContent.appendChild(addButtonContainer);
}

   
});