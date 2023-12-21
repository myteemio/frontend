'use client';
import React, { ReactNode, useState } from 'react';
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
import { CSS } from '@dnd-kit/utilities';
import { Skeleton } from '@mui/material';

type AddedActivity = {
  id: string;
  top: number;
  height: number;
};

export default function Test() {
  const [activeId, setActiveId] = useState<string>('');
  const [activities, setActivities] = useState<string[]>(['1']);
  const [addedActivities, setAddedActivities] = useState<AddedActivity[]>([
    {
      id: '2',
      top: 0,
      height: 24,
    },
    {
      id: '3',
      top: 0,
      height: 24,
    },
  ]);

  function adjustActivityPositions(activities: AddedActivity[]) {
    let adjustedActivities = activities.map((activity) => ({ ...activity, overlap: false, overlapCount: 0 }));

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
    return adjustedActivities;
  }

  function activitiesOverlap(activity1: AddedActivity, activity2: AddedActivity) {
    return (
      (activity1.top < activity2.top + activity2.height && activity1.top + activity1.height > activity2.top) ||
      (activity2.top < activity1.top + activity1.height && activity2.top + activity2.height > activity1.top)
    );
  }

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
            }}
          >
            {adjustActivityPositions(addedActivities).map((item, i) => (
              <ActivityDropped
                key={i}
                id={item.id}
                style={{
                  width: item.overlapCount > 0 ? `${100 / (item.overlapCount + 1) - item.overlapCount}%` : '100%',
                  height: item.height,
                  marginTop: item.top > item.height ? `${item.top - item.height}px` : 0,
                  marginLeft: item.overlap ? '0px' : '0', // Adjust as necessary
                }}
                isPlaceholder={activeId === item.id}
              />
            ))}
          </ActivityTimeslotsDroppable>
        </div>
        <div className={styles.rightside}>
          <ActivityDroppable>
            {activities.map((id, i) => (
              <Activity key={i} id={id} isPlaceholder={activeId === id}></Activity>
            ))}
          </ActivityDroppable>
          <DragOverlay>{activeId != '' ? <Activity id={`drag-${activeId}`} /> : undefined}</DragOverlay>
        </div>
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
    setActiveId(event.active.id.toString());
  }

  function handleDragEnd(event: DragEndEvent) {
    console.log(event);

    // Default stuff
    document.getElementById('activitydroppable')?.style.setProperty('border', 'none');
    document.getElementById('activitytimeslotsdroppable')?.style.setProperty('border', 'none');
    setActiveId('');
    const { over, active } = event;

    if (!over) return;
    if (!active) return;

    const draggedDOMelement = document.getElementById(`drag-${event.active.id}`);
    const overElement = document.getElementById(over.id as string);
    let relativeTopPosition = -1;
    if (draggedDOMelement && overElement) {
      const draggedElementPosition = draggedDOMelement.getBoundingClientRect();
      const overElementRect = overElement.getBoundingClientRect();

      // Calculate relative top position
      relativeTopPosition = draggedElementPosition.top - overElementRect.top;
      // Use this position to find out WHERE inside the over element it was placed.
      // Then set the top margin accordingly.
    }

    // check if its dropped over itself
    if (active.data.current && over.id === active.data.current.location) {
      console.log('dropped on itself');
      return;
    }

    if (over.id === 'activitytimeslotsdroppable') {
      console.log('Activity dropped in timeslot area!');
      // Activity dropped over activitytimeslotsdroppable

      // Add the activity to the addedActivities list
      console.log(relativeTopPosition);
      setAddedActivities([
        ...addedActivities,
        {
          id: active.id.toString(),
          height: 24,
          top: relativeTopPosition,
        },
      ]);
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

function Activity({ id, isPlaceholder = false }: { id: string; isPlaceholder?: boolean }) {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: id,
    data: {
      location: 'activitydroppable',
    },
  });

  const style: any = {
    background: isPlaceholder ? 'lightgray' : 'white',
    boxSizing: isPlaceholder ? 'border-box' : '',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} id={id}>
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
