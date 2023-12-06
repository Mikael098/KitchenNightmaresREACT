import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BoutonConnexion } from '../components/boutonConnexion.component';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getToken, auth } from '../firebase';
import { BoutonAccueil } from '../components/boutonAccueil.component';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { LangContext } from '../contexts/lang.context';
import fr from '../lang/fr.json';
import en from '../lang/en.json';

//Permet de gérer la supression d'un restaurant
export const Supression = () => {

  const { locale } = useContext(LangContext)!;
  const messages = locale === 'fr' ? fr : en;

  const { restaurantId, restaurantNom } = useParams();
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  //Lors de la confirmation de supression, on supprimer et on est redirigé à la page d'accueil
  const handleSupprimerConfirmation = async () => {


    try {
      //Locale
      //await fetch(`http://localhost:3000/api/KitchenNightmares/delete/${restaurantId}`,{

      //En ligne
      await fetch(`https://cool-churros-aa4f8c.netlify.app/api/KitchenNightmares/delete/${restaurantId}`,{
        method: 'DELETE',
      });
      navigate(`/home`);
    } catch (erreur) {
      console.error(`Erreur lors de la suppression du restaurant avec l'id ${restaurantId}`, erreur);
    }
  };

  //Lors de l'annulation de la supression, on est redirigé à la page de description du restaurant
  const handleSupprimerAnnulation = () => {
    navigate(`/restaurant/${restaurantId}`);
  };

  useEffect(() => {
    const checkUserAuthentication = async () => {

      //Redirige l'usager à la page de connexion s'il n'est pas connecté
      if (!loading && !user) {
        navigate('/login');
      }
      else
      {
        //Vérifie si le token est valide
        const token = await getToken();

        // Si le token n'est pas valide, on le déconnecter et le redirige vers la page de connexion
        if (!token) {
          navigate('/login');
        }
      }
    }

    //Vérifie si l'usager est connecté
    checkUserAuthentication();
    }, [user, loading, navigate]);


  return (
    <>
      <IntlProvider locale={locale} messages={messages}>
      <BoutonConnexion />
      <div style={{justifyContent:'center', textAlign:'center'}}>
        <BoutonAccueil />
      </div>
      <br />
      <br />
      <Box   
        display="flex"
        flexDirection="column"
        textAlign={'center'}
      >
        <Typography  variant="h2">
          <FormattedMessage id="supprimer" />
        </Typography>
        
      </Box>
      <br />
      <br />
      <Box   
        display="flex"
        flexDirection="column"
        alignItems="center"
        width={'100vw'}
      >
        <Typography variant="h4">
          <FormattedMessage id="questionSuppression" />
        </Typography>
        <Typography variant="h2">{restaurantNom}</Typography>
      </Box>  
      <Box
        display="flex"
        justifyContent="center"
        width={'100vw'}
      >
        <Button onClick={handleSupprimerConfirmation} style={{color: 'Black', width:'10%', textAlign:'center', backgroundColor:'orangered', marginTop:'20px', fontWeight:'bold', marginRight:'10px' }}>
          <FormattedMessage id="confirmer" />
        </Button>

        <Button onClick={handleSupprimerAnnulation} style={{color: 'Black', width:'10%', textAlign:'center', backgroundColor:'red', marginTop:'20px', fontWeight:'bold' }}>
          <FormattedMessage id="annuler" />
        </Button>

      </Box>
      </IntlProvider>
    </>
  );
};

export default Supression;