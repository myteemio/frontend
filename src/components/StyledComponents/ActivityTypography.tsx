import { Typography, styled } from '@mui/material';

export const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
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
