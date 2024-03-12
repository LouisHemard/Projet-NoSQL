export async function registerUser(userData) {
    try {
        const response = await fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'enregistrement');
        }

        const result = await response.json();
        console.log(result);
        alert('Utilisateur enregistré avec succès!');
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        alert(error.message);
    }
}

export async function loginUser(credentials) {
    try {
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la connexion');
        }

        const result = await response.json();
        console.log("coucou toi");
        console.log(result);
        alert('Connexion réussie!');
        return result;
        // Ici, tu peux rediriger l'utilisateur ou sauvegarder les informations de l'utilisateur (sans le mot de passe) dans le localStorage/sessionStorage par exemple.
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        alert(error.message);
    }
}
