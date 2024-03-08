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
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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

export function MultiSelectCities(props: { cities: string[]; citiesLoading: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [city, setCity] = useState<string[]>([]);
  const [allCities, setAllCities] = useState<string[]>([]);

  const searchParams = useSearchParams();

  const handleChange = (event: SelectChangeEvent<typeof city>) => {
    const {
      target: { value },
    } = event;
    const newCityValue = typeof value === 'string' ? value.split(',') : value;
    setCity(newCityValue);
  };

  useEffect(() => {
    if (!props.citiesLoading) {
      setAllCities(props.cities);
    }
  }, [props.cities, props.citiesLoading]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (city.length > 0) {
      params.set('city', city.join(','));
      router.push(pathname + '?' + params.toString());
    } else {
      params.delete('city');
      router.push(pathname + '?' + params.toString());
    }
  }, [city, searchParams, pathname, router]);

  return (
      <FormControl fullWidth>
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
          {allCities.map((location, index) => (
            <MenuItem key={`${location}${index}`} value={location}>
              <Checkbox checked={city.indexOf(location) > -1} />
              <ListItemText primary={location} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  );
}
