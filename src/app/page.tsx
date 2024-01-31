import Image from 'next/image';
import { Metadata } from 'next';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';

export const metadata: Metadata = {
  title: 'Teemio',
  description: 'Den varmeste teemio',
};

export default function Home() {
  return (
    <>
      <Box
        minWidth="100%"
        minHeight={'100%'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Grid
          container
          flexWrap={'wrap'}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          width={'80%'}
          boxSizing={'border-box'}
          rowGap={4}
          paddingTop={4}
          paddingBottom={4}
        >
          <Grid item md={6.5} xs={12}>
            <Chip
              variant="filled"
              sx={{ marginBottom: 2 }}
              color="primary"
              label="Effektiviser din planlægning med 54%!"
            />
            <Typography variant="h3" fontWeight={'bold'}>
              PLANLÆG DIT NÆSTE TEAMEVENT
            </Typography>
            <Typography variant="body1" marginTop={2}>
              Med Teemio kan du nemt og uden omkostninger planlægge dit næste
              teamarrangement! Alt samles på ét sted, hvilket gør det enkelt og
              effektivt at organisere events skræddersyet til dit team. Print
              helt gratis en event side der kan hænges op på kontoret, og
              forbered dit team på en uforglemmelig dag!
            </Typography>
            <Box marginTop={4} display={'flex'} gap={2}>
              <Link href={'/planlaeg'}>
                <Button variant="contained" color="primary" size="large">
                  PLANLÆG NU
                </Button>
              </Link>
              <Link href={'/konceptet'}>
                <Button variant="contained" color="secondary" size="large">
                  Læs mere om konceptet
                </Button>
              </Link>
            </Box>
          </Grid>
          <Grid item md={4.5} xs={12}>
            <Box
              position={'relative'}
              height={400}
              width={'100%'}
              boxSizing={'border-box'}
              border={'1px solid gray'}
              borderRadius={2}
            >
              <Image
                src={'/images/frontpage.png'}
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                alt="Planlæg dit næste teamevent med Teemio"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'stretch'}
        width={'80%'}
        marginLeft={'auto'}
        marginRight={'auto'}
        paddingBottom={4}
        gap={2}
      >
        <Card
          variant="elevation"
          sx={{ backgroundColor: 'secondary.main', color: 'white' }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <LocalActivityIcon fontSize="large" color="primary" />
            <Typography variant="h6">Vælg aktiviter</Typography>
            <Typography variant="body1">
              Vælg aktiviter, planlæg din dag og opret event!
            </Typography>
          </CardContent>
        </Card>
        <Card
          variant="elevation"
          sx={{ backgroundColor: 'secondary.main', color: 'white' }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <LocalActivityIcon fontSize="large" color="primary" />
            <Typography variant="h6">Vælg aktiviter</Typography>
            <Typography variant="body1">
              Vælg aktiviter, planlæg din dag og opret event!
            </Typography>
          </CardContent>
        </Card>
        <Card
          variant="elevation"
          sx={{ backgroundColor: 'secondary.main', color: 'white' }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <LocalActivityIcon fontSize="large" color="primary" />
            <Typography variant="h6">Vælg aktiviter</Typography>
            <Typography variant="body1">
              Vælg aktiviter, planlæg din dag og opret event!
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
