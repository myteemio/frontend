'use client'

import { IconButton, styled } from '@mui/material';

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '2px',
  right: '4px',
  padding: '0px',
  width: '8px',
  height: '8px',
  color: theme.palette.primary.main,

  [theme.breakpoints.up('md')]: {
    top: '2px',
    right: '2px',
  },

  [theme.breakpoints.up('lg')]: {
    top: '4px',
    right: '4px',
  },

  [theme.breakpoints.up('xl')]: {
    width: '16px',
    height: '16px',
    top: '2px',
    right: '4px',
  },
}));
