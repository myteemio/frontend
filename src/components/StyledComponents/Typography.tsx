import { Typography, styled } from '@mui/material';

export const StyledText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',

  [theme.breakpoints.up('xs')]: {
    fontSize: '18px',
  },
  [theme.breakpoints.up('sm')]: {
    fontSize: '14px',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '18px',
  },
}));

export const StyledHeader = styled(Typography)(({ theme }) => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontWeight: 'bold',

  [theme.breakpoints.up('xs')]: {
    fontSize: '32px',
  },
  [theme.breakpoints.up('sm')]: {
    fontSize: '48px',
  },
  [theme.breakpoints.up('xl')]: {
    fontSize: '64px',
  },
}));
