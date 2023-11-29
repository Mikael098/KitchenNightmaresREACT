import React, { useState, useContext } from 'react';
import { MenuItem, Select, SelectChangeEvent, Typography, TextField, Button } from '@mui/material';
import { IntlProvider, FormattedMessage, FormattedTime, FormattedDate, FormattedNumber } from 'react-intl';
import { LangContext } from '../contexts/lang.context';
import fr from '../lang/fr.json';
import en from '../lang/en.json';

interface FiltreProps {
  //Appelé lors d'un changement dans le dropdown ou le textfield
  onChange: (censureValue: string, noteGordonValue: string) => void;
  //Valeur du dropdown
  selectedValue: string;
}

//Permet de gérer les filtres
const Filtre: React.FC<FiltreProps> = ({ onChange, selectedValue }) => {

  const { locale } = useContext(LangContext)!;
  const messages = locale === 'fr' ? fr : en;

  //Variable servant à stocker la valeur du dropdown
  const [noteGordon, setNoteGordon] = useState<string>('');

  //Lorsque la valeur du dropdown change
  const handleCensureChange = (event: SelectChangeEvent<string>) => {
    //Permet d'envoyer la valeur du dropdown
    onChange(event.target.value, '');

    //Permet de remettre la visuel du textfield à 0
    setNoteGordon("");
  };

  //Lorsque la valeur du textfield change
  const handleNoteGordonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Assurez-vous que la valeur est un nombre entre 1 et 10
    const value = event.target.value;

    //Vérifie que le chiffre entré est entre 1 et 10
    if (/^\d+$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= 10) {
      //Permet de remettre la visuel du dropdown à tout
      onChange('tout', value);

      //Permet d'envoyer la valeur du textfield
      setNoteGordon(value);
    }
  };

  //Fonction pour effacer la valeur du textfield
  const handleClearNoteGordon = () => {
    setNoteGordon("");
    onChange(selectedValue, ""); // Effacer également la valeur dans le parent
  };

  //Affichage des entrées d'utilisateur
  return (
    <>
      <IntlProvider locale={locale} messages={messages}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
        <Typography variant="h6" style={{ marginRight: '20px' }}>
          <FormattedMessage id="emissionCensurer" />
        </Typography>
        <Select
          value={selectedValue}
          onChange={handleCensureChange}
          defaultValue="tout"
          style={{ color: 'black', backgroundColor: 'LightGray', width: '18.5%', fontSize: 18 }}>
          <MenuItem value="tout">
            <FormattedMessage id="tout"/>
          </MenuItem>
          <MenuItem value="censurer">
            <FormattedMessage id="oui" />
          </MenuItem>
          <MenuItem value="nonCensurer">
            <FormattedMessage id="non"/>
          </MenuItem>
        </Select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
        <Typography variant="h6">
          <FormattedMessage id="noteGordon" />
        </Typography>
        <TextField
          label={<FormattedMessage id="noteGordonCourt" />}
          type="number"
          value={noteGordon}
          onChange={handleNoteGordonChange}
          inputProps={{ min: '1', max: '10' }}
          style={{ marginLeft: '20px', width: '10%', backgroundColor: 'LightGray', fontSize: 18 }}
        />
        {/* Bouton pour effacer la valeur du textfield */}
        <Button variant="contained" onClick={handleClearNoteGordon} style={{marginLeft: '10px', fontWeight:'bold' ,backgroundColor:'red', color:'black' }}>
          <FormattedMessage id="effacer" />
        </Button>
      </div>
      </IntlProvider>
    </>
  );
};

export default Filtre;
