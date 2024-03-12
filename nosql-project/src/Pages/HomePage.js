import React from 'react';
import './Form.css';
import {NavLink} from "react-router-dom";

function HomePage() {
  return (
  <div className="container">
    <h1>WhyNote</h1>
    <h2>Capturez l'instant, notez l'idée - Votre univers de notes en un clic!</h2>
    <p>Si vous avez déjà un compte</p>
      <form>
        <NavLink to="/Connexion">
        <input type="submit" value="Se connecter" />
        </NavLink>
      </form>
      <p>Sinon</p>
      <form>
        <NavLink to="/Inscription">
          <input type="submit" value="S'inscrire" />
        </NavLink>
      </form>
  </div>
  )
}

export default HomePage;
