// Fonctions utilitaires
const getElem = (id) => document.getElementById(id);
const getDOMValue = (selector) =>
  document.querySelector(selector)?.value || null;

const fetchAPI = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    return response.ok ? await response.json() : null;
  } catch (error) {
    console.error("Une erreur est survenue", error);
    return null;
  }
};

const postToAPI = async (url, body) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return { data: await response.json(), status: response.status };
  } catch (error) {
    console.error("Une erreur est survenue", error);
    return null;
  }
};

// Fonctions pour la gestion des travaux
const createElemWithText = (tag, text) => {
  const elem = document.createElement(tag);
  elem.innerText = text;
  return elem;
};

const createFigure = ({ id, imageUrl, title }) => {
  const figure = document.createElement("figure");
  figure.dataset.id = id;

  const img = document.createElement("img");
  img.src = imageUrl;

  const caption = createElemWithText("figcaption", title);

  figure.append(img, caption);
  return figure;
};

const displayWorks = (works, container) => {
  container.innerHTML = "";
  works.forEach((work) => container.appendChild(createFigure(work)));
};

const setupButtons = (works, filterContainer, displayContainer) => {
  const btnAll = createElemWithText("button", "Tous");
  btnAll.addEventListener("click", () => displayWorks(works, displayContainer));
  filterContainer.appendChild(btnAll);
  const uniqueCategories = [
    ...new Set(works.map((work) => work.category.name)),
  ];
  uniqueCategories.forEach((category) => {
    const btn = createElemWithText("button", category);
    btn.addEventListener("click", () => {
      const filteredWorks = works.filter(
        (work) => work.category.name === category
      );
      displayWorks(filteredWorks, displayContainer);
    });
    filterContainer.appendChild(btn);
  });
};

// const deleteWorks = () => {
//   const deleteExistingProjects = document.getElementById("existing-projects");
//   console.log("deleteWorks tourne");

//   if (deleteExistingProjects)
//     deleteExistingProjects.addEventListener("click", async function (event) {
//       event.preventDefault();
//       event.stopPropagation();
//       // console.log("Event triggered", event.target);
//       const imgContainer = event.target.closest(".img-container");
//       const deleteIcon = event.target.closest(".delete-icon");
//       //   // console.log(deleteIcon); OK
//       //   // console.log(imgContainer);OK
//       if (deleteIcon && imgContainer) {
//         const projetId = imgContainer.dataset.id;
//         const token = localStorage.getItem("token");

//         // Supprimez le projet de la base de données via AJAX

//         const response = await fetch(
//           `http://localhost:5678/api/works/${projetId}`,
//           {
//             method: "DELETE",
//             headers: {
//               Authorization: `Bearer ${token}`, // Ajoutez le token d'authentification dans le header
//             },
//           }
//         );

//         if (response.ok) {
//           // Supprimer le projet du DOM dans la fenêtre modale et dans la div .projets
//           document
//             .querySelector(`.projets figure[data-id="${projetId}"]`)
//             .remove();
//           document
//             .querySelector(`#existing-projects figure[data-id="${projetId}"]`)
//             .remove();
//         }
//       }
//     });
// };
// Fonctions pour la gestion du login
const handleFormSubmission = async (event) => {
  event.preventDefault();
  const email = getDOMValue("#login-email");
  const password = getDOMValue("#login-password");
  const response = await postToAPI("http://localhost:5678/api/users/login", {
    email,
    password,
  });

  if (response && response.status === 200) {
    localStorage.setItem("user", JSON.stringify(response.data.userId));
    localStorage.setItem("token", response.data.token);
    location.href = "index.html";
  } else {
    document.getElementById("error-message").textContent =
      "Identifiant ou mot de passe incorrect";
  }
};

const checkTokenLogin = () => {
  const tokenAuth = localStorage.getItem("token");
  const loginLink = document.getElementById("login-link");
  const adminBar = document.getElementById("admin-bar");
  const allFilterBtn = document.querySelector(".filtres");
  const modifierBtn = document.getElementById("add-project-btn");

  if (tokenAuth) {
    loginLink.textContent = "logout";
    adminBar?.classList.remove("hidden");
    allFilterBtn?.classList.add("hidden");
    loginLink.addEventListener("click", handleLogout); // Ajout de l'écouteur d'événements
  } else {
    loginLink.textContent = "login";
    adminBar?.classList.add("hidden");
    modifierBtn?.parentNode.removeChild(modifierBtn);
  }
};

// Initialisation
document.addEventListener("DOMContentLoaded", async () => {
  const works = await fetchAPI("http://localhost:5678/api/works");
  if (works) {
    const sectionProjet = document.querySelector(".projets");
    displayWorks(works, sectionProjet);

    const filtresDiv = document.querySelector(".filtres");
    setupButtons(works, filtresDiv, sectionProjet);
  }

  // deleteWorks();
  checkTokenLogin();

  const form = getElem("login");
  form?.addEventListener("submit", handleFormSubmission);
});
