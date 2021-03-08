import React, { useState } from 'react';
import { connect } from 'react-redux';
import styles from './index.module.scss';
import { CirclePos } from '../../../types';
import { getClientPosByEvent, changeState } from '../../../utils';

function Circle (props) {

  const { 
    position,
    style,
  } = props;



  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {
      x: startX, 
      y: startY,
    } = getClientPosByEvent(e);
    const move = (moveEvent) => {
      const {
        x: curX,
        y: curY,
      } = getClientPosByEvent(moveEvent);
      const distanceX = curX - startX;
      const distanceY = curY - startY;
      props.updateComponentItemByPos(position, {distanceX, distanceY})
    }

    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    }
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up)
  }
  // const pointStyle = getpostion(position);
  return (
    <div
     onMouseDown={handleMouseDown}
     style={style}
     className={styles.circle}
    />
  )
}


export default Circle;
