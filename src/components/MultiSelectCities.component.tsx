'use client';

import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const cities: string[] = [
  'Albertslund',
  'Ballerup',
  'Brøndby',
  'Dragør',
  'Frederiksberg',
  'Furesø',
  'Gentofte',
  'Gladsaxe',
  'Glostrup',
  'Greve',
  'Herlev',
  'Hvidovre',
  'Høje-Taastrup',
  'Ishøj',
  'København',
  'København K',
  'København N',
  'København NV',
  'København S',
  'København SV',
  'København Ø',
  'København V',
  'Lyngby-Taarbæk',
  'Rudersdal',
  'Rødovre',
  'Tårnby',
  'Vallensbæk',
];

export function MultiSelectCities() {
  const [city, setCity] = useState<string[]>([]);

  const searchParams = useSearchParams();

  const handleChange = (event: SelectChangeEvent<typeof city>) => {
    const {
      target: { value },
    } = event;
    const newCityValue = typeof value === 'string' ? value.split(',') : value;
    setCity(newCityValue);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (city.length > 0) {
      params.set('city', city.join(','));
      window.history.replaceState(null, '', `?${params.toString()}`);
    } else {
      console.log('test');
      params.delete('city');
      window.history.replaceState(null, '', `?${params.toString()}`);
    }
  }, [city, searchParams]);

  return (
    <div>
      <FormControl sx={{ width: 300 }}>
        <InputLabel id="city-multiple-checkbox-label">Hvor?</InputLabel>
        <Select
          labelId="city-multiple-checkbox-label"
          id="city-multiple-checkbox"
          multiple
          value={city}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {cities.map((location) => (
            <MenuItem key={location} value={location}>
              <Checkbox checked={city.indexOf(location) > -1} />
              <ListItemText primary={location} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
