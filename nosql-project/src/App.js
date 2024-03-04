import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../src/Pages/HomePage";


const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage/>
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
