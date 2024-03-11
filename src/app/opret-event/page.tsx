'use client'
import { DatePicker } from '@/components/DatePicker/DatePicker';
import { StyledBox } from '@/components/StyledComponents/FlexBox/CreateEventBox';
import { StyledHeader, StyledText } from '@/components/StyledComponents/Typography';
import { Box, Paper, TextField } from '@mui/material';

export default function CreateEvent() {
  return (
    <StyledBox p={2}>
      <StyledHeader mb={4} color={'primary'}>
        Opret dit event her
      </StyledHeader>
      <Box width={'100%'} mb={4}>
        <Paper square={false} elevation={3} sx={{ padding: '16px' }}>
          <Box component={'form'} mb={2}>
            <StyledText color={'primary'}>Event navn</StyledText>
            <TextField margin="dense" fullWidth placeholder="Padel X Marketing Event" required />
          </Box>
          <Box component={'form'} mb={2}>
            <StyledText color={'primary'}>Beskrivelse</StyledText>
            <TextField placeholder="Beskrivelse..." margin="dense" fullWidth multiline rows={4} required />
          </Box>
          <Box component={'form'} mb={2}>
            <StyledText color={'primary'}>Event navn</StyledText>
            <TextField margin="dense" fullWidth required />
          </Box>
        </Paper>
      </Box>
      <Box width={'100%'}>
        <DatePicker />
      </Box>
    </StyledBox>
  );
}
