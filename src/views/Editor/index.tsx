
/**
     * 旋转公式：
     *  点a(x, y)
     *  旋转中心c(x, y)
     *  旋转后点n(x, y)
     *  旋转角度θ                tan ??
     * nx = cosθ * (ax - cx) - sinθ * (ay - cy) + cx
     * ny = sinθ * (ax - cx) + cosθ * (ay - cy) + cy
     */

// const centerX = left + width / 2;
// const centerY = top + height / 2;

// left = Math.cos(rotate) * (left - centerX) - Math.sin(rotate) * (top - centerY) + centerX;
// top = Math.sin(rotate) * (left - centerX) + Math.cos(rotate) * (top - centerY) + centerY;
// console.log(left, top, rotate);
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { connect } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import curry from 'lodash/curry';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import { plainDatatoTree,
  changeState,
  getElementPosByEvent,
  getElementByType,
} from '../../utils';
import { IArea } from '../../interface';
import {
  cancelRecords,
  redoRecords,
  saveRecords,
} from '../../store/actions';
import { GROUP } from '../../constants';

import GridLine from './GridLine';
import styles from './index.module.scss';
import Element from './Element';
import MarkLine from './MarkLine';
import Area from './Area';

function Editor(props) {
  const [showGridLine, toggleGridLine] = useState(true);
  const {
    model,
    updateComponentMap,
    updateComponentMapAndSelectId,
    updateSelectComponent,
    updateAreaPos,
    addRecords,
    cancelRecords,
    redoRecords,
  } = props;

  const {
    canvasWidth,
    canvasHeight,
    scale: scaleRatio,
    componentMap,
    selectComponentId,
  } = model;

  const initialAreaPos = {
    startPos: {
      left: 0,
      top: 0,
    },
    endPos: {
      left: 0,
      top: 0,
    }
  };
  const hideArea = () => {
    updateAreaPos(initialAreaPos, []);
  };

  const findChildrenIdBySelectId = selectedId => {
    return Object.keys(componentMap).filter(id => {
      return componentMap[id].parentId === selectedId;
    });
  };

  const deleteElement = (parentId, copyState) => {
    const { type } = copyState[parentId];

    if (type === GROUP) {
      const childs = findChildrenIdBySelectId(parentId);

      childs.forEach(id => {
        deleteElement(id, copyState);
      });
    }

    delete copyState[parentId];
  };

  const handleKey = key => {
    const keyHandleMap = {
      backspace: () => {
        const copyState = cloneDeep(componentMap);

        deleteElement(selectComponentId, copyState);
        // 清除selectedId和更新componentMap属性
        updateComponentMapAndSelectId(copyState, null);
      },
      'cmd+h': () => {
        toggleGridLine(!showGridLine);
      },
      'cmd+z': () => {
        // 撤销
        cancelRecords();
      },
      'cmd+shift+z': () => {
        // 重做
        redoRecords();
      }
    };

    keyHandleMap[key]();
  };

  const angleToRadian = angle => angle * Math.PI / 180;
  
  function calculateRotatedPointCoordinate(center, rotate, point) {
    /**
     * 旋转公式：
     *  点a(x, y)
     *  旋转中心c(x, y)
     *  旋转后点n(x, y)
     *  旋转角度θ                tan ??
     * nx = cosθ * (ax - cx) - sinθ * (ay - cy) + cx
     * ny = sinθ * (ax - cx) + cosθ * (ay - cy) + cy
     */

    return {
      x: (point.x - center.x) * Math.cos(angleToRadian(rotate)) - (point.y - center.y) * Math.sin(angleToRadian(rotate)) + center.x,
      y: (point.x - center.x) * Math.sin(angleToRadian(rotate)) + (point.y - center.y) * Math.cos(angleToRadian(rotate)) + center.y,
    };
  }

  /**
  * @description 计算组合最小包围盒子
  * @param containIds 
  * @returns IArea
  */
  const getMinWrapperAreaPos = (containIds: string[]) => {
    let startLeft = Number.MAX_SAFE_INTEGER;
    let endLeft = -Number.MAX_SAFE_INTEGER;
    let startTop = Number.MAX_SAFE_INTEGER;
    let endTop = -Number.MAX_SAFE_INTEGER;

    containIds.forEach(id => {
      const { width, height, rotate = 0 } = componentMap[id].containerProps.style;
      const { left, top } = componentMap[id].containerProps.style;
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const getRotatePointByPoint = curry(calculateRotatedPointCoordinate)({
        x: centerX,
        y: centerY,
      })(rotate);

      // 获取左上角旋转点坐标
      const { x: leftTopX, y: leftTopY } = getRotatePointByPoint({
        x: left,
        y: top,
      });
      // 右上角
      const { x: rightTopX, y: rightTopY } = getRotatePointByPoint({
        x: left + width,
        y: top,
      });
      // 左下角
      const { x: leftBottomX, y: leftBottomY } = getRotatePointByPoint({
        x: left,
        y: top + height,
      });
      // 右下角
      const { x: rightBottomX, y: rightBottomY } = getRotatePointByPoint({
        x: left + width,
        y: top + height,
      });
      const maxX = Math.max.call(null, leftTopX, rightTopX, leftBottomX, rightBottomX);
      const minX = Math.min.call(null, leftTopX, rightTopX, leftBottomX, rightBottomX);
      const maxY = Math.max.call(null, leftTopY, rightTopY, leftBottomY, rightBottomY);
      const minY = Math.min.call(null, leftTopY, rightTopY, leftBottomY, rightBottomY);

      if (minX < startLeft) {
        startLeft = left;
      }

      if (endLeft < maxX) {
        endLeft = maxX;
      }

      if (minY < startTop) {
        startTop = minY;
      }

      if (endTop < maxY) {
        endTop = maxY;
      }
    });
    
    const areaPos = {
      startPos: {
        left: startLeft,
        top: startTop,
      },
      endPos: {
        left: endLeft,
        top: endTop,
      }
    };

    return areaPos;
  };

  const handleMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();
    updateSelectComponent(null);

    const dom = document.querySelector('#editorWrapper');
    const { left, top } = dom.getBoundingClientRect();
    const startPos = getElementPosByEvent(e); // 不要在move里执行，否则要加e.presist();
    let areaPos: IArea = initialAreaPos;

    const move = moveEvent => {
      areaPos = {
        startPos,
        endPos: {
          left: moveEvent.clientX - left,
          top: moveEvent.clientY - top,
        },
      };
      updateAreaPos(areaPos, []);
    };
    
    const up = () => {
      // 计算盒子
      const containIds: string[] = [];

      Object.keys(componentMap).forEach(id => {
        const { endPos } = areaPos;
        const boxInfo = {
          left: Math.min(startPos.left, endPos.left),
          top: Math.min(startPos.top, endPos.top),
          width: Math.abs(endPos.left - startPos.left),
          height: Math.abs(endPos.top - startPos.top),
        };
        const componentinfo = componentMap[id];
        const {
          containerProps: {
            style: {
              left,
              top,
              width,
              height,
              rotate = 0,
            }
          }
        } = componentinfo;

        if (
          boxInfo.left < left &&
            boxInfo.top < top &&
            boxInfo.width + boxInfo.left > left + width &&
            boxInfo.height + boxInfo.top > height + top
            && !componentinfo.isLocked
        ) {
          containIds.push(id);
        }
      });

      if (containIds.length > 1) {
        const minWrapperPos = getMinWrapperAreaPos(containIds);

        updateAreaPos(minWrapperPos, containIds);
      } else {
        hideArea();
      }

      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    const { left, top } = getElementPosByEvent(e);
    const type = e.dataTransfer.getData('type');

    if (type) {
      const { initialProps } = getElementByType(type);
      const {
        top: initialTop,
        left: initialLeft,
        right: initialRight,
        bottom: initialBottom,
        width,
        height, ...componentProps
      } = initialProps || {};
      const containerProps = {
        style: {
          top,
          left,
          width,
          height,
        }
      };
      const updatedMap = {
        ...componentMap,
        [uuid()]: {
          type,
          containerProps,
          componentProps,
        }
      };

      updateComponentMap(updatedMap);
      addRecords();
    }
  };

  const renderElement = data => {
    if (!data) { return null; }

    return Object.keys(data).map((uid, index) => {
      const item = data[uid];

      return (
        <Element
          id={uid}
          key={uid}
          item={item}
          index={index}>
          {renderElement(item.children)}
        </Element>
      );
    });
  };
  const transferData = plainDatatoTree(componentMap);

  return (
    <div
      id="editorWrapper"
      className={styles.editor}
      style={{
        width: canvasWidth,
        height: canvasHeight,
        transformOrigin: '0 0',
        transform: `scale(${scaleRatio / 100})`
      }}>
      <KeyboardEventHandler
        handleKeys={['backspace', 'cmd+h', 'cmd+z', 'cmd+shift+z']}
        onKeyEvent={handleKey} />
      <div
        onMouseDown={handleMouseDown}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}>
        <GridLine show={showGridLine} />
        {
          renderElement(transferData)
        }
      </div>
      {showGridLine && <MarkLine />}
      <Area />
    </div>
  );
}

export default connect(
    state => ({ model: state }),
    dispatch => ({
      updateComponentMap: val => dispatch(changeState('componentMap', val)),
      updateSelectComponent: selectId => dispatch(changeState('selectComponentId', selectId)),
      updateAreaPos: (position, containIds) => dispatch(changeState({ areaPos: position, containIds })),
      updateComponentMapAndSelectId: (val, selectId) => {
        dispatch(changeState({ componentMap: val, selectComponentId: selectId }));
      },
      addRecords: () => dispatch(saveRecords()),
      cancelRecords: step => dispatch(cancelRecords(step)),
      redoRecords: () => dispatch(redoRecords()),
    })
)(Editor);
