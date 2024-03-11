'use client'

import { styled } from '@mui/material';
import { PickersDay } from '@mui/x-date-pickers';

export const HighlightedDay = styled(PickersDay)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: 'white',
    color: theme.palette.primary.main,
    border: `solid 1px ${theme.palette.primary.main}`,
  },
  '&.Mui-selected:hover': {
    backgroundColor: 'white',
    color: theme.palette.primary.main,
  },
  '&.Mui-selected:focus': {
    backgroundColor: 'white',
  },
  '&.MuiPickersDay-root:focus': {
    backgroundColor: 'white',
  },
}));
