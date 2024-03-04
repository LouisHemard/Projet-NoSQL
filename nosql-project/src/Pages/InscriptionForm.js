import * as React from 'react'

// Formulaire d'inscription tsx

const Inscription = () => {
  return (
    <div className='container'>
      <h1>Inscription</h1>
      <form>
        <div className="object-form">
          <label className="label-form" htmlFor="username">Nom d'utilisateur</label>
          <input className="input-form" type="username" id="username" name="username" />
        </div>
        <div className="object-form">
          <label className="label-form" htmlFor="email">Email</label>
          <input className="input-form" type="email" id="email" name="email" />
        </div>
        <div className="object-form">
          <label className="label-form" htmlFor="password">Mot de passe</label>
          <input className="input-form" type="password" id="password" name="password" />
        </div>
        <div className="object-form">
          <label className="label-form" htmlFor="passwordConfirm">Confirmer le mot de passe</label>
          <input className="input-form" type="password" id="passwordConfirm" name="passwordConfirm" />
        </div>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  )
}

export default Inscription;