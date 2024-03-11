import * as React from 'react';
import axios from 'axios'; // N'oublie pas d'installer axios avec npm ou yarn

const Inscription = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const nom = event.target.nom.value;
    const prenom = event.target.prenom.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const passwordConfirm = event.target.passwordConfirm.value;

    if (password !== passwordConfirm) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    const registrationData = {
      nom,
      prenom,
      mail: email,
      password,
    };

    try {
      const response = await axios.post('http://localhost:3001/register', registrationData);
      console.log('Inscription réussie:', response.data);
      // Redirection ou autres traitements ici
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    }
  };

  return (
      <div className='container'>
        <h1>Inscription</h1>
        <form onSubmit={handleSubmit}>
          <div className="object-form">
            <label className="label-form" htmlFor="nom">Nom</label>
            <input className="input-form" type="text" id="nom" name="nom" required />
          </div>
          <div className="object-form">
            <label className="label-form" htmlFor="prenom">Prénom</label>
            <input className="input-form" type="text" id="prenom" name="prenom" required />
          </div>
          <div className="object-form">
            <label className="label-form" htmlFor="email">Email</label>
            <input className="input-form" type="email" id="email" name="email" required />
          </div>
          <div className="object-form">
            <label className="label-form" htmlFor="password">Mot de passe</label>
            <input className="input-form" type="password" id="password" name="password" required />
          </div>
          <div className="object-form">
            <label className="label-form" htmlFor="passwordConfirm">Confirmer le mot de passe</label>
            <input className="input-form" type="password" id="passwordConfirm" name="passwordConfirm" required />
          </div>
          <button type="submit">S'inscrire</button>
        </form>
      </div>
  );
};

export default Inscription;
