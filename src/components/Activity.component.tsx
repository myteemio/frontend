import { useDraggable } from '@dnd-kit/core';
import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';

export const Activity = ({
  draggable,
  title,
  price,
  id,
  isDragged,
  placeholder,
}: {
  draggable: boolean;
  title: string;
  price: number;
  id: number;
  isDragged: boolean;
  placeholder: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const draggableStyle = {
    transform: isDragged && transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: 'pointer',
  };

  const cardStyle = {
    width: '30%',
    backgroundColor: '#d9d9d9',
    ...(draggable ? draggableStyle : {}),
  };

  if (placeholder) {
    return <Skeleton sx={{ ...cardStyle, height: '320px' }}></Skeleton>;
  } else {
    return (
      <Card sx={cardStyle} {...(draggable ? { ref: setNodeRef, ...listeners, ...attributes } : {})} aria-describedby="">
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
            {title}
          </Typography>
          <Typography>Fra {price} DKK pr. person</Typography>
        </CardContent>
      </Card>
    );
  }
};
