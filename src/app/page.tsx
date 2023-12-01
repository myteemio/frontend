import Image from 'next/image';
import styles from './page.module.css';
import { Metadata } from 'next';
import { Box, Button, Container, Grid, Typography } from '@mui/material';

export const metadata: Metadata = {
  title: 'Teemio',
  description: 'Den varmeste teemio',
};

export default function Home() {
  return (
    <Box minWidth="100%" minHeight={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
      <Grid container display={'flex'} alignItems={'center'} width={'80%'}>
        <Grid item xs={7}>
          <Typography variant="h3" fontWeight={'bold'}>
            PLANLÆG DIT NÆSTE TEAMEVENT
          </Typography>
          <Typography variant="body1" marginTop={2}>
            Med Teemio kan du helt gratis planlægge dit næste teamevent! Vi samler det hele ét sted og sørger for at du
            som virksomhed får minimum 5% rabat på all vores aktiviter - så du kan spare tid og penge!
          </Typography>
          <Box marginTop={2}>
            <Button variant="contained" color="primary" size="large" startIcon="">
              PLANLÆG NU
            </Button>
          </Box>
        </Grid>
        <Grid item xs={5}>
          test2
        </Grid>
      </Grid>
    </Box>
  );
}
