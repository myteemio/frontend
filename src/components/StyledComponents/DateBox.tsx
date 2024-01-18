import { Box, styled } from '@mui/material';

export const DateStyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '300px',
  height: '300px',

  [theme.breakpoints.up('md')]: {
    width: '400px',
  },

  [theme.breakpoints.up('lg')]: {
    width: '500px',
    height: '400px',
  },

  [theme.breakpoints.up('xl')]: {
    width: '700px',
    height: '500px',
  },
}));
