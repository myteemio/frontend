'use client'

import { Skeleton, styled } from '@mui/material';

export const StyledSkeleton = styled(Skeleton)(({ theme }) => ({
  width: '35%',
  height: '400px',
  marginTop: '32px',
  [theme.breakpoints.down(1300)]: {
    height: '300px',
  },
  [theme.breakpoints.down(1000)]: {
    height: '200px',
  },
  [theme.breakpoints.down(700)]: {
    height: '100px',
    width: '60%',
  },
}));
