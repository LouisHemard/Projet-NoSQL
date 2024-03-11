import * as React from 'react'

// Formulaire d'inscription tsx

const Inscription = () => {
  return (
    <div className='container'>
      <h1>Inscription</h1>
      <form>
        <div className="object-form">
          <input className="input-form" type="username" id="username" name="username" placeholder="Nom d'utilisateur"/>
        </div>
        <div className="object-form">
          <input className="input-form" type="email" id="email" name="email"  placeholder="Email"/>
        </div>
        <div className="object-form">
          <input className="input-form" type="password" id="password" name="password" placeholder="Mot de passe"/>
        </div>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  )
}

export default Inscription;