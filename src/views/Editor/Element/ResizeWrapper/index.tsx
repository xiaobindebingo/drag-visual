
import React, { useRef } from 'react';
import { connect } from 'react-redux';
import cls from 'classnames';
import cloneDeep from 'lodash/cloneDeep';


import { Icon } from '@ali/wind';

import { changeState, getClientPosByEvent } from '../../../../utils';
import { CirclePos } from '../../../../types';
import {
  saveRecords,
  updateCurContainerStyleAction,
} from '../../../../store/actions';

import Circle from './Circle';
import Rotate from './Rotate';
import { circleProps } from './constants';
import styles from './index.module.scss';

const updateComponentMapOrder = (id, componentMap): any => {
  const copyObj = cloneDeep(componentMap);

  delete copyObj[id];
  copyObj[id] = componentMap[id];

  return copyObj;
};

const ResizeWrapper: React.FC<any> = props => {
  const {
    containerProps,
    model,
    index,
    style,
    className,
    id,
    updateCurContainerStyle,
    updateSelectComponentAndOrderMap,
    addRecord,
  } = props;

  const { componentMap, selectComponentId } = model;

  const wrapper = useRef<any>({});
  const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = wrapper.current;
  const isSelected = id && id === selectComponentId;
  const { isLocked } = componentMap[id];
  const updateComponentItemByPos = (position: CirclePos, updateProps) => {
    const { distanceX = 0, distanceY = 0 } = updateProps;
    const newPropsByPos = {
      lt: {
        width: Math.round(offsetWidth - distanceX),
        height: Math.round(offsetHeight - distanceY),
        left: Math.round(offsetLeft + distanceX),
        top: Math.round(offsetTop + distanceY),
      },
      rt: {
        width: Math.round(offsetWidth + distanceX),
        height: Math.round(offsetHeight - distanceY),
        top: Math.round(offsetTop + distanceY),
      },
      lb: {
        width: Math.round(offsetWidth - distanceX),
        height: Math.round(offsetHeight + distanceY),
        left: Math.round(offsetLeft + distanceX),
      },
      br: {
        width: Math.round(offsetWidth + distanceX),
        height: Math.round(offsetHeight + distanceY),
      },
      t: {
        height: Math.round(offsetHeight - distanceY),
        top: Math.round(offsetTop + distanceY),
      },
      l: {
        width: Math.round(offsetWidth - distanceX),
        left: Math.round(offsetLeft + distanceX),
      },
      r: {
        width: Math.round(offsetWidth + distanceX),
      },

      b: {
        height: Math.round(offsetHeight + distanceY),
      },
    };

    updateCurContainerStyle({
      ...newPropsByPos[position],
    });
  };
  const { top, left, width, height, rotate = 0 } = containerProps.style;
  const centerX = left + width / 2 + 200;
  const centerY = top + height / 2 + 56;
  const handleRotate = e => {
    e.preventDefault();
    e.stopPropagation();

    const startRotate =
      (180 / Math.PI) * Math.atan2(e.clientY - centerY, e.clientX - centerX);

    const move = moveEvent => {
      const endRotate =
        (180 / Math.PI) *
        Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX);

      updateCurContainerStyle({
        rotate: Math.round(endRotate - startRotate + rotate),
      });
    };
    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  const handleMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();
    const orderMap = updateComponentMapOrder(id, componentMap);
    const { x: startX, y: startY } = getClientPosByEvent(e);
    const left = e.currentTarget.offsetLeft;
    const top = e.currentTarget.offsetTop;

    updateSelectComponentAndOrderMap(id, orderMap);

    const move = moveEvent => {
      if (isLocked) {
        return;
      }

      const { x: curX, y: curY } = getClientPosByEvent(moveEvent);
      const curLeft = curX - startX + left;
      const curTop = curY - startY + top;

      updateCurContainerStyle({
        left: curLeft,
        top: curTop,
      });
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
      tabIndex={0}
      role="button"
      ref={wrapper}
      key={id}
      className={cls({
        [className]: className,
        [styles.selected]: isSelected,
      })}
      style={{
        position: 'absolute',
        cursor: 'move',
        ...style,
        zIndex: index,
        ...containerProps.style,
        transform: `rotate(${containerProps.style.rotate}deg)`,
      }}
      onMouseDown={handleMouseDown}
      onDragOver={e => e.preventDefault()}>
      {isSelected && !isLocked && (
        <>
          <Rotate onMouseDown={handleRotate} className={styles.rotate} />
          {circleProps.map(circleProp => {
            return (
              <Circle
                addRecord={addRecord}
                updateComponentItemByPos={updateComponentItemByPos}
                key={circleProp.position}
                {...circleProp} />
            );
          })}
        </>
      )}
      {isLocked && (
        <div className={styles.locked}>
          <Icon size="xs" type="lock-fill" />
        </div>
      )}
      {props.children}
    </div>
  );
};

export default connect(
    state => ({
      model: state,
    }),
    dispatch => ({
      updateCurContainerStyle: val =>
        dispatch(updateCurContainerStyleAction(val)),
      updateSelectComponentAndOrderMap: (selectComponentId, componentMap) =>
        dispatch(
            changeState({
              selectComponentId,
              componentMap,
            })
        ),
      addRecord: () => dispatch(saveRecords()),
    })
)(ResizeWrapper);
