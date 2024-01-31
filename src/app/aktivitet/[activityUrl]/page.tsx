'use client';

import { Box, Card, Skeleton, Typography } from '@mui/material';
import styles from './page.module.css';
import Image from 'next/image';
import ActivityInfo from '@/components/ActivityInfo/ActivityInfo';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ActivityLocation } from '@/components/ActivityLocation.component';
import { useActivity } from '@/lib/useActivity';
import { StyledSkeleton } from '@/components/StyledComponents/Skeleton';

type Props = {
  params: { activityUrl: string };
};

export default function Aktivitet({ params }: Props) {
  const { activity, isLoading } = useActivity(params.activityUrl);

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      width={'100%'}
      minHeight={'1500px'}
    >
      {!isLoading ? (
        <Image
          className={styles.image}
          src={'/images/goboat.png'}
          alt="activity"
          width={500}
          height={500}
        />
      ) : (
        <StyledSkeleton animation="pulse" variant="rounded" />
      )}

      <Typography className={styles.title} variant="h2">
        {!isLoading ? activity?.name : <Skeleton animation="wave" />}
      </Typography>
      <Typography className={styles.description} variant="h5">
        {!isLoading ? (
          activity?.description
        ) : (
          <>
            <Skeleton animation="wave" />
            <Skeleton width={'90%'} animation="wave" />
          </>
        )}
      </Typography>
      {!isLoading ? (
        <ActivityInfo
          priceFrom={activity?.price}
          minPeople={activity?.persons}
          category={activity?.category[0]} // TODO: Change this
        />
      ) : (
        <Skeleton animation="pulse" width={'50%'}>
          <ActivityInfo
            priceFrom={activity?.price}
            minPeople={activity?.persons}
            category={activity?.category[0]}
          />
        </Skeleton>
      )}
      {!isLoading ? (
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
              <LocationOnIcon className={styles.icon} color={'primary'} />
              <Typography className={styles.address}>
                {`${activity?.address.address1}, ${activity?.address.zipcode} ${activity?.address.city}`}
              </Typography>
            </Box>
          </Box>
          <ActivityLocation
            lat={activity?.location.lat}
            lng={activity?.location.long}
          />
        </Card>
      ) : (
        <Skeleton animation="wave" width={'80%'} height={400} />
      )}
    </Box>
  );
}
