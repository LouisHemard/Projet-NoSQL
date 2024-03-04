import * as React from 'react'

// Connexion tsx

const Connexion = () => {
  return (
    <div className='container'>
      <h1>Connexion</h1>
      <form>
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
  )
}

export default Connexion;