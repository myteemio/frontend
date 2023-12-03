import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export function Draggable(props: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = {
    cursor: 'pointer',
    display: 'block',
    width: '100%',
    height: '100%',
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}
