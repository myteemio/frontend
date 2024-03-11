import { DatePicker } from '@/components/DatePicker/DatePicker';
import { Box, Typography } from '@mui/material';

export default function CreateEvent() {
  return (
    <Box
      sx={{ height: '100%' }}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Typography>Opret dit event her</Typography>
      <DatePicker />
    </Box>
  );
}
