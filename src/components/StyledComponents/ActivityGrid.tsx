'use client'

import { styled } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

export const ActivityGrid = styled(Grid2)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    rowGap: '32px',
    paddingLeft: '24px',
    paddingRight: '18px',
  },
  [theme.breakpoints.down(1400)]: {
    rowGap: '24px',
    paddingLeft: '40px',
    paddingRight: '32px',
  },
}));
