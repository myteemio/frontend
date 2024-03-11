'use client';

import { Box, styled } from '@mui/material';

export const UploadBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('sm',)]: {
    flexDirection: 'row',
  },
}));
