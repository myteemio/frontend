'use client';

import { Box, styled } from '@mui/material';

export const StyledBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  //   [theme.breakpoints.down('lg')]: {
  //     flexDirection: 'column',
  //     alignItems: 'center',
  //   },
}));
