'use client';

import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';

export const ActivityPicker = () => {
  return (
    <Box>
      <ActivitySorter />
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        marginTop={4}
        flexWrap={'wrap'}
        gap={2}
      >
        <Activity />
        <Activity />
        <Activity />
        <Activity />
        <Activity />
        <Activity />
      </Box>
    </Box>
  );
};

const Activity = () => {
  return (
    <Card sx={{ width: '30%', backgroundColor: '#d9d9d9' }}>
      <CardContent>
        <Box position={'relative'} width={'100%'} height={80}>
          <Image
            src={'/images/activity.jpeg'}
            alt="Activity image"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </Box>
        <Typography variant="h6" marginTop={2}>
          GoKart Amager
        </Typography>
        <Typography>Fra 249 DKK pr. person</Typography>
      </CardContent>
    </Card>
  );
};

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
