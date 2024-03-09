import { Box, Skeleton } from '@mui/material';

export const ActivitySkeleton = () => (
  <Box width="100%">
    <Skeleton animation="pulse" variant="rounded" width="100%" height={200} />
    <Box>
      <Skeleton animation="pulse" width="100%" />
      <Skeleton animation="pulse" width="70%" />
      <Skeleton animation="pulse" width="100%" />
    </Box>
  </Box>
);
