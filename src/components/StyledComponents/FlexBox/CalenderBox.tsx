'use client';

import { Box, styled } from '@mui/material';

export const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
  },
}));
