import { Skeleton, ThemeProvider, Typography } from '@mui/material';
import styles from './ActivityInfo.module.css';
import { teemioTheme } from '@/styling/theme';
import { ActivityBox } from '../StyledComponents/FlexBox/ActivityBox';
import { ActivityPaper } from '../StyledComponents/ActivityPaper';

export default function ActivityInfo({
  priceFrom,
  minPeople,
  category,
  isLoading,
}: {
  priceFrom: number;
  minPeople: number;
  category: string;
  isLoading: boolean;
}) {
  return (
    <ThemeProvider theme={teemioTheme}>
      {!isLoading ? (
        <ActivityBox>
          <ActivityPaper elevation={8}>
            <Typography className={styles.header}>Pris</Typography>
            <Typography variant="h2" fontWeight={'bold'}>{`FRA ${priceFrom}`}</Typography>
          </ActivityPaper>
          <ActivityPaper elevation={8}>
            <Typography className={styles.header}>Antal Pers.</Typography>
            <Typography variant="h2" fontWeight={'bold'}>{`${minPeople}+`}</Typography>
          </ActivityPaper>
          <ActivityPaper elevation={8}>
            <Typography className={styles.header}>Kategori</Typography>
            <Typography variant="h2" fontWeight={'bold'}>
              {category}
            </Typography>
          </ActivityPaper>
        </ActivityBox>
      ) : (
        <Skeleton width={'80%'} height={300}>
          <ActivityPaper />
        </Skeleton>
      )}
    </ThemeProvider>
  );
}
