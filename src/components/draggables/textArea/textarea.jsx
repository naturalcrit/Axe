import React from 'react';
import './textarea.css';


const LabelInput = () => {
  return (
    <div className='draggable text-area-input'>
      <label>
        <input className='draggableTitle' type="text" size="1" placeholder='Text Area Name'/>
        <textarea name="" id="" cols="30" rows="1"></textarea>
      </label>
    </div>
  );
};

export default LabelInput;
