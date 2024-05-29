import React from 'react';
import './statInput.css';

const StatInput = () => {
  return (
    <div className='draggable stat-input'>
      <label>
        Ability
        <input type="number" name="ability"/>
      </label>
    </div>

  );
};

export default StatInput;
