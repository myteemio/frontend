'use client';
import { Activity } from '@/components/Activity.component';
import { Draggable } from '@/components/Draggable.component';
import { Droppable } from '@/components/Droppable.component';
import { DndContext, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { createSnapModifier } from '@dnd-kit/modifiers';
import { Box, Grid, Typography } from '@mui/material';
import { useState } from 'react';

export default function Planlaeg() {
  const activities = Array.from(Array(9).keys());

  const [addedActivities, setAddedActivities] = useState<number[]>([]);
  const [isDropped, setIsDropped] = useState(false);

  const gridSize = 20; // pixels
  const snapToGridModifier = createSnapModifier(gridSize);

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;

    console.log(event);

    if (over) {
      if (over.id === 'droppable') {
        setIsDropped(true);
        if (active.id) {
          console.log(active.id);
          setAddedActivities([...addedActivities, (active.id as number) + 10]);
          console.log(addedActivities);
        }
      }
    } else {
      const findItem = addedActivities.findIndex((e) => e === (active.id as number) + 10);
      if (findItem >= 0) {
        const newArray = addedActivities.splice(findItem, 1);
        console.log('FoundItem:' + findItem);
        console.log('NewArray' + newArray);
        setAddedActivities(newArray);
      }
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[snapToGridModifier]}>
      <Box width={'80%'} marginLeft={'auto'} marginRight={'auto'} paddingBottom={4}>
        <Box marginTop={6} marginBottom={6}>
          <Typography variant="h4" fontWeight={'bold'}>
            PLANLÆG DIT EVENT
          </Typography>
          <Typography variant="h6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempor justo non arcu aliquet posuere. Sed non
            justo massa. Interdum et malesuada fames ac ante ipsum primis in faucibus.
          </Typography>
        </Box>
        <Grid container>
          <Grid item md={5}>
            <Box
              width={'100%'}
              height={'100%'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              sx={{ backgroundColor: 'green' }}
            >
              <Box width={'80%'} height={'80%'} sx={{ background: 'purple' }}>
                <Droppable>
                  {isDropped
                    ? addedActivities.map((v, i) => {
                        return <Activity draggable={true} key={i} id={i} />;
                      })
                    : 'Drop here'}
                </Droppable>
              </Box>
            </Box>
          </Grid>
          <Grid item md={7}>
            <Typography variant="h5" textAlign={'center'}>
              AKTIVITETER
            </Typography>
            <Typography variant="body1" textAlign={'center'} marginTop={1} marginBottom={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempor justo non arcu aliquet posuere.
            </Typography>
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              marginTop={4}
              flexWrap={'wrap'}
              gap={2}
            >
              {activities.map((v, i) => {
                return <Activity draggable key={i} id={v + 1} />;
              })}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </DndContext>
  );
}
