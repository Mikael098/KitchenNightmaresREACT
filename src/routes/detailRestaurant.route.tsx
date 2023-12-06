import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Card, CardContent, Box, Grid, ListItemText, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BoutonConnexion } from '../components/boutonConnexion.component';
import { BoutonAccueil } from '../components/boutonAccueil.component';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { LangContext } from '../contexts/lang.context';
import fr from '../lang/fr.json';
import en from '../lang/en.json';

export const DetailRestaurant = () => {

  const { locale } = useContext(LangContext)!;
  const messages = locale === 'fr' ? fr : en;

  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const navigate = useNavigate();

  const handleModification = (restaurantId: string, restaurantNom: string, restaurantDescription: string, restaurantEmplacement: string, restaurantCommentaireGordon: string, restaurantNoteGordon: number, restaurantNombreInsulte: number, modification: boolean) => {
    navigate( `/formulaire/${restaurantId}/${restaurantNom}/${restaurantDescription}/${restaurantEmplacement}/${restaurantCommentaireGordon}/${restaurantNoteGordon}/${restaurantNombreInsulte}/${modification}` );
  };

  const handleSupprimer = (restaurantId: string, restaurantNom: string) => {
    navigate( `/supression/${restaurantId}/${restaurantNom}` );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        //Locale
        //const response = await fetch(`http://localhost:3000/api/KitchenNightmares/id/${id}`);

        //En ligne
        const response = await fetch(`https://cool-churros-aa4f8c.netlify.app/api/KitchenNightmares/id/${id}`);

        const data = await response.json();

        setRestaurant(data.restaurant);
      } catch (error) {
        console.error(`Erreur lors de la récupération des informations pour le restaurant avec l'id ${id}`, error);
      }
    };

    fetchData();
  }, [id]);

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
        <Typography  variant="h2">Description</Typography>
      </Box>
      <br />
      <br />



      {!restaurant? (
      
      <Box   
        display="flex"
        flexDirection="column"
        alignItems="center"
        width={'100vw'}
      >
        <Typography variant="h4"> Aucune information trouvée pour le restaurant avec l'id </Typography>
        <Typography variant="h2">{id}</Typography>
      </Box>
      ) : (
        <>
        <Box   
          display="flex"
          flexDirection="column"
          width={'100vw'}
          textAlign={'center'}
        >
        <Grid container justifyContent='center'>
            <Card style={{ maxWidth: 1200 }}>
              <CardContent style={{ backgroundColor: 'LightGray', textAlign: 'center' }}>
                <Typography variant="h4">{restaurant.nom}</Typography>
                <Typography variant="body2">{restaurant.emplacement}</Typography>
                <br />
                <Typography variant="body1">{restaurant.description}</Typography>
                <br />
                {restaurant.cuisinier.length>0 && (
                  <>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      <FormattedMessage id="cuisinier" />
                    </Typography>
                    {restaurant.cuisinier.map((cuisinier, index) => (
                      <ListItemText key={index} primary={cuisinier} style={{ textAlign: 'center' }} />
                    ))}
                  </>
                )}
                <br />
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  <FormattedMessage id="informationEmission" />
                </Typography>
                <Typography variant="body1" >
                  <FormattedMessage
                    id="nombreInsulte"
                    values={{nombreInsulte: restaurant.nombre_insultes}}
                  />
                </Typography>


                <Typography variant="body1" >
                 
                <FormattedMessage
                  id="emissionCensurerCombo"
                  values={{ censureStatus: restaurant.emission_censurer ? <FormattedMessage id="oui" /> : <FormattedMessage id="non" /> }}
                />
                </Typography>


                {restaurant.date_de_visite && (
                  <Typography>
                    <FormattedMessage
                      id="dateVisite"
                      values={{
                        formatDate: new Intl.DateTimeFormat(locale, {
                          year: 'numeric',
                          month: 'long',
                          day: '2-digit',
                        }).format(new Date(restaurant.date_de_visite)),
                      }}
                    />
                  </Typography>
                  
                )}
                <br />
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  <FormattedMessage id="descriptionEmission" />
                </Typography>
                <Typography variant="body1">{restaurant.DescriptionPourEmission}</Typography>
                <br />
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  <FormattedMessage id="resumeEmission" />
                </Typography>
                <Typography variant="body1">{restaurant.ResumeEmission}</Typography>
                <br />
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  <FormattedMessage id="commentaireGordon" />
                </Typography>

                <Typography variant="body1" >
                  <FormattedMessage
                    id="noteGordonCombo"
                    values={{noteGordon: restaurant.note_de_Gordon}}
                  />
                </Typography>


                <Typography variant="body1">{restaurant.commentaire_de_Gordon}</Typography>
                <br />
                {restaurant.commentaire_public.length > 0 && (
                  <>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      <FormattedMessage id="commentairePublic" />
                    </Typography>
                    <Typography variant="body1" >
                      <FormattedMessage
                        id="notePublic"
                        values={{notePublic: restaurant.note_public}}
                      />
                    </Typography>
                    {restaurant.commentaire_public.map((commentaire, index) => (
                    <ListItemText
                      key={index}
                      primary={commentaire.commentaire}
                      secondary={
                        <>
                        <FormattedMessage
                          id="note"
                        />{' '}
                        {commentaire.note}
                        </>
                      }
                    />
                  ))}
                  </>
                )}
                
              </CardContent>
            </Card>
          </Grid>
          <Box
            display="flex"
            justifyContent="center"
            width={'100vw'}
          >
            <Button onClick={() => handleModification(restaurant._id, restaurant.nom, restaurant.description, restaurant.emplacement, restaurant.commentaire_de_Gordon, restaurant.note_de_Gordon, restaurant.nombre_insultes, true)} style={{color: 'Black', width:'10%', textAlign:'center', backgroundColor:'orangered', marginTop:'20px', fontWeight:'bold', marginRight:'10px' }}>
              <FormattedMessage id="modifier" />
            </Button>
            <Button onClick={() => handleSupprimer(restaurant._id, restaurant.nom)} style={{color: 'Black', width:'10%', textAlign:'center', backgroundColor:'red', marginTop:'20px', fontWeight:'bold' }}>
              <FormattedMessage id="supprimer" />
            </Button>

          </Box>
          <br />
          </Box>
        </>
    )}
    </IntlProvider>
    </>
  );
};

export default DetailRestaurant;
