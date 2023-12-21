'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import styles from './page.module.css';
import {
  DndContext,
  pointerWithin,
  DragEndEvent,
  useDroppable,
  useDraggable,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DragMoveEvent,
} from '@dnd-kit/core';

type AddedActivityT = {
  id: string;
  top: number;
  height: number;
};

type AdjustedActivitiesT = AddedActivityT & {
  overlap: boolean;
  overlapCount: number;
  isIncorrect: boolean;
  leftOffset: number;
};

export default function Test() {
  const [activeElement, setActiveElement] = useState<AddedActivityT>();
  const [activities, setActivities] = useState<string[]>(['1']);
  const [adjustedActivities, setAdjustedActivities] = useState<AdjustedActivitiesT[]>([]);
  const [addedActivities, setAddedActivities] = useState<AddedActivityT[]>([
    {
      id: '2',
      top: 0,
      height: 10,
    },
    {
      id: '3',
      top: 0,
      height: 10,
    },
  ]);

  useEffect(() => {
    function adjustActivityPositions(activities: AddedActivityT[]): AdjustedActivitiesT[] {
      let adjustedActivities = activities.map((activity) => ({
        ...activity,
        overlap: false,
        overlapCount: 0,
        isIncorrect: false,
        leftOffset: 0,
      }));

      // Calculate overlap and overlapCount for each activity
      for (let i = 0; i < adjustedActivities.length; i++) {
        for (let j = i + 1; j < adjustedActivities.length; j++) {
          if (activitiesOverlap(adjustedActivities[i], adjustedActivities[j])) {
            adjustedActivities[i].overlap = true;
            adjustedActivities[j].overlap = true;
            adjustedActivities[i].overlapCount += 1;
            adjustedActivities[j].overlapCount += 1;
          }
        }
      }

      // Identify activities that overlap more elements than the ones they are overlapped with
      adjustedActivities.forEach((activity) => {
        for (let otherActivity of adjustedActivities) {
          if (activity !== otherActivity && activitiesOverlap(activity, otherActivity)) {
            if (activity.overlapCount > otherActivity.overlapCount) {
              activity.isIncorrect = true;
              break; // Break as soon as one incorrect overlap is found
            }
          }
        }
      });

      // Calculate the leftOffset for each item
      adjustedActivities.forEach((activity, index) => {
        if (activity.overlap) {
          activity.leftOffset = calculateLeftOffset(adjustedActivities, index, activity.overlapCount);
        }
      });

      return adjustedActivities;
    }

    function activitiesOverlap(activity1: AddedActivityT, activity2: AddedActivityT): boolean {
      // TODO: Use the location of the activity to get the container height...
      const container = document.getElementById('activitytimeslotsdroppable');

      if (!container) {
        return false;
      }

      const containerHeight = container.clientHeight;

      // Convert top and height from pixels to percentage of container height
      const activity1TopPercent = (activity1.top / containerHeight) * 100;
      const activity1HeightPercent = (activity1.height / containerHeight) * 100;

      const activity2TopPercent = (activity2.top / containerHeight) * 100;
      const activity2HeightPercent = (activity2.height / containerHeight) * 100;

      // Check for overlap using percentages
      return (
        (activity1TopPercent < activity2TopPercent + activity2HeightPercent &&
          activity1TopPercent + activity1HeightPercent > activity2TopPercent) ||
        (activity2TopPercent < activity1TopPercent + activity1HeightPercent &&
          activity2TopPercent + activity2HeightPercent > activity1TopPercent)
      );
    }

    function calculateLeftOffset(activities: AddedActivityT[], index: number, overlapCount: number): number {
      let order = 0; // Determine the order of the current activity among overlapping activities
      for (let i = 0; i < index; i++) {
        if (activitiesOverlap(activities[i], activities[index])) {
          order++;
        }
      }

      // Calculate left offset as a percentage based on order and overlap count
      return (100 / (overlapCount + 1) + (order > 1 ? overlapCount * 1 - 1 : 1)) * order;
    }

    setAdjustedActivities(adjustActivityPositions(addedActivities));
  }, [addedActivities]);

  return (
    <div className={styles.container}>
      <DndContext
        collisionDetection={pointerWithin}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        id="dndcontext"
      >
        <div className={styles.leftside}>
          <ActivityTimeslotsDroppable
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              alignContent: 'flex-start',
              position: 'relative',
            }}
          >
            {adjustedActivities.map((item, i) => (
              <ActivityDropped
                key={i}
                id={item.id}
                style={{
                  position: 'absolute',
                  width: item.overlapCount > 0 ? `${100 / (item.overlapCount + 1) - item.overlapCount}%` : '100%',
                  height: `${item.height}%`,
                  top: item.top > 0 ? `${item.top}%` : `0%`,
                  left: `${item.leftOffset}%`,
                  border: item.isIncorrect ? '1px solid red' : 'none',
                }}
                isPlaceholder={activeElement?.id === item.id}
              />
            ))}
          </ActivityTimeslotsDroppable>
        </div>
        <div className={styles.rightside}>
          <ActivityDroppable>
            {activities.map((id, i) => (
              <Activity style={{}} key={i} id={id} isPlaceholder={activeElement?.id === id}></Activity>
            ))}
          </ActivityDroppable>
        </div>
        <DragOverlay style={{ height: '100%' }}>
          {activeElement ? (
            <Activity
              style={{ height: activeElement.height > 0 ? `${activeElement.height}%` : 'auto' }}
              id={`drag-${activeElement.id}`}
            />
          ) : undefined}
        </DragOverlay>
      </DndContext>
    </div>
  );

  function handleDragMove(event: DragMoveEvent) {}
  function handleDragOver(event: DragOverEvent) {
    const { over, active } = event;

    if (over && over.id) {
      // get the droppable its hovering above
      document.getElementById(over.id.toString())?.style.setProperty('border', '3px solid black');
    } else {
      document.getElementById('activitydroppable')?.style.setProperty('border', 'none');
      document.getElementById('activitytimeslotsdroppable')?.style.setProperty('border', 'none');
    }
  }

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current) {
      const loc = event.active.data.current.location;
      if (loc === 'activitytimeslotsdroppable') {
        // Item dropped already. Look at the addedactivities
        const foundItem = addedActivities.find((v) => v.id === event.active.id);
        if (foundItem) {
          setActiveElement(foundItem);
          return;
        }
      }

      if (loc === 'activitydroppable') {
        // Item still in activity list. Look at the activites list.
        const foundItem = activities.find((v) => v === event.active.id);

        if (foundItem) {
          setActiveElement({
            id: foundItem,
            height: 0,
            top: 0,
          });
          return;
        }
      }
    }

    console.log('No item found on drag start');
  }

  function handleDragEnd(event: DragEndEvent) {
    //console.log(event);

    // Default stuff
    document.getElementById('activitydroppable')?.style.setProperty('border', 'none');
    document.getElementById('activitytimeslotsdroppable')?.style.setProperty('border', 'none');
    setActiveElement(undefined);
    const { over, active } = event;

    if (!over) return;
    if (!active) return;

    const draggedDOMelement = document.getElementById(`drag-${event.active.id}`);
    const overElement = document.getElementById(over.id as string);
    let relativeTopPosition = -1;
    if (draggedDOMelement && overElement) {
      const draggedElementRect = draggedDOMelement.getBoundingClientRect();
      const overElementRect = overElement.getBoundingClientRect();

      // Calculate the difference in top positions
      const topDifference = draggedElementRect.top - overElementRect.top;

      // Get the height of the overElement
      const overElementHeight = overElementRect.height;

      // Convert the top difference to a percentage of the overElement's height
      relativeTopPosition = (topDifference / overElementHeight) * 100;
    }

    // check if its dropped over itself
    if (active.data.current && over.id === active.data.current.location) {
      if (over.id === 'activitytimeslotsdroppable') {
        // Update position and height
        setAddedActivities((items) => {
          const newItems = [...items];
          const foundIndex = newItems.findIndex((v) => v.id === active.id.toString());

          if (foundIndex >= 0) {
            newItems[foundIndex] = { ...newItems[foundIndex], top: relativeTopPosition };
          }

          newItems.sort((a, b) => {
            if (a.top === b.top) {
              return newItems.indexOf(a) - newItems.indexOf(b);
            }
            return a.top - b.top;
          });

          return newItems;
        });

        return;
      }

      console.log('Dropped on itself inside activity list');
      return;
    }

    if (over.id === 'activitytimeslotsdroppable') {
      console.log('Activity dropped in timeslot area!');
      // Activity dropped over activitytimeslotsdroppable

      // Add the activity to the addedActivities list

      setAddedActivities((items) => {
        const newItems = [
          ...items,
          {
            id: active.id.toString(),
            height: 10,
            top: relativeTopPosition,
          },
        ];

        newItems.sort((a, b) => {
          if (a.top === b.top) {
            return newItems.indexOf(a) - newItems.indexOf(b);
          }
          return a.top - b.top;
        });

        return newItems;
      });

      // Remove the activity from the activites list

      setActivities((items) => {
        const foundItem = items.findIndex((v) => v === active.id);
        if (foundItem >= 0) {
          // Item was found

          return items.toSpliced(foundItem, 1);
        }
        return items;
      });

      return;
    }

    if (over.id === 'activitydroppable') {
      console.log('Activity was dropped to activity list');

      // Add the activity to the activites list
      setActivities([...activities, active.id.toString()]);

      // remove from added activities
      setAddedActivities((items) => {
        const foundItem = items.findIndex((v, i) => v.id === active.id);
        if (foundItem >= 0) {
          return items.toSpliced(foundItem, 1);
        }
        return items;
      });
      return;
    }

    // Its not dropped over itself
    console.log('its dragged over somewhere else!');
  }
}

function ActivityTimeslotsDroppable({ children, style }: { children: ReactNode; style: React.CSSProperties }) {
  const { setNodeRef, node } = useDroppable({
    id: 'activitytimeslotsdroppable',
  });

  return (
    <div style={style} className={styles.droppableAreas} ref={setNodeRef} id={'activitytimeslotsdroppable'}>
      {children}
    </div>
  );
}

function ActivityDroppable({ children }: { children: ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: 'activitydroppable',
  });

  return (
    <div className={styles.droppableAreas} ref={setNodeRef} id="activitydroppable">
      {children}
    </div>
  );
}

function Activity({
  id,
  style,
  isPlaceholder = false,
}: {
  id: string;
  style: React.CSSProperties;
  isPlaceholder?: boolean;
}) {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: id,
    data: {
      location: 'activitydroppable',
    },
  });

  const internalstyle: any = {
    background: isPlaceholder ? 'lightgray' : 'white',
    boxSizing: isPlaceholder ? 'border-box' : '',
    ...style,
  };

  return (
    <div ref={setNodeRef} style={internalstyle} {...listeners} {...attributes} id={id}>
      <p style={{ margin: 0, padding: 0, visibility: isPlaceholder ? 'hidden' : 'visible' }}>Activity to drop {id}</p>
    </div>
  );
}

function ActivityDropped({
  id,
  isPlaceholder = false,
  style,
}: {
  id: string;
  isPlaceholder?: boolean;
  style: React.CSSProperties;
}) {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: id,
    data: {
      location: 'activitytimeslotsdroppable',
    },
  });

  const internalstyle: any = {
    background: isPlaceholder ? 'lightgray' : 'white',
    boxSizing: isPlaceholder ? 'border-box' : '',
    ...style,
  };

  return (
    <div ref={setNodeRef} style={internalstyle} {...listeners} {...attributes}>
      <p style={{ margin: 0, padding: 0, visibility: isPlaceholder ? 'hidden' : 'visible' }}>Activity dropped {id}</p>
    </div>
  );
}
