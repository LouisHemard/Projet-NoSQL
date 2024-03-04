import * as React from 'react'

// Formulaire d'inscription tsx

const Inscription = () => {
  return (
    <div>
      <h1>Inscription</h1>
      <form>
        <div>
          <label htmlFor="username">Nom d'utilisateur</label>
          <input type="username" id="username" name="username" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" />
        </div>
        <div>
          <label htmlFor="password">Mot de passe</label>
          <input type="password" id="password" name="password" />
        </div>
        <div>
          <label htmlFor="passwordConfirm">Confirmer le mot de passe</label>
          <input type="password" id="passwordConfirm" name="passwordConfirm" />
        </div>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  )
}