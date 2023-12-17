'use client';
import { Activity } from '@/components/Activity.component';
import { Droppable } from '@/components/Droppable.component';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
  pointerWithin,
} from '@dnd-kit/core';
import { createSnapModifier, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Box, Grid, Typography } from '@mui/material';
import { TransitionEvent, useState } from 'react';
import styles from './page.module.css';

export default function Planlaeg() {
  const allActivites = [
    {
      name: 'Gokart Amager',
      price: 249,
      id: 1,
      top: '0px',
    },
    {
      name: 'Cooking Class KBH',
      price: 299,
      id: 2,
      top: '0px',
    },
    {
      name: 'Escape Room',
      price: 399,
      id: 3,
      top: '0px',
    },
    {
      name: 'Vinsmagning',
      price: 599,
      id: 4,
      top: '0px',
    },
  ];

  const timeSlots = [
    { from: '06:00', to: '06:30' },
    { from: '06:30', to: '07:00' },
    { from: '07:00', to: '07:30' },
    { from: '07:30', to: '08:00' },
    { from: '08:00', to: '08:30' },
    { from: '08:30', to: '09:00' },
    { from: '09:00', to: '09:30' },
    { from: '09:30', to: '10:00' },
    { from: '10:00', to: '10:30' },
    { from: '10:30', to: '11:00' },
    { from: '11:00', to: '11:30' },
    { from: '11:30', to: '12:00' },
    { from: '12:00', to: '12:30' },
    { from: '12:30', to: '13:00' },
    { from: '13:00', to: '13:30' },
    { from: '13:30', to: '14:00' },
    { from: '14:00', to: '14:30' },
    { from: '14:30', to: '15:00' },
    { from: '15:00', to: '15:30' },
    { from: '15:30', to: '16:00' },
    { from: '16:00', to: '16:30' },
    { from: '16:30', to: '17:00' },
    { from: '17:00', to: '17:30' },
    { from: '17:30', to: '18:00' },
    { from: '18:00', to: '18:30' },
    { from: '18:30', to: '19:00' },
    { from: '19:00', to: '19:30' },
    { from: '19:30', to: '20:00' },
    { from: '20:00', to: '20:30' },
    { from: '20:30', to: '21:00' },
    { from: '21:00', to: '21:30' },
    { from: '21:30', to: '22:00' },
    { from: '22:00', to: '22:30' },
    { from: '22:30', to: '23:00' },
    { from: '23:00', to: '23:30' },
    { from: '23:30', to: '24:00' },
  ];

  const [activities, setActivities] =
    useState<{ name: string; price: number; id: number; top: string }[]>(allActivites);
  const [addedActivities, setAddedActivities] = useState<{ name: string; price: number; id: number; top: string }[]>(
    []
  );
  const [activeId, setActiveId] = useState(-1);
  const [modifiers, setModifiers] = useState<any[]>([]);

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(-1);
    setModifiers([]);
    const { over, active } = event;

    if (over && over.id === 'droppable') {
      // Dropped into droppable
      if (active && active.id) {
        const findActive = activities.findIndex((v) => v.id === active.id);
        if (findActive !== -1) {
          console.log(event);
          const toAdd = { ...activities[findActive], top: `${event.delta.y}px` };
          setActivities(activities.toSpliced(findActive, 1));
          setAddedActivities([...addedActivities, toAdd]);
        }
      }
    } else {
      // There is no over
      if (active && active.id) {
        const foundActivity = addedActivities.findIndex((v) => v.id + 5000 === (active.id as number));

        if (foundActivity !== -1) {
          const foundActivityToReAdd = allActivites.find((v) => v.id + 5000 === (active.id as number));
          if (foundActivityToReAdd) {
            setActivities([...activities, foundActivityToReAdd]);
          }

          setAddedActivities(addedActivities.toSpliced(foundActivity, 1));
        }
      }
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as number);
  }
  function handleDragOver(event: DragOverEvent) {
    if (event.over) {
      setModifiers([snapToGrid]);
      const element = document.querySelectorAll("[data-activityid='" + event.active.id + "']");
      if (element.length > 0) {
        const firstElement = element[0];
        const droppableArea = document.getElementById('droppablecontainer');
        if (droppableArea) {
          firstElement.setAttribute('style', `width: ${droppableArea.clientWidth}px`);
          if (firstElement.children.length > 0) {
            const image = firstElement.querySelector('[data-activityimagecontainer]');

            if (image) {
              image.setAttribute('style', 'visibility: hidden; height: 0px;');
            }
          }
        }
      }
    } else {
      setModifiers([]);
      const element = document.querySelectorAll("[data-activityid='" + event.active.id + "']");
      if (element.length > 0) {
        const firstElement = element[0];
        const placeholderWhileDropped = document.querySelectorAll(
          "[data-activityid='" + event.active.id + "'][data-placeholder='true']"
        );

        if (placeholderWhileDropped.length > 0) {
          const image = firstElement.querySelector('[data-activityimagecontainer]');

          if (image) {
            image.setAttribute('style', 'visibility: visible; height: 80px;');
          }
          firstElement.setAttribute('style', `width: ${placeholderWhileDropped[0].clientWidth}px`);
        }
      }
    }
  }

  const gridSize = 30; // pixels
  function snapToGrid(args: any) {
    const { over, transform } = args;

    console.log(args);

    return {
      ...transform,
      x: Math.ceil(transform.x / gridSize) * gridSize,
      y: Math.ceil(transform.y / gridSize) * gridSize,
    };
  }

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      modifiers={[]}
    >
      <DragOverlay modifiers={modifiers}>
        {activeId !== -1
          ? (() => {
              const activity = allActivites.find((v) => v.id === activeId);
              if (activity) {
                return (
                  <Box width={'700px'}>
                    <Activity
                      draggable={false}
                      isDragged={false}
                      id={activity.id}
                      title={activity.name}
                      price={activity.price}
                      placeholder={false}
                      dropped={false}
                    />
                  </Box>
                );
              }
            })()
          : null}
      </DragOverlay>
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
              <Box width={400} sx={{ background: 'purple' }} id="droppablecontainer">
                <Droppable>
                  <Box className={styles.droppablecontainer}>
                    {timeSlots.map((v, i) => (
                      <Box className={styles.item} key={i}>
                        {v.from} - {v.to}
                      </Box>
                    ))}
                  </Box>
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
              {activities
                .sort((a, b) => a.id - b.id)
                .map((v, i) => {
                  return (
                    <Activity
                      draggable={true}
                      isDragged={false}
                      key={i}
                      id={v.id}
                      title={v.name}
                      price={v.price}
                      placeholder={activeId === v.id ? true : false}
                      dropped={false}
                    />
                  );
                })}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </DndContext>
  );
}
