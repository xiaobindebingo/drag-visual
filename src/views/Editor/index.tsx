import React, { useState } from "react";
import cloneDeep from 'lodash/cloneDeep';
import GridLine from "./GridLine";
import styles from "./index.module.scss";
import { v4 as uuid } from "uuid";
import { connect } from 'react-redux';
import { changeState, getElementPosByEvent, getElementByType, findDOMByEventAndId } from '../../utils';
import Element from './Element';
import MarkLine from './MarkLine';
import Area from './Area';
import { IArea } from '../../interface';

export const id = 'editorWrapper';
function Editor(props) {
  const {
    canvasWidth,
    canvasHeight,
    scale: scaleRatio,
    componentMap,
    // areaPos,  传不到mouseup里面去,up函数里永远拿到的是initial；
    updateComponentMap,
    updateSelectComponent,
    updateAreaPos,
  } = props;

  const initialAreaPos = {
    startPos: {
      left: 0,
      top: 0,
    },
    endPos: {
      left: 0,
      top: 0,
    }
  }
 const hideArea = () => {
   updateAreaPos(initialAreaPos, [])
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
    const {left, top, width, height } = componentMap[id].containerProps.style;
    if (left < startLeft) {
      startLeft = left;
    } 
    if(endLeft < left + width) {
      endLeft = left + width;
    }

    if (top < startTop) {
      startTop = top;
    } 
    if(endTop < top + height) {
      endTop = top + height;
    }
  });

  return {  
    startPos: {
      left: startLeft,
      top: startTop,
    },
    endPos: {
      left: endLeft,
      top: endTop,
    }
  }
 }
  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateSelectComponent(null); 
    const dom = findDOMByEventAndId(e, id);
    const { left , top } = dom.getBoundingClientRect();
    const startPos = getElementPosByEvent(e); // 不要放到move里，否则要加e.presist();
    let areaPos: IArea = initialAreaPos;
    const move = (moveEvent) => {
      areaPos = {
        startPos,
        endPos:  {left: moveEvent.clientX - left, top: moveEvent.clientY - top}, // offsetX 有bug
      };
      updateAreaPos(areaPos, []);
    }
    
    const up = (e) => {
      // 计算盒子
      const containIds: string[] = [];
      Object.keys(componentMap).forEach(id => {
        const { startPos, endPos} = areaPos;
        const boxInfo = {
          left : Math.min(startPos.left, endPos.left),
          top: Math.min(startPos.top, endPos.top),
          width: Math.abs(endPos.left - startPos.left),
          height: Math.abs(endPos.top - startPos.top),
        }
        const componentinfo = componentMap[id];
        const { 
          containerProps:{
            style: {
              left,
              top,
              width,
              height,
            }
          }
       } = componentinfo; 
       if (
            boxInfo.left < left && 
            boxInfo.top < top && 
            boxInfo.width + boxInfo.left > left + width && 
            boxInfo.height + boxInfo.top > height + top
         ) {
         containIds.push(id);
       }
      });

      if(containIds.length > 1) {
        const minWrapperPos = getMinWrapperAreaPos(containIds)
        updateAreaPos(minWrapperPos, containIds);
      } else {
        hideArea();
      }

      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  }

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { left, top } = getElementPosByEvent(e);
    const type = e.dataTransfer.getData("type");
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

      updateComponentMap({
        ...componentMap,
        [uuid()]: {
          type,
          containerProps,
          componentProps,
        }
      });
    }
  }

  const converData = componentMap => {
    const uuids = Object.keys(componentMap);
    const copyComponentMap = cloneDeep(componentMap)
    uuids.forEach(id => {
      const { parentId } = copyComponentMap[id];
      if (parentId) {
        if(copyComponentMap[parentId].children) {
          copyComponentMap[parentId]['children'][id] = copyComponentMap[id]
        } else {
          copyComponentMap[parentId]['children'] = {
            [id]: copyComponentMap[id]
          }
        }
        delete copyComponentMap[id];
      }
    });
    return copyComponentMap
  }

  const renderElement = (data) => {
    if(!data) return null;
    return Object.keys(data).map((uuid, index) => {
      const item = data[uuid];
      return (
      <Element id={uuid} key={uuid} item={item} index={index}>
       {renderElement(item.children)}
      </Element>)
  })
  }

  const transferData = converData(componentMap);
  return (
    <div 
      id={id} 
      className={styles.editor} 
      style={{
        width: canvasWidth,
        height: canvasHeight,
        transformOrigin: '0 0',
        transform: `scale(${scaleRatio /100})`
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        style={{ position: "absolute", width: "100%", height: "100%" }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <GridLine></GridLine>
        {
         renderElement(transferData)
        }
      </div>
      <MarkLine />
      <Area
      />
    </div>
  );
}

export default connect(
  state => state, 
  dispatch => ({
    updateComponentMap: (val) => dispatch(changeState('componentMap', val)),
    updateSelectComponent: (id) => dispatch(changeState("selectComponentId", id)),
    updateAreaPos: (position, containIds) => dispatch(changeState([{areaPos: position}, {containIds}])),
  })
  )(Editor);
