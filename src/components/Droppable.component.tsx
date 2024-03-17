import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export function Droppable(props: any) {
  const { isOver: _, setNodeRef } = useDroppable({
    id: 'droppable',
  });

  const style = {
    height: '100%',
    width: '100%',
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-start',
    alignItems: 'center',
  };

  return (
    <div ref={setNodeRef} style={{ ...style, flexWrap: 'wrap', flexDirection: 'column' }}>
      {props.children}
    </div>
  );
}
