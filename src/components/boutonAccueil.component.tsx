import React, { useContext } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LangContext } from '../contexts/lang.context';
import { IntlProvider, FormattedMessage } from 'react-intl';
import fr from '../lang/fr.json';
import en from '../lang/en.json';


export const BoutonAccueil = () => {

  const { locale } = useContext(LangContext)!; // Utiliser le contexte pour obtenir la langue actuelle
  const messages = locale === 'fr' ? fr : en;
  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/home');
  };

  return (
    <>
      <IntlProvider locale={locale} messages={messages}>
          {/*Permet d'aller à l'accueil*/}
          <Button onClick={handleHome} style={{position:'absolute', top:0, left:80, color: 'Black', backgroundColor:'orangered',marginRight: '40px', marginTop:'20px', fontWeight:'bold' }}>
            <FormattedMessage id="accueil" />
          </Button>

      </IntlProvider>
    </>
  );
};
