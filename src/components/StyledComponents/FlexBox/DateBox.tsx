'use client';

import { Box, styled } from '@mui/material';

export const DateBox = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '450px',

  [theme.breakpoints.up('xs')]: {
    minHeight: 0,
  },
}));
