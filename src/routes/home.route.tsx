import { useState, useEffect, useContext } from 'react';
import { Typography, Grid, Button, Card, CardContent, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BoutonConnexion } from '../components/boutonConnexion.component';
import { Information } from '../components/information.component';
import Filtre from '../../src/components/filtre.component';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { LangContext } from '../contexts/lang.context';
import fr from '../lang/fr.json';
import en from '../lang/en.json';


//Permet dafficher la page d'accueil
export const HomeRoute = () => {

  const { locale } = useContext(LangContext)!;
  const messages = locale === 'fr' ? fr : en;


  //Locale
  //const [urlApi, setUrlApi] = useState<string>('http://localhost:3000/api/KitchenNightmares/tout');

  //En ligne
  const [urlApi, setUrlApi] = useState<string>('https://cool-churros-aa4f8c.netlify.app/api/KitchenNightmares/tout');

  const [selectedFiltre, setSelectedFiltre] = useState<string>('tout');
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const navigate = useNavigate();

  const handleDropdownChange = (censureValue: string, noteGordonValue: string) => {
    setSelectedFiltre(censureValue);
    if (censureValue === 'tout') {

      //Locale'
      //setUrlApi('http://localhost:3000/api/KitchenNightmares/tout');

      //En ligne
      setUrlApi('https://cool-churros-aa4f8c.netlify.app/api/KitchenNightmares/tout');
    }

    else if (censureValue === 'censurer') {
      //Locale
      //setUrlApi('http://localhost:3000/api/KitchenNightmares/censure/true');

      //En ligne
      setUrlApi('https://cool-churros-aa4f8c.netlify.app/api/KitchenNightmares/censure/true');
    }
    
    else {
      //Locale
      //setUrlApi('http://localhost:3000/api/KitchenNightmares/censure/false');

      //En ligne
      setUrlApi('https://cool-churros-aa4f8c.netlify.app/api/KitchenNightmares/censure/false');
    }

    if (noteGordonValue && censureValue !== '') {
      //Locale
      //setUrlApi(`http://localhost:3000/api/KitchenNightmares/noteGordon/${noteGordonValue}`);

      //En ligne
      setUrlApi(`https://cool-churros-aa4f8c.netlify.app/api/KitchenNightmares/notegordon/${noteGordonValue}`);
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

      console.log(data); // Log the data to check what's being received


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
