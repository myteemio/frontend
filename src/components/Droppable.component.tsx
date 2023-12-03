import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export function Droppable(props: any) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  });

  const style = {
    color: isOver ? 'lightgreen' : undefined,
    height: '100%',
    width: '100%',
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  };

  return (
    <div ref={setNodeRef} style={{ ...style, flexWrap: 'wrap' }}>
      {props.children}
    </div>
  );
}
