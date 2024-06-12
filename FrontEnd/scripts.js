document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialisation et Configuration de l'Authentification
    const authToken = localStorage.getItem('authToken');
    const loginLink = document.getElementById('login-link');
    const editModeBar = document.getElementById('edit-mode-bar');
    const modifierButton = document.getElementById('modifier');

    if (authToken) {
        editModeBar.style.display = 'flex';
        modifierButton.style.display = 'inline';
        loginLink.textContent = 'Logout';
        loginLink.addEventListener('click', function(event) {
            event.preventDefault();
            localStorage.removeItem('authToken');
            window.location.href = 'index.html';
        });
    } else {
        loginLink.textContent = 'Login';
    }

    // 2. Récupération et Affichage des Projets
    const gallery = document.getElementById('gallery');

    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(projects => {
            console.log('Projets récupérés:', projects);
            displayProjects(projects);
            createFilterMenu(projects);
            populateModal(projects);
        })
        .catch(error => console.error('Erreur lors de la récupération des projets :', error));

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

    // 3. Création du Menu de Filtres
    const filterMenu = document.getElementById('filter-menu');

    function createFilterMenu(projects) {
        const categories = new Set(projects.map(project => project.category.name));
        categories.add('Tous');
        filterMenu.innerHTML = '';

        if (!authToken) {
            const allButton = document.createElement('button');
            allButton.textContent = 'Tous';
            allButton.addEventListener('click', () => displayProjects(projects));
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
    }

    // 4. Gestion des Modales
    const photoModal = document.getElementById('modal');
    const addPhotoModal = document.getElementById('addPhotoModal');
    const closeModalButtons = document.querySelectorAll('.close');

    modifierButton.addEventListener('click', function() {
        photoModal.style.display = 'block';
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            photoModal.style.display = 'none';
            addPhotoModal.style.display = 'none';
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target === photoModal || event.target === addPhotoModal) {
            closeModal();
        }
    });


    // 5. Gestion de l'Ajout et de la Suppression des Photos
    const addPhotoForm = document.getElementById('addPhotoForm');
    const photoFileInput = document.getElementById('fileInput');
    const modalGallery = document.getElementById('modal-gallery');

    addPhotoForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(addPhotoForm);
        const selectedFile = photoFileInput.files[0];
        formData.append('image', selectedFile);

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
            fetch('http://localhost:5678/api/works')
                .then(response => response.json())
                .then(projects => {
                    displayProjects(projects);
                    populateModal(projects);
                });
        })
        .catch(error => console.error('Erreur ajout du projet :', error));
    });

    function deletePhoto(photoId, photoContainer) {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette photo ?")) {
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

    // 6. Gestion de la Prévisualisation des Images
    const imagePreview = document.getElementById('imagePreview');

    photoFileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function() {
                imagePreview.src = reader.result;
                imagePreview.style.display = 'block';
                document.querySelector('.photo-upload-container i').style.display = 'none';
                document.querySelector('.photo-upload-container label').style.display = 'none';
                document.querySelector('.photo-upload-container p').style.display = 'none';
            };
        } else {
            imagePreview.style.display = 'none';
            document.querySelector('.photo-upload-container i').style.display = 'block';
            document.querySelector('.photo-upload-container label').style.display = 'block';
            document.querySelector('.photo-upload-container p').style.display = 'block';
        }
    });

    const backButtonAddModal = document.getElementById('backButtonAddModal');

    backButtonAddModal.addEventListener('click', function() {
        addPhotoModal.style.display = 'none';
        photoModal.style.display = 'block';
    });

    // 7. Récupération des Catégories depuis l'API
    const categoryDropdown = document.getElementById('category');

    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => {
            categoryDropdown.innerHTML = '';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.textContent = category.name;
                option.value = category.id;
                categoryDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories :', error));
});
