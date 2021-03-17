import React from 'react';
import styles from './index.module.scss';
import { getClientPosByEvent } from '../../../../../utils';
import record from '../../../../../store/record';

function Circle (props) {
  const { 
    position,
    style,
    addRecord,
    isLocked,
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
      addRecord();
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
