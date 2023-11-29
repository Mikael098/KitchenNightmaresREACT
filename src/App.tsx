import DetailRestaurant from './routes/detailRestaurant.route';
import Login from './routes/login.route';
import  HomeRoute  from './routes/home.route';
import FormulaireRoute from './routes/formulaire.route';
import Supression from './routes/supression.route';
//import {IRestaurant} from './models/irestaurant.model';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/home" element={<HomeRoute />} />
        <Route path="/login" element={<Login />} />
        <Route path="/restaurant/:id" element={<DetailRestaurant />} />
        <Route path="/supression/:restaurantId/:restaurantNom" element={<Supression />} />
        <Route path="/formulaire" element={<FormulaireRoute />} />
        <Route path="/formulaire/:restaurantId/:restaurantNom/:restaurantDescription/:restaurantEmplacement/:restaurantCommentaireGordon/:restaurantNoteGordon/:restaurantNombreInsulte/:modification" element={<FormulaireRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
