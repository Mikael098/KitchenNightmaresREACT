import React, { useState, useEffect, useContext } from 'react';
import { Typography, Grid, Button, Card, CardContent, Box } from '@mui/material';
import { Form, useNavigate } from 'react-router-dom';
import { BoutonConnexion } from '../components/boutonConnexion.component';
import { Information } from '../components/information.component';
import Filtre from '../../src/components/filtre.component';
import { IntlProvider, FormattedMessage, FormattedTime, FormattedDate, FormattedNumber } from 'react-intl';
import { LangContext } from '../contexts/lang.context';
import fr from '../lang/fr.json';
import en from '../lang/en.json';


//Permet dafficher la page d'accueil
export const HomeRoute = () => {

  const { locale } = useContext(LangContext)!;
  const messages = locale === 'fr' ? fr : en;

  const [urlApi, setUrlApi] = useState<string>('http://localhost:3000/KitchenNightmares/tout');
  const [selectedFiltre, setSelectedFiltre] = useState<string>('tout');
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const navigate = useNavigate();

  const handleDropdownChange = (censureValue: string, noteGordonValue: string) => {
    setSelectedFiltre(censureValue);
    if (censureValue === 'tout') {
      setUrlApi('http://localhost:3000/KitchenNightmares/tout');
    } else if (censureValue === 'censurer') {
      setUrlApi('http://localhost:3000/KitchenNightmares/censure/true');
    } else {
      setUrlApi('http://localhost:3000/KitchenNightmares/censure/false');
    }

    if (noteGordonValue && censureValue !== '') {
        setUrlApi(`http://localhost:3000/KitchenNightmares/noteGordon/${noteGordonValue}`);
    }
  };

  const handleCardClick = (restaurantId: string) => {
    // Use the navigate function to go to the RestaurantDetail page
    navigate(`/restaurant/${restaurantId}`);
  };

  const handleAjout = () => {
    navigate('/formulaire');
  };



  useEffect(() => {
    
    const fetchData = async () => {
      const response = await fetch(urlApi);
      const data = await response.json();

      setRestaurants(data.restaurants);
    };

    fetchData();
  }, [urlApi, selectedFiltre]);

  return (
    <>
      <IntlProvider locale={locale} messages={messages}>
      <BoutonConnexion/>
 
      <Typography style={{ textAlign: 'center' }} variant="h2">
        <FormattedMessage id="accueil" /> {" "}
      </Typography>
      <br />
      <Information></Information>
      <br />
      <Filtre onChange={handleDropdownChange} selectedValue={selectedFiltre} />

      <br />
      <Box
        display="flex"
        justifyContent="center"
        width={'100vw'}
      >
        <Button onClick={handleAjout} style={{ color: 'black', backgroundColor: 'orangered', fontWeight: 'bold', height:'50px', width:'200px' }}>
        <FormattedMessage id="ajout" />
        </Button>
      </Box>

      {/*Si il y a aucun restaurant*/}
      {restaurants.length === 0 ? (
      <Box
      display="flex"
      justifyContent="center"
      width={'100vw'}
      >
      <Typography variant="body2" fontSize={80}>
        <FormattedMessage id="aucunRestaurant" /> {" "}
      </Typography>
      </Box>
    ) : (

      <>

      <br />
      <br />
      <Grid container spacing={3} justifyContent='center' style={{textAlign:'center'}}>
        {restaurants.map((restaurant) => (
          <Grid item key={restaurant._id} md={4.5}>
            
            <Card onClick={() => handleCardClick(restaurant._id)}>
              <CardContent style={{backgroundColor:'LightGray'}}>
                <Typography variant="h4" >{restaurant.nom}</Typography>
                <Typography variant="body2" >{restaurant.emplacement}</Typography>
                <br />
                <Typography variant="body1">{restaurant.description}</Typography>
                <br />
                <Typography variant="body1" >
                 
                <FormattedMessage
                  id="emissionCensurerCombo"
                  values={{ censureStatus: restaurant.emission_censurer ? <FormattedMessage id="oui" /> : <FormattedMessage id="non" /> }}
                />
                </Typography>

                <Typography variant="body1" >
                  <FormattedMessage
                    id="noteGordonCombo"
                    values={{noteGordon: restaurant.note_de_Gordon}}
                  />
                </Typography>

                <Typography variant="body1" >
                  <FormattedMessage
                    id="notePublic"
                    values={{notePublic: restaurant.note_public}}
                  />
                </Typography>

                <br />
                <Typography variant="body1" style={{fontWeight:'bold'}}>
                  <FormattedMessage id="commentaireGordon" />
                </Typography>
                <Typography variant="body1">{restaurant.commentaire_de_Gordon}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
        ))}
      </Grid>
      </>
    )}
      <br />
      <br />
      </IntlProvider>
    </>
  );
};

export default HomeRoute;
