'use client'

import { Paper, styled } from "@mui/material";

export const StyledPaper = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    width: 450,
    borderRadius: 32,
    [theme.breakpoints.down(500)]: {
      height: 150,
      width: 300,
    },
  }));