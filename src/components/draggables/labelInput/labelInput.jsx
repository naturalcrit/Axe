import React from 'react';
import './labelInput.css';

const LabelInput = () => {
  return (
    <div className='draggable label-input'>   
      <label>
        <input className='draggableTitle' type="text" size="1" aria-label='property name' placeholder='Character Name'/>
        <input type="text" size="1" aria-label='property value' />
      </label>    
    </div>
  );
};

export default LabelInput;
