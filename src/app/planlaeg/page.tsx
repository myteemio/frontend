import { ActivityPicker } from '@/components/activityPicker.component';
import { DayScheduler } from '@/components/dayScheduler.component';
import { Box, Grid, Typography } from '@mui/material';

export default function Planlaeg() {
  return (
    <Box width={'80%'} marginLeft={'auto'} marginRight={'auto'} paddingBottom={4}>
      <Box marginTop={6} marginBottom={6}>
        <Typography variant="h4" fontWeight={'bold'}>
          PLANLÆG DIT EVENT
        </Typography>
        <Typography variant="h6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempor justo non arcu aliquet posuere. Sed non
          justo massa. Interdum et malesuada fames ac ante ipsum primis in faucibus.
        </Typography>
      </Box>
      <Grid container>
        <Grid item md={5}>
          <DayScheduler />
        </Grid>
        <Grid item md={7}>
          <Typography variant="h5" textAlign={'center'}>
            AKTIVITETER
          </Typography>
          <Typography variant="body1" textAlign={'center'} marginTop={1} marginBottom={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempor justo non arcu aliquet posuere.
          </Typography>
          <ActivityPicker />
        </Grid>
      </Grid>
    </Box>
  );
}
