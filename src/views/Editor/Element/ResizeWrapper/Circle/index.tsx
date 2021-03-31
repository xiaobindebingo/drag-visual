import React from 'react';

import { getClientPosByEvent } from '../../../../../utils';
import record from '../../../../../store/record';

import styles from './index.module.scss';

function Circle(props): React.ReactElement {
  const {
    position,
    style,
    addRecord,
  } = props;
  
  const handleMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();
    const {
      x: startX,
      y: startY,
    } = getClientPosByEvent(e);
    const move:(e: MouseEvent)=>void = moveEvent => {
      const {
        x: curX,
        y: curY,
      } = getClientPosByEvent(moveEvent);
      const distanceX = curX - startX;
      const distanceY = curY - startY;

      props.updateComponentItemByPos(position, { distanceX, distanceY });
    };

    const up = () => {
      addRecord();
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onMouseDown={handleMouseDown}
      style={style}
      className={styles.circle} />
  );
}

export default Circle;
