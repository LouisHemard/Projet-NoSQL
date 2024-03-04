import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../src/Pages/HomePage";
import Connexion from './Pages/ConnexionForm'
import Inscription from './Pages/InscriptionForm'
import './Pages/Form.css'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage/>
  },
  {
    path: '/Inscription',
    element: <div>Page Inscription</div>
  },
  {
    path: '/Connexion',
    element: <div>Page Connexion</div>
  },
]);


function App() {
  return <RouterProvider router={router}/>;
}

export default App;
