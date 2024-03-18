import * as React from 'react';
import { useNavigate } from 'react-router-dom'; // Importe useNavigate au lieu de useHistory
import { loginUser } from '../data/user'
const Connexion = () => {
    const [errorMessage, setErrorMessage] = React.useState('');
    const navigate = useNavigate(); // Utilise useNavigate pour la navigation

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        const email = event.target.email.value;
        const password = event.target.password.value;
    //console.log(email, password);
        try {const data = await loginUser({ mail: email, password: password });
            console.log('Connexion réussie:');
            console.log(data)
            // Sauvegarde les infos de l'utilisateur dans localStorage sans le mot de passe
           sessionStorage.setItem('user', JSON.stringify(data.user.id)); // Adapte cette ligne si nécessaire

            navigate('/NotePage'); // Utilise navigate('/') pour rediriger vers la page d'accueil
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            setErrorMessage('Erreur lors de la connexion. Veuillez réessayer.');
        }
    };

    return (
        <div className='container'>
            <h1>Connexion</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div className="object-form">
                    <label className="label-form" htmlFor="email">Email</label>
                    <input className="input-form" type="email" id="email" name="email" required />
                </div>
                <div className="object-form">
                    <label className="label-form" htmlFor="password">Mot de passe</label>
                    <input className="input-form" type="password" id="password" name="password" required />
                </div>
                <button class="submit-form" type="submit">Se connecter</button>
            </form>
        </div>
    );
};

export default Connexion;
