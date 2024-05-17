document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.querySelector(".gallery");
    const filterMenu = document.getElementById("filter-menu");

    const projects = [
        { id: 1, title: "Abajour Tahina", imageUrl: "assets/images/abajour-tahina.png", categoryId: 1 },
        { id: 2, title: "Appartement Paris V", imageUrl: "assets/images/appartement-paris-v.png", categoryId: 2 },
        { id: 3, title: "Restaurant Sushisen - Londres", imageUrl: "assets/images/restaurant-sushisen-londres.png", categoryId: 3 },
        { id: 4, title: "Villa “La Balisiere” - Port Louis", imageUrl: "assets/images/la-balisiere.png", categoryId: 2 },
        { id: 5, title: "Structures Thermopolis", imageUrl: "assets/images/structures-thermopolis.png", categoryId: 1 },
        { id: 6, title: "Appartement Paris X", imageUrl: "assets/images/appartement-paris-x.png", categoryId: 2 },
        { id: 7, title: "Pavillon “Le coteau” - Cassis", imageUrl: "assets/images/le-coteau-cassis.png", categoryId: 2 },
        { id: 8, title: "Villa Ferneze - Isola d’Elba", imageUrl: "assets/images/villa-ferneze.png", categoryId: 2 },
        { id: 9, title: "Appartement Paris XVIII", imageUrl: "assets/images/appartement-paris-xviii.png", categoryId: 2 },
        { id: 10, title: "Bar “Lullaby” - Paris", imageUrl: "assets/images/bar-lullaby-paris.png", categoryId: 3 },
        { id: 11, title: "Hotel First Arte - New Delhi", imageUrl: "assets/images/hotel-first-arte-new-delhi.png", categoryId: 3 }
    ];

    fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(categories => {
            projects.forEach(project => {
                const figure = document.createElement("figure");
                figure.innerHTML = `
                    <img src="${project.imageUrl}" alt="${project.title}">
                    <figcaption>${project.title}</figcaption>
                `;
                figure.dataset.categoryId = project.categoryId;
                gallery.appendChild(figure);
            });

            const allButton = document.createElement("button");
            allButton.textContent = "Tous";
            allButton.addEventListener("click", () => filterProjects("Tous"));
            filterMenu.appendChild(allButton);

            categories.forEach(category => {
                const button = document.createElement("button");
                button.textContent = category.name;
                button.dataset.categoryId = category.id;
                button.addEventListener("click", () => filterProjects(category.id));
                filterMenu.appendChild(button);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));

    function filterProjects(categoryId) {
        const figures = document.querySelectorAll(".gallery figure");
        figures.forEach(figure => {
            if (categoryId === "Tous" || figure.dataset.categoryId == categoryId) {
                figure.style.display = "block";
            } else {
                figure.style.display = "none";
            }
        });
    }
});
