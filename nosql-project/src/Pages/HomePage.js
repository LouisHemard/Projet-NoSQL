import React from 'react';
import './HomePage.css';

function HomePage() {
  return (
  <div classname="HomePage">
    <h2>Si vous avez déjà un compte</h2>
      <form>
        <input type="submit" value="Se connecter" />
      </form>
      <h2>Sinon</h2>
      <form>
        <input type="submit" value="S'inscrire" />
      </form>
  </div>
  )
}

export default HomePage;