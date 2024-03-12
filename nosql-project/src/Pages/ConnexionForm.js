import * as React from 'react';

const Connexion = () => {

    // Gestionnaire de soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault(); // Empêche le rechargement de la page

        // Récupère les valeurs des inputs
        const email = event.target.email.value;
        const password = event.target.password.value;

        // Prépare les données à envoyer
        const loginData = {
            mail: email,
            password: password,
        };

        try {
            // Appel API pour la connexion
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                throw new Error('Erreur de connexion');
            }

            const data = await response.json();
            console.log('Connexion réussie:', data);

            // Sauvegarde les infos de l'utilisateur dans localStorage sans le mot de passe
            const { password: pwd, ...userData } = data; // Supprime `password` de `data` si présent
            localStorage.setItem('user', JSON.stringify(userData));

            // Redirige l'utilisateur vers la page "PrincipalPage.js"
            window.location.href = '/PrincipalPage';

            // Ici, tu peux rediriger l'utilisateur ou faire d'autres traitements post-connexion
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
        }
    };

    return (
        <div className='container'>
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit}>
                <div className="object-form">
                    <label className="label-form" htmlFor="email">Email</label>
                    <input className="input-form" type="email" id="email" name="email" />
                </div>
                <div className="object-form">
                    <label className="label-form" htmlFor="password">Mot de passe</label>
                    <input className="input-form" type="password" id="password" name="password" />
                </div>
                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
}

export default Connexion;
