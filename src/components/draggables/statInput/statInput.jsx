import React from 'react';
import './statInput.css';

const StatInput = () => {
  return (
    <div className='stat-input'>
      <label>
        Ability
        <input type="number" name="ability"/>
      </label>
    </div>

  );
};

export default StatInput;
