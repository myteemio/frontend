'use client';

import Image from 'next/image';
import styles from './FrontPageActivity.module.css';
import { Box, Button, Checkbox, Skeleton, Typography, useTheme } from '@mui/material';
import { Groups } from '@mui/icons-material';
import { useState } from 'react';
import Link from 'next/link';

export function FrontPageActivity(props: {
  name: string;
  city: string;
  price: number;
  persons: number;
  activityUrl: string;
  imgUrl: string;
  isLoading: boolean;
}) {
  const theme = useTheme();
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };

  return (
    <Box display={'flex'} flexDirection={'column'}>
      {!props.isLoading ? (
        <Box className={styles.imageContainer} width={'100%'}>
          <Link href={`/aktivitet/${props.activityUrl}`}>
            <Image
              className={styles.image}
              width={380}
              height={450}
              objectFit="cover"
              alt="goboat"
              src={props.imgUrl}
            />
          </Link>
          <Checkbox
            checked={checked}
            onChange={handleChange}
            className={styles.checkBox}
            sx={{ color: theme.palette.primary.main }}
          />
        </Box>
      ) : (
        <Skeleton height={'50%'} width={'100%'} animation="pulse" variant="rounded" />
      )}

      {!props.isLoading ? (
        <>
          <Box className={styles.flexContainer}>
            <Typography
              variant="h5"
              fontWeight={'bold'}
              fontSize={{ xl: '16px', sm: '24px', lg: '18px' }}
            >
              {props.name}
            </Typography>
            <Box display={'flex'} alignItems={'center'} columnGap={2}>
              <Groups />
              <Typography>{`${props.persons}+`}</Typography>
            </Box>
          </Box>
          <Typography color={theme.palette.grey[500]}>{props.city}</Typography>
          <Box className={styles.flexContainer} mb={1}>
            <Typography variant="h6" color={'primary'} fontWeight={'bold'}>
              {`${props.price} DKK pr. person`}
            </Typography>
            <Box display={'flex'} alignItems={'center'} columnGap={2}>
              <Typography color={'primary'} fontWeight={'bold'}>
                Spar 16%
              </Typography>
            </Box>
          </Box>
          <Button onClick={handleChange} variant="contained">
            Vælg Aktivitet
          </Button>
        </>
      ) : (
        <Box sx={{ pt: 0.5 }}>
          <Skeleton />
          <Skeleton width="60%" />
          <Skeleton />
          <Skeleton />
        </Box>
      )}
    </Box>
  );
}
