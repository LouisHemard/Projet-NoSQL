import * as React from 'react'

// Connexion tsx

const Connexion = () => {
  return (
    <div className='container'>
      <h1>Connexion</h1>
      <form>
        <div className="object-form">
          <input className="input-form" type="email" id="email" name="email" placeholder="Email"/>
        </div>
        <div className="object-form">
          <input className="input-form" type="password" id="password" name="password" placeholder="Mot de passe" />
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  )
}

export default Connexion;