'use client'

import { styled } from '@mui/material';
import { ClearIcon } from '@mui/x-date-pickers';

export const StyledClearIcon = styled(ClearIcon)(({ theme }) => ({
  fontSize: '8px',

  [theme.breakpoints.up('md')]: {
    fontSize: '10px',
  },

  [theme.breakpoints.up('lg')]: {
    fontSize: '12px',
  },

  [theme.breakpoints.up('xl')]: {
    fontSize: '18px',
  },
}));
