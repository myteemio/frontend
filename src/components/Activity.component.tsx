import { useDraggable } from '@dnd-kit/core';
import { Box, Card, CardContent, Typography } from '@mui/material';
import Image from 'next/image';

export const Activity = ({ draggable, id }: { draggable: boolean; id: number }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const draggableStyle = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: 'pointer',
  };

  const cardStyle = {
    width: '30%',
    backgroundColor: '#d9d9d9',
    ...(draggable ? draggableStyle : {}),
  };

  return (
    <Card sx={cardStyle} {...(draggable ? { ref: setNodeRef, ...listeners, ...attributes } : {})}>
      <CardContent>
        <Box position={'relative'} width={'100%'} height={80}>
          <Image
            src={'/images/activity.jpeg'}
            alt="Activity image"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </Box>
        <Typography variant="h6" marginTop={2}>
          GoKart Amager
        </Typography>
        <Typography>Fra 249 DKK pr. person</Typography>
      </CardContent>
    </Card>
  );
};
