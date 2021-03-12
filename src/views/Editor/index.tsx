import React, { useState } from "react";
import cloneDeep from 'lodash/cloneDeep';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import GridLine from "./GridLine";
import styles from "./index.module.scss";
import { v4 as uuid } from "uuid";
import { connect } from 'react-redux';
import { 
  changeState, 
  getElementPosByEvent, 
  getElementByType, 
  findDOMByEventAndId,
} from '../../utils';
import Element from './Element';
import MarkLine from './MarkLine';
import Area from './Area';
import { IArea } from '../../interface';
import { 
  cancelRecords, 
  redoRecords, 
  saveRecords,
} from "../../store/actions";

const id = 'editorWrapper';

function Editor(props) {
  const [showGridLine, toggleGridLine] = useState(false);
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

  }= model;

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

 const findChildrenIdBySelectId = (selectedId) => {
   return Object.keys(componentMap).filter((id) => {
      return componentMap[id].parentId === selectedId
   })
 }

 const deleteElement = (parentId, copyState) => {

  const { type } = copyState[parentId];
  if (type === 'group') {
    const childs =  findChildrenIdBySelectId(parentId);
    childs.forEach(id => {
      deleteElement(id, copyState)
     });
   } else {
    delete copyState[parentId]
   }
 }

 const handleKey = (key) => {
   const keyHandleMap = {
     'backspace': () => {
      const copyState = cloneDeep(componentMap);
      deleteElement(selectComponentId, copyState);
      // 清除selectedId和更新componentMap属性
      updateComponentMapAndSelectId(copyState, null)
     },
     'cmd+h': () => {
       toggleGridLine(!showGridLine)
     },
     'cmd+z': () => {
       // 撤销
       cancelRecords();
     },
     'cmd+shift+z': () => {
       // 重做
       redoRecords();
     }
   }

   keyHandleMap[key]();

 
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
    const startPos = getElementPosByEvent(e); // 不要在move里执行，否则要加e.presist();
    let areaPos: IArea = initialAreaPos;

    const move = (moveEvent) => {
      areaPos = {
        startPos,
        endPos:  {
          left: moveEvent.clientX - left,
          top: moveEvent.clientY - top,
        },
      };
      updateAreaPos(areaPos, []);
    }
    
    const up = (e) => {
      // 计算盒子
      const containIds: string[] = [];
      Object.keys(componentMap).forEach(id => {
        const { startPos, endPos} = areaPos;
        const boxInfo = {
          left: Math.min(startPos.left, endPos.left),
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
    return copyComponentMap;
  }

  const renderElement = (data) => {
    if(!data) return null;
    return Object.keys(data).map((uuid, index) => {
      const item = data[uuid];
      return (
        <Element 
          id={uuid} 
          key={uuid} 
          item={item} 
          index={index}
        >
          {renderElement(item.children)}
        </Element>
      )
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
      <KeyboardEventHandler
        handleKeys={['backspace', 'cmd+h', 'cmd+z', 'cmd+shift+z']}
        onKeyEvent={handleKey}
      />
      <div
        onMouseDown={handleMouseDown}
        style={{ position: "absolute", width: "100%", height: "100%" }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <GridLine show={showGridLine} />
        {
         renderElement(transferData)
        }
      </div>
      {showGridLine && <MarkLine />}
      <Area
      />
    </div>
  );
}

export default connect(
  state => ({model: state}), 
  dispatch => ({
    updateComponentMap: (val) => dispatch(changeState('componentMap', val)),
    updateSelectComponent: (id) => dispatch(changeState("selectComponentId", id)),
    updateAreaPos: (position, containIds) => dispatch(changeState({areaPos: position, containIds})),
    updateComponentMapAndSelectId: (val, id) => {
      dispatch(changeState({componentMap: val, selectComponentId: id}))
    },
    addRecords: () => dispatch(saveRecords()),
    cancelRecords: step => dispatch(cancelRecords(step)),
    redoRecords: ()=> dispatch(redoRecords()),
  })
  )(Editor);
