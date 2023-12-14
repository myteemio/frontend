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
  dropped,
  top,
}: {
  draggable: boolean;
  title: string;
  price: number;
  id: number;
  isDragged: boolean;
  placeholder: boolean;
  dropped: boolean;
  top: string;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const draggableStyle = {
    transform: isDragged && transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: 'pointer',
  };

  const cardStyle = {
    marginTop: top,
    width: dropped ? '100%' : '30%',
    backgroundColor: '#d9d9d9',
    ...(draggable ? draggableStyle : {}),
    transition: !isDragged ? 'all 0.5s ease' : '',
  };

  if (placeholder) {
    return (
      <Skeleton
        variant="rectangular"
        sx={{ ...cardStyle, height: '192px' }}
        data-activityid={id}
        data-placeholder={placeholder}
      ></Skeleton>
    );
  } else {
    return (
      <Card
        sx={cardStyle}
        {...(draggable ? { ref: setNodeRef, ...listeners, ...attributes } : {})}
        aria-describedby=""
        data-activityid={id}
      >
        <CardContent>
          {!dropped && (
            <Box position={'relative'} width={'100%'} height={80} data-activityimagecontainer>
              <Image
                src={'/images/activity.jpeg'}
                alt="Activity image"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </Box>
          )}
          <Typography variant="h6" marginTop={2}>
            {title}
          </Typography>
          <Typography>Fra {price} DKK pr. person</Typography>
        </CardContent>
      </Card>
    );
  }
};
