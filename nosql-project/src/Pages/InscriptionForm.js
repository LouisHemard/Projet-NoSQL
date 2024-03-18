import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importe useNavigate pour la redirection
import { registerUser } from '../data/user'; // Assure-toi que le chemin d'importation est correct

const Inscription = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Utilise useNavigate pour la redirection

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Réinitialise l'erreur

    const nom = event.target.nom.value;
    const prenom = event.target.prenom.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const passwordConfirm = event.target.passwordConfirm.value;

    if (password !== passwordConfirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    const userData = {
      nom,
      prenom,
      mail: email,
      password,
    };

    try {
      await registerUser(userData);
      navigate('/Connexion'); // Utilise navigate pour rediriger vers la page d'accueil après une inscription réussie
    } catch (error) {
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
      console.error('Erreur lors de l\'inscription:', error.response ? error.response.data : error.message);
    }
  };

  return (
      <div className='container'>
        <h1>Inscription</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="object-form">
            <label htmlFor="nom">Nom</label>
            <input className="input-form" type="text" id="nom" name="nom" required />
          </div>
          <div className="object-form">
            <label htmlFor="prenom">Prénom</label>
            <input className="input-form" type="text" id="prenom" name="prenom" required />
          </div>
          <div className="object-form">
            <label htmlFor="email">Email</label>
            <input className="input-form" type="email" id="email" name="email" required />
          </div>
          <div className="object-form">
            <label htmlFor="password">Mot de passe</label>
            <input className="input-form" type="password" id="password" name="password" required />
          </div>
          <div className="object-form">
            <label htmlFor="passwordConfirm">Confirmer le mot de passe</label>
            <input className="input-form" type="password" id="passwordConfirm" name="passwordConfirm" required />
          </div>
          <button class="submit-form" type="submit">S'inscrire</button>
        </form>
      </div>
  );
};

export default Inscription;
