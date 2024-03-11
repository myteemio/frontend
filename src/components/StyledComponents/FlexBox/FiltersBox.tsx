'use client'

import { Box, styled } from '@mui/material';

export const FiltersBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '50%',
  justifyContent: 'center',
  marginTop: '16px',
  columnGap: '16px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: '16px',
    width: '100%'
  },
}));
