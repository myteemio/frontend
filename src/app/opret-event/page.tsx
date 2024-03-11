'use client';
import { DatePicker } from '@/components/DatePicker/DatePicker';
import { EventBox } from '@/components/StyledComponents/FlexBox/CreateEventBox';
import { UploadBox } from '@/components/StyledComponents/FlexBox/UploadBox';
import { StyledEventHeader, StyledText } from '@/components/StyledComponents/Typography';
import { Check, CloudUpload } from '@mui/icons-material';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { ChangeEvent, useState } from 'react';

export default function CreateEvent() {
  const [filename, setFilename] = useState('');

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    const { name } = file;
    setFilename(name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (!evt?.target?.result) {
        return;
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <>
      <StyledEventHeader color={'primary'} textAlign={'center'}>
        Opret dit event her
      </StyledEventHeader>
      <EventBox>
        <Box width={'100%'} mb={4}>
          <Box sx={{ padding: 2, pb: 4, border: 'solid 1px #dddddd', borderRadius: '8px' }}>
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
            <Box mt={2}>
              <form>
                <StyledText mb={2} color={'primary'}>
                  Tilføj Logo / Billede
                </StyledText>
                <UploadBox>
                  <Button
                    startIcon={<CloudUpload />}
                    variant="outlined"
                    component="label"
                    sx={{ py: { xs: 6 }, px: { xs: 2, sm: 6 }, mr: { xs: 0, sm: 2 } }}
                  >
                    Upload Billede
                    <input type="file" accept="image/*" hidden onChange={handleFileUpload} />
                  </Button>
                  <Box
                    display={'flex'}
                    width={{ xs: '100%', sm: '50%' }}
                    columnGap={2}
                    mt={2}
                    alignSelf={{ xs: 'none', sm: 'center' }}
                  >
                    {filename ? <Check color="success" /> : null}
                    <Typography>{filename}</Typography>
                  </Box>
                </UploadBox>
              </form>
            </Box>
          </Box>
        </Box>
        <Box width={'100%'}>
          <DatePicker />
        </Box>
      </EventBox>
    </>
  );
}
