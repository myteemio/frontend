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
  Modifier,
  ClientRect,
} from '@dnd-kit/core';
import { Transform } from '@dnd-kit/utilities';
import classNames from 'classnames';
import Image from 'next/image';

type ActivityDetailsT = {
  title: string;
  minPeople: number;
  location: {
    city: string;
    lat: number;
    lng: number;
  };
  startPrice: number;
  image: string;
  custom: boolean;
};

type AddedActivityT = {
  id: string;
  top: number;
  height: number;
  defaultDurationHours: number;
  activity: ActivityDetailsT;
};

type AdjustedActivitiesT = AddedActivityT & {
  overlap: boolean;
  overlapCount: number;
  isIncorrect: boolean;
  leftOffset: number;
};

const timetableHours = 13;
const onehourheight = 100 / timetableHours;
const gridSnapInMinutes = 20;

export default function Test() {
  const [timetable, setTimetable] = useState<{ hours: number; startTime: number }>({
    hours: timetableHours,
    startTime: 8,
  });
  const [heightOfDroppableArea, setHeightOfDroppableArea] = useState<string>('100%');
  const [activeElement, setActiveElement] = useState<AddedActivityT & { DraggedFrom: string }>();
  const [activities, setActivities] = useState<AddedActivityT[]>([
    {
      id: '1',
      top: 0,
      height: 0,
      defaultDurationHours: 1,
      activity: {
        custom: false,
        image: '/images/activityImages/gokart.jpg',
        location: {
          city: 'København S',
          lat: 25,
          lng: 25,
        },
        minPeople: 4,
        startPrice: 259,
        title: 'GoKart Amager',
      },
    },
  ]);
  const [adjustedActivities, setAdjustedActivities] = useState<AdjustedActivitiesT[]>([]);
  const [addedActivities, setAddedActivities] = useState<AddedActivityT[]>([
    {
      id: '2',
      top: onehourheight * 8, // 16 til 20
      height: onehourheight * 4,
      defaultDurationHours: 4,
      activity: {
        custom: false,
        image: '/images/activityImages/cookingclass.jpeg',
        location: {
          city: 'København Ø',
          lat: 25,
          lng: 25,
        },
        minPeople: 8,
        startPrice: 599,
        title: 'Cooking Class',
      },
    },
    {
      id: '3',
      top: onehourheight * 4,
      height: onehourheight * 2,
      defaultDurationHours: 2,
      activity: {
        custom: true,
        image: '/images/activityImages/tedtalk.png',
        location: {
          city: 'Herlev',
          lat: 25,
          lng: 25,
        },
        minPeople: 0,
        startPrice: 0,
        title: 'TED Talk',
      },
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

  function customSnapToGrid(args: any) {
    const { transform } = args;

    var heightOfAreaInNumbers = Number(heightOfDroppableArea.replace(/\D/g, ''));

    // Snap to every 20 minutes
    var gridsizeInpIxels = (heightOfAreaInNumbers * (onehourheight / 100)) / (60 / gridSnapInMinutes);

    return {
      ...transform,
      x: Math.floor(transform.x / gridsizeInpIxels) * gridsizeInpIxels,
      y: Math.floor(transform.y / gridsizeInpIxels) * gridsizeInpIxels,
    };
  }

  return (
    <div className={styles.outsidecontainer}>
      <div className={styles.top}>
        <p className={styles.title}>PLANLÆG DIT EVENT</p>
        <p className={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempor justo non arcu aliquet posuere. Sed non
          justo massa. Interdum et malesuada fames ac ante ipsum primis in faucibus.
        </p>
      </div>
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
                  onResize={(deltaHeight, handlePulled) => {
                    const heightOfAreaInPixels = Number(heightOfDroppableArea.replace(/\D/g, ''));
                    let newHeightInPercentage = (deltaHeight / heightOfAreaInPixels) * 100;

                    const snapInterval = onehourheight / (60 / gridSnapInMinutes);
                    newHeightInPercentage = Math.round(newHeightInPercentage / snapInterval) * snapInterval;

                    // Ensure new height is not below the minimum height
                    const minHeightPercentage = onehourheight;
                    const newHeight = Math.max(item.height + newHeightInPercentage, minHeightPercentage);

                    // Prevent resizing below the minimum height and moving the top down in such cases
                    if (newHeight < minHeightPercentage) {
                      return;
                    }

                    if (handlePulled === 'upper') {
                      const newTopInPercentage = item.top - newHeightInPercentage;

                      // Ensure the top is not less than 0
                      const newTop = Math.max(newTopInPercentage, 0);

                      console.log(newHeight);
                      if (newTop > item.top && newHeight <= onehourheight) {
                        return;
                      }

                      setAddedActivities((prevActivities) =>
                        prevActivities.map((activity) =>
                          activity.id === item.id ? { ...activity, height: newHeight, top: newTop } : activity
                        )
                      );
                    }

                    if (handlePulled === 'lower') {
                      // Existing logic for resizing from the bottom, now with height snapping
                      setAddedActivities((prevActivities) =>
                        prevActivities.map((activity) =>
                          activity.id === item.id ? { ...activity, height: newHeight } : activity
                        )
                      );
                    }
                  }}
                />
              ))}
            </ActivityTimeslotsDroppable>
          </div>
          <div className={styles.rightside}>
            <ActivityDroppable>
              {activities.map((v, i) => (
                <Activity details={v} style={{}} key={i} id={v.id} isPlaceholder={activeElement?.id === v.id} />
              ))}
            </ActivityDroppable>
          </div>
          <DragOverlay
            modifiers={[customRestrictToParent, customSnapToGrid]}
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
    </div>
  );

  function handleDragMove(event: DragMoveEvent) {
    const { over, active } = event;
    if (over && over.id) {
      const item = document.getElementById(`drag-${active.id}`);
      const overElement = document.getElementById(over.id.toString());

      if (item && overElement) {
        if (over.id === 'activitytimeslotsdroppable') {
          // Dragged over activity droppable
          // Time to snap it to the grid
        }
      }
    }
    return; // Not dragged over anything
  }
  function handleDragOver(event: DragOverEvent) {
    const { over, active } = event;

    if (over && over.id) {
      // get the droppable its hovering above
      const item = document.getElementById(`drag-${active.id}`);
      const overElement = document.getElementById(over.id.toString());

      if (item && overElement) {
        if (over.id === 'activitytimeslotsdroppable') {
          {
            if (active.data.current && active.data.current.location === over.id) {
              // when dragged to the same
            }
          }

          // Set the size of drag element correctly
          // must fix the background-color and shits here...

          // Set transform to bbover
          {
            if (active.data.current && active.data.current.location !== over.id) {
              // Snap to the grid when first enter
              const bbactive = item.getBoundingClientRect();
              const bbover = overElement.getBoundingClientRect();
            }
          }

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
    // Set the cursor to invisible when dragging
    const body = document.getElementsByClassName('bodycontent');
    if (body && body.length === 1) {
      body[0].setAttribute('style', 'cursor: none;');
    }

    if (event.active.data.current) {
      const loc = event.active.data.current.location;
      if (loc === 'activitytimeslotsdroppable') {
        // Item dropped already. Look at the addedactivities
        const foundItem = adjustedActivities.find((v) => v.id === event.active.id);
        if (foundItem) {
          setActiveElement({ ...foundItem, DraggedFrom: 'activitytimeslotsdroppable' });
          return;
        }
      }

      if (loc === 'activitydroppable') {
        // Item still in activity list. Look at the activites list.
        const foundItem = activities.find((v) => v.id === event.active.id);

        if (foundItem) {
          setActiveElement({ ...foundItem, DraggedFrom: 'activitydroppable' });
          return;
        }
      }
    }

    console.log('No item found on drag start');
  }

  function handleDragEnd(event: DragEndEvent) {
    // Set the cursor to invisible when dragging
    const body = document.getElementsByClassName('bodycontent');
    if (body && body.length === 1) {
      body[0].setAttribute('style', 'cursor: default;');
    }

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
        console.log('dropped here');
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
            activity: active.data.current?.activitydetails.activity,
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
          activity: active.data.current?.activitydetails.activity,
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
    <div className={classNames(styles.activitygrid)} ref={setNodeRef} id="activitydroppable">
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
    <div ref={setNodeRef} className={styles.activityouter} style={internalstyle} {...listeners} {...attributes} id={id}>
      <div className={styles.activityinner} style={{ visibility: isPlaceholder ? 'hidden' : 'visible' }}>
        <div className={styles.locationAndPeople}>
          <div className={styles.peoplecontainer}>
            <div className={styles.people}>👥 {details.activity.minPeople}+</div>
          </div>
          <div className={styles.locationcontainer}>{details.activity.location.city}</div>
        </div>
        <div className={styles.activityImage}>
          <Image src={details.activity.image} fill alt={details.activity.title} />
        </div>
        <p className={styles.activitytitle}>{details.activity.title}</p>
        <p className={styles.activityprice}>Fra {details.activity.startPrice} dkk pr. person</p>
      </div>
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
  details: AddedActivityT & { DraggedFrom: string };
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

  if (details.DraggedFrom === 'activitydroppable') {
    return (
      <div
        ref={setNodeRef}
        className={styles.activityouterdragged}
        style={internalstyle}
        {...listeners}
        {...attributes}
        id={id}
      >
        <div className={styles.activityinner}>
          <div className={styles.locationAndPeople}>
            <div className={styles.peoplecontainer}>
              <div className={styles.people}>👥 {details.activity.minPeople}+</div>
            </div>
            <div className={styles.locationcontainer}>{details.activity.location.city}</div>
          </div>
          <div className={styles.activityImage}>
            <Image src={details.activity.image} fill alt={details.activity.title} />
          </div>
          <p className={styles.activitytitle}>{details.activity.title}</p>
          <p className={styles.activityprice}>Fra {details.activity.startPrice} dkk pr. person</p>
        </div>
      </div>
    );
  } else {
    return (
      <div
        ref={setNodeRef}
        className={classNames(styles.activityouterdragged, styles.activityouterdraggedmall)}
        style={internalstyle}
        {...listeners}
        {...attributes}
        id={id}
      >
        <div className={styles.activityinner}>
          <p className={classNames(styles.activitytitle, styles.activitytitlesmall)}>
            {details.activity.title} - Fra {details.activity.startPrice} dkk pr. person
          </p>
        </div>
      </div>
    );
  }
}

function ActivityDropped({
  id,
  isPlaceholder = false,
  style,
  duration,
  timeslot,
  details,
  onResize, // Added this prop to handle the resize
}: {
  id: string;
  isPlaceholder?: boolean;
  style: React.CSSProperties;
  duration: number;
  timeslot: { start: string; end: string };
  details: AddedActivityT;
  onResize: (deltaHeight: number, handledPulled: 'upper' | 'lower') => void; // Added this type for the onResize prop
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

  const [height, setHeight] = useState<number>(style.height as number);

  // Define a minimum height percentage
  const minHeightPercentage = 5.55;

  // Resize handler for the top and bottom buttons
  const handleResize = (deltaHeight: number, handlePulled: 'upper' | 'lower') => {
    onResize(deltaHeight, handlePulled);
  };

  return (
    <div style={internalstyle}>
      {/* Resize button at the top */}
      <div
        style={{
          position: 'absolute',
          top: '-10px',
          height: '10px',
          width: '20px',
          backgroundColor: 'blue',
          cursor: 'ns-resize',
        }}
        onMouseDown={(e) => {
          const startY = e.clientY;
          // Attach mouse move and mouse up listeners to the document
          const onMouseMove = (e: MouseEvent) => {
            handleResize(startY - e.clientY, 'upper');
          };
          const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
          };
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        }}
      />

      {/* Your existing content */}
      <div ref={setNodeRef} {...listeners} {...attributes} style={{ height: '100%', width: '100%' }}>
        <p style={{ margin: 0, padding: 0, visibility: isPlaceholder ? 'hidden' : 'visible' }}>
          Activity dropped {id} - ({duration} hours) - ({timeslot.start} - {timeslot.end})
        </p>
      </div>

      {/* Resize button at the bottom */}
      <div
        style={{
          position: 'absolute',
          height: '10px',
          width: '20px',
          backgroundColor: 'blue',
          cursor: 'ns-resize',
        }}
        onMouseDown={(e) => {
          const startY = e.clientY;
          // Attach mouse move and mouse up listeners to the document
          const onMouseMove = (e: MouseEvent) => {
            handleResize(e.clientY - startY, 'lower');
          };
          const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
          };
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        }}
      />
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

  // Convert hours to total minutes
  const startTotalMinutes = startTotalHours * 60;
  const endTotalMinutes = endTotalHours * 60;

  // Round to nearest 20-minute interval
  const roundToNearestInterval = (minutes: number) => {
    return Math.round(minutes / gridSnapInMinutes) * gridSnapInMinutes;
  };

  const roundedStartMinutes = roundToNearestInterval(startTotalMinutes);
  const roundedEndMinutes = roundToNearestInterval(endTotalMinutes);

  // Convert to HH:MM format
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours < 10 ? '0' : ''}${hours}:${remainingMinutes < 10 ? '0' : ''}${remainingMinutes}`;
  };

  const start = formatTime(roundedStartMinutes);
  const end = formatTime(roundedEndMinutes);

  return { start, end };
}

export const customRestrictToParent: Modifier = ({
  containerNodeRect,
  draggingNodeRect,
  transform,
  over,
  active,
  overlayNodeRect,
}) => {
  if (!draggingNodeRect || !containerNodeRect) {
    return transform;
  }

  if (!over) {
    return transform;
  }

  if (!active) {
    return transform;
  }

  // When its not dragged over the activity slot droppable, then dont snap or anything
  if (over.id !== 'activitytimeslotsdroppable') {
    return transform;
  }

  const theActivitySlotDroppable = document.getElementById('activitytimeslotsdroppable');

  if (theActivitySlotDroppable) {
    const rectOfActivity = theActivitySlotDroppable.getBoundingClientRect();
    return restrictToBoundingRect(transform, draggingNodeRect as ClientRect, rectOfActivity);
  }

  return restrictToBoundingRect(transform, draggingNodeRect as ClientRect, containerNodeRect);
};

function restrictToBoundingRect(transform: Transform, rect: ClientRect, boundingRect: ClientRect): Transform {
  const value = {
    ...transform,
  };

  if (rect.top + transform.y <= boundingRect.top) {
    value.y = boundingRect.top - rect.top;
  } else if (rect.bottom + transform.y >= boundingRect.top + boundingRect.height) {
    value.y = boundingRect.top + boundingRect.height - rect.bottom;
  }

  if (rect.left + transform.x <= boundingRect.left) {
    value.x = boundingRect.left - rect.left;
  } else if (rect.right + transform.x >= boundingRect.left + boundingRect.width) {
    value.x = boundingRect.left + boundingRect.width - rect.right;
  }

  return value;
}
