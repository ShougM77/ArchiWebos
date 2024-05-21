        //DOM//
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery');
    const filterMenu = document.getElementById('filter-menu');

        //Récupération du site//
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(projects => {
            console.log('Projets récupérés:', projects);
            displayProjects(projects);
            createFilterMenu(projects);
        })
        .catch(error => console.error('Erreur lors de la récupération des projets :', error));

        //Affichage//
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

        //Filtres//
        function createFilterMenu(projects) {
            const categories = new Set(projects.map(project => project.category.name));
        //Tous 1er//
            categories.add('Tous');
            filterMenu.innerHTML = '';
        //Tous//
            const allButton = document.createElement('button');
            allButton.textContent = 'Tous';
            allButton.addEventListener('click', () => {
                displayProjects(projects);
            });
            filterMenu.appendChild(allButton);
        //Autres boutons//
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
        
});
