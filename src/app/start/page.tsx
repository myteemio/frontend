'use client';
import { FrontPageActivity } from '@/components/FrontPageActivity/FrontPageActivity';
import { ActivityGrid } from '@/components/StyledComponents/ActivityGrid';
import { IActivity, useActivities } from '@/lib/useActivity';
import { Box, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

export default function Start() {
  const { activities, isLoading } = useActivities();

  return (
    <Box width="100%" minHeight={'3000px'}>
      <Box
        display={'flex'}
        flexDirection={'column'}
        width={'100%'}
        alignItems={'center'}
        justifyContent={'center'}
        mt={2}
        mb={5}
      >
        <Typography
          fontSize={{ xs: '24px', sm: '48px', xl: '64px' }}
          variant="h3"
          color={'primary'}
          fontWeight={'bold'}
        >
          Vælg Aktiviteter
        </Typography>
        <Typography fontSize={{ xs: '12px', sm: '16px', xl: '24px' }}>
          Vælg de potentielle aktiviteter du ønsker at lave til dit event
        </Typography>
      </Box>
      <Box display={'flex'} justifyContent={'center'} flexGrow={1}>
        <ActivityGrid container width={'95%'} pl={4} pr={4} spacing={5}>
          {activities?.activities.map((activity: IActivity, i) => {
            return (
              <Grid2 key={i} sm={12} md={6} lg={4} xl={3}>
                <FrontPageActivity
                  name={activity.name}
                  city={activity.address.city}
                  price={activity.price}
                  persons={activity.persons}
                  activityUrl={activity.url}
                  imgUrl={'/images/goboat.png'} // TODO: Add image url when server is ready
                  isLoading={isLoading}
                />
              </Grid2>
            );
          })}
        </ActivityGrid>
      </Box>
    </Box>
  );
}
