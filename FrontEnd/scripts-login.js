document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('mot-de-passe');

    if (loginForm && emailInput && passwordInput) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const email = emailInput.value;
            const password = passwordInput.value;

            // Validation des champs email et mot de passe
            if (email.trim() === '' || password.trim() === '') {
                alert('Veuillez remplir tous les champs.');
                return;
            }

            const data = {
                email: email,
                password: password
            };

            // Affichage des données envoyées à l'API dans la console
            console.log('Données envoyées à l\'API:', data);

            const url = 'http://localhost:5678/api/users/login';
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };

            fetch(url, options)
                .then(function(response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Identifiants de connexion incorrects');
                    }
                })
                .then(function(data) {
                    console.log('Réponse de l\'API:', data);

                    // Stocker le token dans le localStorage
                    localStorage.setItem('authToken', data.token);

                    alert('Connexion réussie !');
                    // Redirection vers la page d'accueil (index.html) après une connexion réussie
                    window.location.href = 'index.html';
                })
                .catch(function(error) {
                    console.error('Erreur:', error.message);
                    alert('Une erreur est survenue lors de la connexion. Veuillez réessayer plus tard.');
                });
        });
    } else {
        console.error('Certains éléments requis ne sont pas présents dans le DOM.');
    }
});
