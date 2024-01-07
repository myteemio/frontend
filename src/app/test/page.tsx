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
  defaultDurationHours: number;
};

type AdjustedActivitiesT = AddedActivityT & {
  overlap: boolean;
  overlapCount: number;
  isIncorrect: boolean;
  leftOffset: number;
};

export default function Test() {
  const timetableHours = 18;
  const onehourheight = 100 / 18;

  const [timetable, setTimetable] = useState<{ hours: number; startTime: number }>({
    hours: timetableHours,
    startTime: 6,
  });
  const [heightOfDroppableArea, setHeightOfDroppableArea] = useState<string>('100%');
  const [activeElement, setActiveElement] = useState<AddedActivityT>();
  const [activities, setActivities] = useState<AddedActivityT[]>([
    {
      id: '1',
      top: 0,
      height: 0,
      defaultDurationHours: 1,
    },
  ]);
  const [adjustedActivities, setAdjustedActivities] = useState<AdjustedActivitiesT[]>([]);
  const [addedActivities, setAddedActivities] = useState<AddedActivityT[]>([
    {
      id: '2',
      top: 0,
      height: onehourheight,
      defaultDurationHours: 1,
    },
    {
      id: '3',
      top: 0,
      height: onehourheight * 2,
      defaultDurationHours: 2,
    },
  ]);

  useEffect(() => {
    const droppable = document.getElementById('activitytimeslotsdroppable');

    if (droppable) {
      setHeightOfDroppableArea(`${droppable.clientHeight}px`);
    }
  }, []);

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
            hours={timetable.hours}
            startTime={timetable.startTime}
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
                details={item}
                duration={convertProcentageHeightToHours(item.height, timetable.hours)}
                timeslot={convertPositionAndHeightToTimeslots(
                  item.height,
                  item.top > 0 ? item.top : 0,
                  timetable.hours,
                  timetable.startTime
                )}
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
            {activities.map((v, i) => (
              <Activity details={v} style={{}} key={i} id={v.id} isPlaceholder={activeElement?.id === v.id}></Activity>
            ))}
          </ActivityDroppable>
        </div>
        <DragOverlay
          style={{
            height: heightOfDroppableArea,
          }}
        >
          {/* This magic 85% is just so the overlay will match the height of the element dragged*/}
          {activeElement ? (
            <ActivityBeingDragged
              details={activeElement}
              style={{ height: activeElement.height > 0 ? `${activeElement.height}%` : 'auto' }}
              id={`drag-${activeElement.id}`}
            />
          ) : undefined}
        </DragOverlay>
      </DndContext>
    </div>
  );

  function handleDragMove(event: DragMoveEvent) {
    const { over, active } = event;
    if (over && over.id) {
      if (over.id === 'activitytimeslotsdroppable') {
        // Dragged over activity droppable
        console.log(event);
      }
    }
    return; // Not dragged over anything
  }
  function handleDragOver(event: DragOverEvent) {
    const { over, active } = event;

    if (over && over.id) {
      console.log(event);
      // get the droppable its hovering above
      const item = document.getElementById(`drag-${active.id}`);

      if (item) {
        if (over.id === 'activitytimeslotsdroppable') {
          // Set the size of drag element correctly
          // must fix the background-color and shits here...
          item.setAttribute(
            'style',
            `height: ${
              (active.data.current?.activitydetails.defaultDurationHours ?? activeElement?.defaultDurationHours ?? 1) *
              onehourheight
            }%; background-color: white;`
          );

          return;
        }

        if (over.id === 'activitydroppable') {
          item.setAttribute('style', `height: auto; background-color: white;`);
          return;
        }
      }
    }
    return;
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
        const foundItem = activities.find((v) => v.id === event.active.id);

        if (foundItem) {
          console.log(foundItem);
          setActiveElement(foundItem);
          return;
        }
      }
    }

    console.log('No item found on drag start');
  }

  function handleDragEnd(event: DragEndEvent) {
    //console.log(event);

    // Default stuff
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
            height:
              (active.data.current?.activitydetails.defaultDurationHours ?? activeElement?.defaultDurationHours ?? 1) *
              onehourheight,
            top: relativeTopPosition,
            defaultDurationHours:
              active.data.current?.activitydetails.defaultDurationHours ?? activeElement?.defaultDurationHours ?? 1,
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
        const foundItem = items.findIndex((v) => v.id === active.id);
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
      // Reset it back to the default data, such that it does not keep its height from
      // when it was added to the timetable
      setActivities([
        ...activities,
        {
          id: active.id,
          defaultDurationHours: 1,
          height: 0,
          top: 0,
        } as AddedActivityT,
      ]);

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

function ActivityTimeslotsDroppable({
  children,
  style,
  hours,
  startTime,
}: {
  children: ReactNode;
  style: React.CSSProperties;
  hours: number;
  startTime: number;
}) {
  const { setNodeRef, node } = useDroppable({
    id: 'activitytimeslotsdroppable',
  });

  const [timetable, setTimetable] = useState<string[]>([]);

  useEffect(() => {
    const timeslots = [];
    for (let i = 0; i < hours; i++) {
      const hour = startTime + i;
      timeslots.push(hour < 10 ? `0${hour}:00` : `${hour}:00`);
    }
    setTimetable(timeslots);
  }, []);

  return (
    <>
      <div style={style} className={styles.droppableAreas} ref={setNodeRef} id={'activitytimeslotsdroppable'}>
        {children}
      </div>
      <div className={styles.timetableStyle}>
        {timetable.map((v, i) => {
          return (
            <div className={styles.singletimetablestyle} style={{ height: `${100 / timetable.length}%` }} key={i}>
              <p className={styles.singletimetabletext}>{v}</p>
              <span className={styles.horizontalline} />
            </div>
          );
        })}
      </div>
    </>
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
  details,
}: {
  id: string;
  style: React.CSSProperties;
  isPlaceholder?: boolean;
  details: AddedActivityT;
}) {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: id,
    data: {
      location: 'activitydroppable',
      activitydetails: details,
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

function ActivityBeingDragged({
  id,
  style,
  details,
}: {
  id: string;
  style: React.CSSProperties;
  details: AddedActivityT;
}) {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: id,
    data: {
      location: 'activitydroppable',
      activitydetails: details,
    },
  });

  const internalstyle: any = {
    background: 'white',
    boxSizing: 'border-box',
    ...style,
  };

  return (
    <div ref={setNodeRef} style={internalstyle} {...listeners} {...attributes} id={id}>
      <p style={{ margin: 0, padding: 0 }}>
        Activity being dragged {id} (height: {style.height})
      </p>
    </div>
  );
}

function ActivityDropped({
  id,
  isPlaceholder = false,
  style,
  duration,
  timeslot,
  details,
}: {
  id: string;
  isPlaceholder?: boolean;
  style: React.CSSProperties;
  duration: number;
  timeslot: { start: string; end: string };
  details: AddedActivityT;
}) {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: id,
    data: {
      location: 'activitytimeslotsdroppable',
      activitydetails: details,
    },
  });

  const internalstyle: any = {
    background: isPlaceholder ? 'lightgray' : 'white',
    boxSizing: isPlaceholder ? 'border-box' : '',
    ...style,
  };

  return (
    <div ref={setNodeRef} style={internalstyle} {...listeners} {...attributes}>
      <p style={{ margin: 0, padding: 0, visibility: isPlaceholder ? 'hidden' : 'visible' }}>
        Activity dropped {id} - ({duration} hours) - ({timeslot.start} - {timeslot.end})
      </p>
    </div>
  );
}

function convertProcentageHeightToHours(heightProcentage: number, totalhours: number) {
  return Math.round(heightProcentage * (totalhours / 100));
}
function convertPositionAndHeightToTimeslots(
  heightPercentage: number,
  topPercentage: number,
  totalHours: number,
  startTime: number
) {
  // Convert percentages to hours
  const startHoursFromStartTime = (topPercentage / 100) * totalHours;
  const durationHours = (heightPercentage / 100) * totalHours;

  // Calculate start and end times in hours from midnight
  const startTotalHours = startTime + startHoursFromStartTime;
  const endTotalHours = startTotalHours + durationHours;

  // Convert to HH:MM format
  const formatTime = (hours: number) => {
    const roundedHours = Math.floor(hours);
    const minutes = Math.floor((hours - roundedHours) * 60);
    return `${roundedHours < 10 ? '0' : ''}${roundedHours}:${minutes < 10 ? '0' : ''}${minutes}`;
  };

  const start = formatTime(startTotalHours);
  const end = formatTime(endTotalHours);

  return { start, end };
}
