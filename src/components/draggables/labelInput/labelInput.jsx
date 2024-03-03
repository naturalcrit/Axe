import React from 'react';
import './labelInput.css';

const LabelInput = () => {
  return (
    <div className='label-input'>   
      <div className='label'>
        <input type="text" size="1" aria-label='property name' placeholder='Character Name'/>
        <input type="text" size="1" aria-label='property value' />
      </div>    
    </div>
  );
};

export default LabelInput;
