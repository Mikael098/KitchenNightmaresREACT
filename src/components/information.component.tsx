import React, { useState, useEffect, useContext } from 'react';
import { Typography } from '@mui/material';
import { IntlProvider, FormattedMessage, FormattedTime, FormattedDate, FormattedNumber } from 'react-intl';
import { LangContext } from '../contexts/lang.context';
import fr from '../lang/fr.json';
import en from '../lang/en.json';

export const Information = () => {

  const { locale } = useContext(LangContext)!;
  const messages = locale === 'fr' ? fr : en;

  //Définie les url des apis de stats
  const urlApiInsulte = 'http://localhost:3000/KitchenNightmares/insulteTotal';
  const urlApiMoyenneGordon = 'http://localhost:3000/KitchenNightmares/moyenneGordon';

  //Variable d'environnement pour stocker les données 
  const [insultes, setInsultes] = useState<number>();
  const [moyenneGordon, setMoyenneGordon] = useState<number>();


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupération des nombres d'insultes
        const insultesResponse = await fetch(urlApiInsulte);
        const insultesData = await insultesResponse.json();

        // Mise à jour de la variable d'environnement
        setInsultes(insultesData.nombreInsultes);

        //Récupération de la moyenne de Gordon
        const moyenneGordonResponse = await fetch(urlApiMoyenneGordon);
        const moyenneGordonData = await moyenneGordonResponse.json();
        setMoyenneGordon(moyenneGordonData.moyenneGordon);

      } catch (error) {
        //Récupère les erreurs si il y a un problème lors de la lecture des api
        console.error({ urlApiInsulte, urlApiMoyenneGordon }, error);
      }
    };

    fetchData();
  }, []);

  // Rendu du composant
  return (
    <>
      <IntlProvider locale={locale} messages={messages}>
      {/* Conteneur centré avec les résultats affichés */}
      <div style={{ textAlign: 'center' }}>
        <Typography variant="h5" >
          <FormattedMessage
            id="nombreInsulteTotal"
            values={{nombreInsulte: insultes}}
          />
        </Typography>

        <Typography variant="h5" >
          <FormattedMessage
            id="moyenneGordon"
            values={{moyenneGordon: moyenneGordon}}
          />
        </Typography>

      </div>
      </IntlProvider>
    </>
  );
};
