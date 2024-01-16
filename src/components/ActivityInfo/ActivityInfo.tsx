import { ThemeProvider, Typography } from '@mui/material';
import styles from './ActivityInfo.module.css';
import { teemioTheme } from '@/styling/theme';
import { StyledBox } from '../StyledComponents/ActivityStyledBox';
import { StyledPaper } from '../StyledComponents/ActivityStyledPaper';

export default function ActivityInfo({
  priceFrom,
  minPeople,
  category,
}: {
  priceFrom: number;
  minPeople: number;
  category: string;
}) {
  return (
    <ThemeProvider theme={teemioTheme}>
      <StyledBox>
        <StyledPaper elevation={8}>
          <Typography className={styles.header}>Pris</Typography>
          <Typography
            variant="h2"
            fontWeight={'bold'}
          >{`FRA ${priceFrom}`}</Typography>
        </StyledPaper>
        <StyledPaper elevation={8}>
          <Typography className={styles.header}>Antal Pers.</Typography>
          <Typography
            variant="h2"
            fontWeight={'bold'}
          >{`${minPeople}+`}</Typography>
        </StyledPaper>
        <StyledPaper elevation={8}>
          <Typography className={styles.header}>Kategori</Typography>
          <Typography variant="h2" fontWeight={'bold'}>
            {category}
          </Typography>
        </StyledPaper>
      </StyledBox>
    </ThemeProvider>
  );
}
