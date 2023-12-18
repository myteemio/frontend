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

export default function Test() {
  const [activeId, setActiveId] = useState<string>('');
  const [activities, setActivities] = useState<string[]>(['1']);
  const [addedActivities, setAddedActivities] = useState<string[]>(['2', '3']);

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
          <ActivityTimeslotsDroppable>
            {addedActivities.map((id, i) => (
              <ActivityDropped key={i} id={id} isPlaceholder={activeId === id}></ActivityDropped>
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

    if (draggedDOMelement) {
      const draggedElementPosition = draggedDOMelement.getBoundingClientRect();
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
      setAddedActivities([...addedActivities, active.id.toString()]);
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
        const foundItem = items.findIndex((v, i) => v === active.id);
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

function ActivityTimeslotsDroppable({ children }: { children: ReactNode }) {
  const { setNodeRef, node } = useDroppable({
    id: 'activitytimeslotsdroppable',
  });

  return (
    <div className={styles.droppableAreas} ref={setNodeRef} id={'activitytimeslotsdroppable'}>
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

function ActivityDropped({ id, isPlaceholder = false }: { id: string; isPlaceholder?: boolean }) {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: id,
    data: {
      location: 'activitytimeslotsdroppable',
    },
  });

  const style: any = {
    background: isPlaceholder ? 'lightgray' : 'white',
    boxSizing: isPlaceholder ? 'border-box' : '',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <p style={{ margin: 0, padding: 0, visibility: isPlaceholder ? 'hidden' : 'visible' }}>Activity dropped {id}</p>
    </div>
  );
}
