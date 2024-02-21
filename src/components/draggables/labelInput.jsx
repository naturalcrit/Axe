import React from 'react';
import { useDrag } from 'react-dnd';

const LabelInput = () => {
  
  return (
    <div
    className='item'
    ref={drag}
    style={{ opacity: isDragging ? 0.4 : 1 }}>
      <label>
        Character Name
        <input 
          type="text"
          name="name"
          id="characterName"/></label>
    </div>
  )
};

export default LabelInput;
