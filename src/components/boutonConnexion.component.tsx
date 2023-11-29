import React, { useContext } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { logout, auth } from '../firebase';
import { LangContext } from '../contexts/lang.context';
import { IntlProvider, FormattedMessage } from 'react-intl';
import fr from '../lang/fr.json';
import en from '../lang/en.json';

export const BoutonConnexion = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const { locale } = useContext(LangContext)!; // Utiliser le contexte pour obtenir la langue actuelle
  const messages = locale === 'fr' ? fr : en;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
    <IntlProvider locale={locale} messages={messages}>
    <br />
      {user ? (
        // Si l'utilisateur est connecté, afficher le bouton de déconnexion
        <Button onClick={handleLogout} style={{ position:'absolute', top:0, right:10,backgroundColor: 'Red', color: 'Black', marginRight: '40px', marginTop:'20px', fontWeight:'bold' }}>
          <FormattedMessage id="deconnexion" />
        </Button>
      ) : (
        // Si l'utilisateur n'est pas connecté, afficher le bouton de connexion
        <Button onClick={() => navigate('/login')} style={{ position:'absolute', top:0, right:10,backgroundColor: 'Green', color: 'Black', marginRight: '40px', marginTop:'20px', fontWeight:'bold' }}>
          <FormattedMessage id="connexion" />
        </Button>
      )}
      </IntlProvider>
    </>
  );
};
