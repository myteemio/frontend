'use client';

import { Box, styled } from '@mui/material';

export const StyledBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '24px',

    [theme.breakpoints.up(1024)]: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: '24px',
    },
}));
