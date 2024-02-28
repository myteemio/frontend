import { Box } from '@mui/material';
import { MultiSelectCities } from '../MultiSelectCities.component';

export function ActivitiesFilter() {
  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      height={200}
      width={200}
      sx={{ backgroundColor: 'red' }}
    >
      <MultiSelectCities />
      <div>test</div>
      <div>test</div>
    </Box>
  );
}
