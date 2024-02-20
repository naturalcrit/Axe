import React from 'react';
import { useDrag } from 'react-dnd';

const MyDraggableComponent = ({ isDragging, text }) => {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: 'card',
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1
      })
    }),
    []
  )
  return (
    <div ref={dragRef} style={{ opacity }}>
      <label>Character Name<input type="text" name="name" id="characterName" /></label>
    </div>
  )
};

export default MyDraggableComponent;
