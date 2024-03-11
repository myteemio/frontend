'use client';

import { Card, styled } from '@mui/material';

export const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  minHeight: '450px',

  [theme.breakpoints.up('xs')]: {
    minHeight: 0,
  },
}));
