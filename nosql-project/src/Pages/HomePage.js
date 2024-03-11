import React from 'react';
import './HomePage.css';
import {NavLink} from "react-router-dom";

function HomePage() {
  return (
  <div classname="HomePage">
    <h2>Si vous avez déjà un compte</h2>
      <form>
        <NavLink to="/Connexion">
        <input type="submit" value="Se connecter" />
        </NavLink>
      </form>
      <h2>Sinon</h2>
      <form>
        <NavLink to="/Inscription">
          <input type="submit" value="S'inscrire" />
        </NavLink>
      </form>
  </div>
  )
}

export default HomePage;
