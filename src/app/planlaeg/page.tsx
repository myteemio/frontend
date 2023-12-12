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

export default function Planlaeg() {
  const allActivites = [
    {
      name: 'Gokart Amager',
      price: 249,
      id: 1,
    },
    {
      name: 'Cooking Class KBH',
      price: 299,
      id: 2,
    },
    {
      name: 'Escape Room',
      price: 399,
      id: 3,
    },
    {
      name: 'Vinsmagning',
      price: 599,
      id: 4,
    },
  ];
  const [activities, setActivities] = useState<{ name: string; price: number; id: number }[]>(allActivites);
  const [addedActivities, setAddedActivities] = useState<{ name: string; price: number; id: number }[]>([]);
  const [activeId, setActiveId] = useState(-1);
  const [modifiers, setModifiers] = useState<any[]>([]);

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(-1);
    const { over, active } = event;

    if (over && over.id === 'droppable') {
      // Dropped into droppable
      if (active && active.id) {
        const findActive = activities.findIndex((v) => v.id === active.id);
        if (findActive !== -1) {
          setActivities(activities.toSpliced(findActive, 1));
          setAddedActivities([...addedActivities, activities[findActive]]);
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

  const gridSize = 25; // pixels
  function snapToGrid(args: any) {
    const foundContainer = document.getElementById('droppablecontainer');

    if (!foundContainer) return;

    const containerWidth = foundContainer.clientWidth;
    const containerHeight = foundContainer.clientHeight;
    const containerX = foundContainer.clientLeft;
    const containerY = foundContainer.clientTop;

    const { transform } = args;

    return {
      ...transform,
      x: Math.ceil(transform.x / gridSize) * gridSize - 2.5,
      y: Math.ceil(transform.y / gridSize) * gridSize - 5,
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
                  <Box width={'1000px'}>
                    <Activity
                      draggable={false}
                      isDragged={false}
                      id={activity.id}
                      title={activity.name}
                      price={activity.price}
                      placeholder={false}
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
              <Box width={400} height={800} sx={{ background: 'purple' }} id="droppablecontainer">
                <Droppable>
                  {addedActivities.length > 0
                    ? addedActivities.map((v, i) => {
                        return (
                          <Activity
                            draggable={true}
                            isDragged={true}
                            key={i}
                            id={v.id + 5000}
                            title={v.name}
                            price={v.price}
                            placeholder={false}
                          />
                        );
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
