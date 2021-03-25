import React, { useRef, useState, useEffect } from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton'

function ToggleButtonGroupControlled(props) {
    const { handleChangeOption, optionValue, setOptionValue } = props;
  
    return (
      <ToggleButtonGroup type="radio" name="options" value={optionValue} onChange={handleChangeOption}>
        <ToggleButton value={1}>Today</ToggleButton>
        <ToggleButton value={2}>Yesterday</ToggleButton>
        <ToggleButton value={3}>Delta</ToggleButton>
      </ToggleButtonGroup>
    );
  }
  
export default ToggleButtonGroupControlled;