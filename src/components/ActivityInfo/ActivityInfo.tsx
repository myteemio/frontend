import { Skeleton, ThemeProvider, Typography } from '@mui/material';
import styles from './ActivityInfo.module.css';
import { teemioTheme } from '@/styling/theme';
import { StyledBox } from '../StyledComponents/FlexBox/ActivityBox';
import { StyledPaper } from '../StyledComponents/ActivityPaper';

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
        <StyledBox>
          <StyledPaper elevation={8}>
            <Typography className={styles.header}>Pris</Typography>
            <Typography variant="h2" fontWeight={'bold'}>{`FRA ${priceFrom}`}</Typography>
          </StyledPaper>
          <StyledPaper elevation={8}>
            <Typography className={styles.header}>Antal Pers.</Typography>
            <Typography variant="h2" fontWeight={'bold'}>{`${minPeople}+`}</Typography>
          </StyledPaper>
          <StyledPaper elevation={8}>
            <Typography className={styles.header}>Kategori</Typography>
            <Typography variant="h2" fontWeight={'bold'}>
              {category}
            </Typography>
          </StyledPaper>
        </StyledBox>
      ) : (
        <Skeleton width={'80%'} height={300}>
          <StyledPaper />
        </Skeleton>
      )}
    </ThemeProvider>
  );
}
