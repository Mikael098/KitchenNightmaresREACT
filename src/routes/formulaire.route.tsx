import React, { useState, useEffect, useContext } from 'react';
import { Typography, Box, TextField, Button, Grid, FormHelperText } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getToken, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { BoutonConnexion } from '../components/boutonConnexion.component';
import { BoutonAccueil } from '../components/boutonAccueil.component';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { LangContext } from '../contexts/lang.context';
import fr from '../lang/fr.json';
import en from '../lang/en.json';

//Permet de gérer l'ajout d'un restaurant
export const FormulaireRoute = () => {

  const { locale } = useContext(LangContext)!;
  const messages = locale === 'fr' ? fr : en;

  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  //Récupère les paramètres de l'URL
  const { restaurantId, restaurantNom, restaurantDescription, restaurantEmplacement, restaurantCommentaireGordon, restaurantNoteGordon, restaurantNombreInsulte, modification } = useParams();


  //Variable qui sert à stocker les données du formulaire
  const [formData, setFormData] = useState({
      nom: '',
      description: '',
      emplacement: '',
      commentaire_de_Gordon: '',
      note_de_Gordon: 0,
      nombre_insultes: 0,
  });

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
          await auth.signOut();
          navigate('/login');
        }

        //Vérifie que les données ne sont pas undefined, si c'est le cas on affiche les données pré-remplies
        //La condition est est vrai lorsqu'on modifie un restaurant
        else if ( restaurantNom && restaurantDescription && restaurantEmplacement && restaurantCommentaireGordon && restaurantNoteGordon !== null && restaurantNombreInsulte !== null )
        {
          setFormData({
            nom: restaurantNom,
            description: restaurantDescription,
            emplacement: restaurantEmplacement,
            commentaire_de_Gordon: restaurantCommentaireGordon,
            note_de_Gordon: Number(restaurantNoteGordon),
            nombre_insultes: Number(restaurantNombreInsulte),
          });
        }
      };
    }
    
    //Vérifie si l'usager est connecté
    checkUserAuthentication();
  }, [user, loading, navigate, restaurantNom, restaurantDescription, restaurantEmplacement, restaurantCommentaireGordon, restaurantNoteGordon, restaurantNombreInsulte]);
  

  //Variables qui sert à stocker les erreurs du formulaire
  const [formErrors, setFormErrors] = useState({
    nom: '',
    emplacement: '',
    description: '',
    commentaire_de_Gordon: '',
    note_de_Gordon: '',
    nombre_insultes: '',
  });
  
  //Lorsqu'il y a un changement
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
  
    // Mise à jour dynamique des champs du formulaire
    setFormData((prevData) => ({
      ...prevData,
      [name] : value,
    }));
  
    // Validation du champ nom
    if (name === 'nom') {
      if (value.length < 2 || value.length > 100) {
        setFormErrors((prevErrors) => ({ ...prevErrors, nom:'Le nom doit être entre 2 et 100 caractères'}));
      }

      else
      {
        setFormErrors((prevErrors) => ({ ...prevErrors, nom: '' }));
      }
    }

    //Validation du champ emplacement
    if (name === 'emplacement') {
      if (value.length < 10 || value.length > 200) {
        setFormErrors((prevErrors) => ({ ...prevErrors, emplacement: "L'emplacement doit être entre 10 et 200." }));
      }

      else
      {
        setFormErrors((prevErrors) => ({ ...prevErrors, emplacement: '' }));
      }
    }

    //Validation du champ description
    //Regex de chat.openai.com
    if (name === 'description') {
      const isDescriptionValid = /^[A-ZÀ-ÖØ-Þ][^\n.]*\.(\s+[A-ZÀ-ÖØ-Þ][^\n.]*)*\s*\.*$/.test(value);

      if(isDescriptionValid && value.length<250)
      {
        setFormErrors((prevErrors) => ({ ...prevErrors, description: '' }));
      }

      else
      {
        setFormErrors((prevErrors) => ({ ...prevErrors, description: 'La description doit être inférieur à 250 caractères et doit commencer par une majuscule et finir par un point' }));
      }
    }

    // Validation du champ commentaire de Gordon
    //Regex de chat.openai.com
    if (name === 'commentaire_de_Gordon') {
      const isCommentaireValid = /^[^\d]*$/.test(value);

      if(isCommentaireValid && value.length<500)
      {
        setFormErrors((prevErrors) => ({ ...prevErrors, commentaire_de_Gordon: '' }));
      }

      else
      {
        setFormErrors((prevErrors) => ({ ...prevErrors, commentaire_de_Gordon: isCommentaireValid ? '' : 'Le commentaire doit être inférieur à 500 caractères et si vous voulez inscrire un nombre, écrivez-le en lettres' }));
      }
    }

    // Validation du champ note de Gordon
    if (name === 'note_de_Gordon') {
      const noteValue = Number(value);

      // Validez la valeur minimale et maximale
      if (noteValue < 1 || noteValue > 10) {
        setFormErrors((prevErrors) => ({ ...prevErrors, note_de_Gordon: 'La note de Gordon doit être entre 1 et 10.' }));
      }
      else
      {
        setFormErrors((prevErrors) => ({ ...prevErrors, note_de_Gordon: '' }));
      }
    }

    // Validation du champ nombre d'insultes
    if (name === 'nombre_insultes') {
      const insultesValue = Number(value);

      if (insultesValue < 0)
      {
        setFormErrors((prevErrors) => ({ ...prevErrors, nombre_insultes: "Le nombre d'insultes ne peut être inférieur à 0." }));
      }

      else
      {
        setFormErrors((prevErrors) => ({ ...prevErrors, nombre_insultes: '', }));
      }
    }
  };

  //Lors de l'envoie du formulaire
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Empêche l'envoi du formulaire s'il y a des erreurs
    if (Object.values(formErrors).some((error) => error !== '')) {
      return;
    }

    // Détermine l'url en fonction de l'ajout ou de la modification
    const url = modification

      //Locale
      //? `http://localhost:3000/api/KitchenNightmares/update`

      //En ligne
      ? `https://cool-churros-aa4f8c.netlify.app/api/KitchenNightmares/update`

      //Locale
      //: 'http://localhost:3000/api/KitchenNightmares/add';

      //En ligne
      : 'https://cool-churros-aa4f8c.netlify.app/api/KitchenNightmares/add';

    
      try {
        // Envoie les données au serveur selon si c'est un ajout ou une modification
        const reponse = await fetch(url, {
          method: modification ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            restaurant: modification ? 
            {
              //On inclue l'id si c'est une modification
              _id: restaurantId,
              ...formData,
            }
          : {
              ...formData,
            },
          }),
        });

        //Si il y a une erreur lors de l'appel au serveur, ona ffiche son status
        if (!reponse.ok) {
          throw new Error(`Erreur HTTP! Status: ${reponse.status}`);
        }
  
        //Si c'est correct, on récupère les données
        const donnee = await reponse.json();
  
        // Si c'est une modification, on navigue vers la page de détail du restaurant
        if (modification)
        {
          navigate(`/restaurant/${restaurantId}`);
        }

        else
        {
          // Si c'est un ajout, on récupère son id et on navigue vers la page de détail du restaurant
          const createdItemId = donnee.restaurant._id;
          navigate(`/restaurant/${createdItemId}`);
        }
      } catch (erreur) {
        console.error('Erreur lors de la soumission du formulaire', erreur);
      }
    };

    //Permet de modifier l'affichage du formulaire en fonction de l'ajout ou de la modification
    const nomBoutonSoumission = modification ? 'Modifier' : 'Ajouter';
    const nomTitre = modification ? 'Formulaire de modification' : "Formulaire d'ajout";

  
  return (
    <>
    <IntlProvider locale={locale} messages={messages}>
      <BoutonConnexion />
      <BoutonAccueil />
      <br />
      <br />
      <br />
      <Grid container spacing={3} justifyContent='center' style={{textAlign:'center'}}>
      <form onSubmit={handleSubmit}>
        <Box width={'100vw'}>
          {nomTitre==='Formulaire de modification' && (
            <Typography style={{ textAlign: 'center', color:'black', fontWeight:'bold' }} variant="h2" >
              <FormattedMessage id="titreFormulaireModification" />
            </Typography>
          )}

          {nomTitre==="Formulaire d'ajout" && (
            <Typography style={{ textAlign: 'center', color:'black', fontWeight:'bold' }} variant="h2" >
              <FormattedMessage id="titreFormulaireAjout" />
            </Typography>
          )}
        <br />
          <TextField
            style={{ color: 'black', backgroundColor: 'lightgray', width: '500px', maxWidth:'500px', fontSize: 18 }}
            label={<FormattedMessage id="nom" />}
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            error={formErrors.nom !== ''}
          />
          {formErrors.nom && (
            <FormHelperText error={formErrors.nom !== ''} style={{fontSize:18, fontWeight:'bold', textAlign:'center'}}>
              <FormattedMessage id="validationNom"/>
            </FormHelperText>
          )}
          <br />
          <TextField
            style={{ color: 'black', backgroundColor: 'LightGray', width: '500px', maxWidth:'500px',fontSize: 18 }}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
            required
            error={formErrors.description !== ''}
          />
          {formErrors.description && (
            <FormHelperText error={formErrors.description !== ''} style={{fontSize:18, fontWeight:'bold', textAlign:'center'}}>
              <FormattedMessage id="validationDescription"/>
            </FormHelperText>
          )}

          <br />
          <TextField
            style={{ color: 'black', backgroundColor: 'lightgray', width: '500px', maxWidth:'500px', fontSize: 18 }}
            label={<FormattedMessage id="emplacement" />}
            name="emplacement"
            value={formData.emplacement}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            error={formErrors.emplacement !== ''}
          />
          {formErrors.emplacement && (
            <FormHelperText error={formErrors.emplacement !== ''} style={{fontSize:18, fontWeight:'bold', textAlign:'center'}}>
              <FormattedMessage id="valdiationEmplacement"/>
            </FormHelperText>
          )}
          <br />
          <TextField
            style={{ color: 'black', backgroundColor: 'lightgray', width: '500px', maxWidth:'500px', fontSize: 18 }}
            label={<FormattedMessage id="commentaireGordon" />}
            name="commentaire_de_Gordon"
            value={formData.commentaire_de_Gordon}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
            required
            error={formErrors.commentaire_de_Gordon !== ''}
          />
          {formErrors.commentaire_de_Gordon && (
            <FormHelperText error={formErrors.commentaire_de_Gordon !== ''} style={{fontSize:18, fontWeight:'bold', textAlign:'center'}}>
              <FormattedMessage id="validationCommentaire"/>
            </FormHelperText>
          )}
          <br />
          <TextField
            style={{ color: 'black', backgroundColor: 'lightgray', width: '500px', maxWidth:'500px', fontSize: 18 }}
            label={<FormattedMessage id="noteGordon" />}
            name="note_de_Gordon"
            type="number"
            value={formData.note_de_Gordon}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            error={formErrors.note_de_Gordon !== ''}
          />
          {formErrors.note_de_Gordon && (
            <FormHelperText error={formErrors.note_de_Gordon !== ''} style={{fontSize:18, fontWeight:'bold', textAlign:'center'}}>
              <FormattedMessage id="validationNote"/>
            </FormHelperText>
          )}
          <br />
          <TextField
            style={{ color: 'black', backgroundColor: 'lightgray', width: '500px', maxWidth:'500px',fontSize: 18 }}
            label={<FormattedMessage id="nombreInsulteFormulaire" />}
            name="nombre_insultes"
            type="number"
            value={formData.nombre_insultes}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            error={formErrors.nombre_insultes !== ''}
          />
          {formErrors.nombre_insultes && (
            <FormHelperText error={formErrors.nombre_insultes !== ''} style={{fontSize:18, fontWeight:'bold', textAlign:'center'}}>
              <FormattedMessage id="validationNombreInsulte"/>
            </FormHelperText>
          )}
          <br />
          <Button type="submit" variant="contained" color="primary" style={{ width:'15%', backgroundColor:'orangered', color:'black', fontWeight:'bold'}} >
            {nomBoutonSoumission}
          </Button>
          <br />
          <br />
          </Box>
      </form>
      </Grid>
      </IntlProvider>
    </>
  );
};

export default FormulaireRoute;