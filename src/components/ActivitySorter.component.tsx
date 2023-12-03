import { Box, FormControl, InputLabel, MenuItem, Select, Slider, TextField, Typography } from '@mui/material';
import { useState } from 'react';

const ActivitySorter = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [priceFilter, setPriceFilter] = useState<number[]>([99, 699]);

  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      flexWrap={'wrap'}
      boxSizing={'border-box'}
    >
      <FormControl sx={{ width: '35%' }}>
        <TextField
          id="outlined-basic"
          label="Søg efter aktivitet"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Søg efter aktivitet"
        />
      </FormControl>

      <FormControl sx={{ width: '30%' }}>
        <InputLabel id="demo-simple-select-label">Område</InputLabel>
        <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Age">
          <MenuItem value={10}>København Ø</MenuItem>
          <MenuItem value={20}>København V</MenuItem>
          <MenuItem value={30}>København K</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ width: '30%' }} variant="outlined">
        <Typography>Pris</Typography>
        <Slider
          min={0}
          max={1500}
          valueLabelDisplay="auto"
          value={priceFilter}
          onChange={(e, newvalue) => setPriceFilter(newvalue as number[])}
        />
      </FormControl>
    </Box>
  );
};
