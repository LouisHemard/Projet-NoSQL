import React from 'react';
import './Form.css';
import {NavLink} from "react-router-dom";
import { PiNotepadBold } from "react-icons/pi";

function HomePage() {
  return (
      <div className="container-general">
      <div className="container-left">
          <div className="center-form">
            <PiNotepadBold className="icon-form"/>
          </div>
          <h1>WhyNote</h1>
          <h2>Capturez l'instant, notez l'idée - Votre univers de notes en un clic!</h2>
          <div className="bloc-form">
            <p>Déjà un compte ?</p>
            <NavLink to="/Connexion">
              <input className="button-form" type="submit" value="Se connecter"/>
            </NavLink>
          </div>
          <div className="bloc-form">
            <p>S'inscrire</p>
            <NavLink to="/Inscription">
              <input className="button-form" type="submit" value="S'inscrire"/>
            </NavLink>
          </div>
      </div>
        <div className="container-right">
            <img src={require("../assets/img/img-homescreen.png")}/>
            <div className="glass-text">
                <p>Capturez l'instant, notez l'idée.</p>
            </div>
        </div>
      </div>
  )
}

export default HomePage;
