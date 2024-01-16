'use client';

import { Box, Card, Typography } from '@mui/material';
import styles from './page.module.css';
import Image from 'next/image';
import ActivityInfo from '@/components/ActivityInfo/ActivityInfo';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ActivityLocation } from '@/components/ActivityLocation.component';

export default function Aktivitet() {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      width={'100%'}
      minHeight={'1500px'}
    >
      <Image
        className={styles.image}
        src={'/images/goboat.png'}
        alt="activity"
        width={500}
        height={500}
      ></Image>
      <Typography className={styles.title} variant="h2">
        Copenhagen GoBoat
      </Typography>
      <Typography className={styles.description} variant="h5">
        GoBoat in Copenhagen offers a unique and eco-friendly way to explore the
        citys waterways. These small, electric-powered boats are designed for
        leisurely sightseeing, allowing visitors to experience Copenhagen from a
        different perspective. Each boat can accommodate up to eight people,
        making it a perfect activity for families, friends, or small groups
      </Typography>
      <ActivityInfo
        priceFrom={259}
        minPeople={4}
        category="Speed"
      ></ActivityInfo>
      <Card className={styles.mapContainer}>
        <Box
          className={styles.adressContainer}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          width={'50%'}
          height={'100%'}
        >
          <Box display={'flex'} height={'100%'} width={'80%'} columnGap={4}>
            <LocationOnIcon
              className={styles.icon}
              color={'primary'}
            ></LocationOnIcon>
            <Typography className={styles.address}>
              First Floor, Herluf Trolles Gade 9, 1052 København K
            </Typography>
          </Box>
        </Box>
        <ActivityLocation></ActivityLocation>
      </Card>
    </Box>
  );
}
