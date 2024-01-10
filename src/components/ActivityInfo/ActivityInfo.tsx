import {
  Box,
  Paper,
  ThemeProvider,
  Typography,
  styled,
} from '@mui/material';
import styles from './ActivityInfo.module.css';
import { teemioTheme } from '@/styling/theme';

export default function ActivityInfo({
  priceFrom,
  minPeople,
  category,
}: {
  priceFrom: number;
  minPeople: number;
  category: string;
}) {
  const StyledPaper = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    width: 450,
    borderRadius: 32,
    [theme.breakpoints.down(500)]: {
      height: 150,
      width: 300,
    },
  }));

  const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '80%',
    justifyContent: 'center',
    marginTop: '64px',
    gap: '96px',
    marginBottom: '64px',
    [theme.breakpoints.down('lg')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  }));

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
