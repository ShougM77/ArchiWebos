// DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery');
    const filterMenu = document.getElementById('filter-menu');
    const modal = document.getElementById('modal');
    const addProjectButton = document.getElementById('add-project-button');
    const modifierButton = document.getElementById('modifier');
    const closeModalButton = document.querySelector('.close');
    const addProjectForm = document.getElementById('add-project-form');
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
        // Afficher le bouton "modifier" s'il y a un token d'authentification
        modifierButton.style.display = 'inline';
    }
    // Changer le texte du lien de connexion en fonction de la présence du token
    const loginLink = document.getElementById('login-link');
    if (authToken) {
        loginLink.textContent = 'Logout';
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
        })
        .catch(error => console.error('Erreur lors de la récupération des projets :', error));

    // Affichage des projets
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

    // Ajout de projet
    addProjectForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(addProjectForm);
        const projectTitle = formData.get('project-title');
        const projectImage = formData.get('project-image');

        if (!projectTitle || !projectImage) {
            alert('Veuillez remplir tous les champs.');
            return;
        }

        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: formData
        })
        .then(response => response.json())
        .then(newProject => {
            console.log('Nouveau projet ajouté:', newProject);
            gallery.appendChild(createProjectElement(newProject));
            modal.style.display = 'none';
            addProjectForm.reset();
        })
        .catch(error => console.error('Erreur lors de l\'ajout du projet:', error));
    });

    // Création d'un élément projet
    function createProjectElement(project) {
        const figure = document.createElement('figure');
        figure.innerHTML = `
            <img src="${project.imageUrl}" alt="${project.title}">
            <figcaption>${project.title}</figcaption>
            <button class="delete-project-button" data-id="${project.id}">Supprimer</button>
        `;
        figure.querySelector('.delete-project-button').addEventListener('click', function() {
            deleteProject(project.id);
        });
        return figure;
    }

    // Suppression de projet
    function deleteProject(projectId) {
        fetch(`http://localhost:5678/api/works/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(response => {
            if (response.ok) {
                const projectElement = document.querySelector(`button[data-id="${projectId}"]`).parentElement;
                projectElement.remove();
                console.log('Projet supprimé:', projectId);
            } else {
                console.error('Erreur lors de la suppression du projet:', response.statusText);
            }
        })
        .catch(error => console.error('Erreur lors de la suppression du projet:', error));
    }    
});