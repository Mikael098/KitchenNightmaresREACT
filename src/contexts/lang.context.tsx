import { MenuItem, Select, SelectChangeEvent, Box } from '@mui/material';
import React, { useState, ReactNode, createContext } from 'react';

// Définir le type du contexte
interface LangContextProps {
    locale: string;
    setLocale: React.Dispatch<React.SetStateAction<string>>;
}

export const LangContext = createContext<LangContextProps | undefined>(undefined);



export default function LangContextProvider({children}: { children: ReactNode }) {
    const [locale, setLocale] = useState('fr');

    const handleLangChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    const selectedValue = event.target.value;
      setLocale(selectedValue);
    };

    return (
        <LangContext.Provider value={{ locale,setLocale }}>
          <br />
        <Box   
          display="flex"
          flexDirection="column"
          textAlign={'center'}
          alignItems={'center'}
        >
        <Select value={locale} onChange={handleLangChange} style={{backgroundColor:'lightgray', color:'black', textAlign:'center', width:'18.5%'}}>
          <MenuItem value="fr">Français</MenuItem>
          <MenuItem value="en">English</MenuItem>
        </Select>
        </Box>
        
        {/* Fournir la valeur de la langue via le contexte */}
        {children}
        </LangContext.Provider>

    );
  }

