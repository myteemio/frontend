'use client';

import Image from 'next/image';
import styles from './FrontPageActivity.module.css';
import { Box, Button, Checkbox, Skeleton, useTheme } from '@mui/material';
import { Groups } from '@mui/icons-material';
import { useState } from 'react';
import Link from 'next/link';
import { StyledTypography } from '../StyledComponents/ActivityTypography';

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
            <Box width={'80%'}>
              <Link
                href={`/aktivitet/${props.activityUrl}`}
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <StyledTypography variant="h5">{props.name}</StyledTypography>
              </Link>
            </Box>
            <Box
              width={'20%'}
              display={'flex'}
              justifyContent={'flex-end'}
              alignItems={'center'}
              columnGap={{ xs: 1, md: 2 }}
            >
              <Groups sx={{ fontSize: { sm: '16px', md: '24px' } }} />
              <StyledTypography
                sx={{ fontWeight: 'regular', whiteSpace: 'normal', overflow: 'visible' }}
              >{`${props.persons}+`}</StyledTypography>
            </Box>
          </Box>
          <StyledTypography sx={{ fontWeight: 'regular' }} color={theme.palette.grey[500]}>
            {props.city}
          </StyledTypography>
          <Box className={styles.flexContainer} mb={1}>
            <StyledTypography variant="h6" color={'primary'} fontWeight={'bold'}>
              {`${props.price} DKK pr. person`}
            </StyledTypography>
            <Box display={'flex'} alignItems={'center'} columnGap={2}>
              <StyledTypography color={'primary'} fontWeight={'bold'}>
                Spar 16%
              </StyledTypography>
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
