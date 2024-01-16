import { Box, styled } from "@mui/material";

export const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '80%',
  justifyContent: 'center',
  marginTop: '64px',
  gap: '96px',
  marginBottom: '64px',
  [theme.breakpoints.down('lg')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));