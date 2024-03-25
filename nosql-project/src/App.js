import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../src/Pages/HomePage";
import Connexion from './Pages/ConnexionForm'
import Inscription from './Pages/InscriptionForm'
import NotePage from "./Pages/NotePage";
import NewNotes from "./Pages/NewNotes";
import ModifNote from "./Pages/ModifNote";
import ViewNote from './Pages/ViewNote';


import './Pages/Form.css'



const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage/>
  },
  {
    path: '/Inscription',
    element: <Inscription/>
  },
  {
    path: '/Connexion',
    element: <Connexion/>
  },
  {
    path: '/NotePage',
    element: <NotePage/>
  },
  {
    path:'/NewNotes',
    element: <NewNotes/>
  },
  {
    path:'/ViewNote',
    element: <ViewNote/>
  },
  {
    path:'/ModifNote', // Définissez le paramètre idNotes ici
    element: <ModifNote/>
  }
]);


function App() {
  return <RouterProvider router={router}/>;
}

export default App;
