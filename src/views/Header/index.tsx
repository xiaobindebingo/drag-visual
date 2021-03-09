import React from "react";
import { connect } from "react-redux";
import Button from "../../components/Button";
import { NumberPicker } from "@ali/wind";
import { changeState, absoluteToRealtiveCoordinate, realtiveToAbsoluteCoordinate } from "../../utils";
import { v4 as uuid } from "uuid";
import styles from "./index.module.scss";

function Header(props) {
  const {
    containIds,
    canvasWidth,
    canvasHeight,
    scale,
    updateComponentMap,
    changeWidth,
    changeHeight,
    changeScale,
    areaPos: { startPos, endPos },
    componentMap,
    selectComponentId,
  } = props;

  const boxInfo = {
    left: Math.min(startPos.left, endPos.left),
    top: Math.min(startPos.top, endPos.top),
    width: Math.abs(endPos.left - startPos.left),
    height: Math.abs(endPos.top - startPos.top),
  };

  const getCombineComponentMap = (parentId) => {
    return Object.keys(componentMap).reduce((prev, id) => {
      if (containIds.includes(id)) {
        return {
          ...prev,
          [id]: {
            ...componentMap[id],
            containerProps: {
              ...componentMap[id].containerProps,
              style: absoluteToRealtiveCoordinate(
                componentMap[id].containerProps?.style,
                boxInfo,
              ),
            },
            parentId,
          },
        };
      }
      return {...prev,[id]: componentMap[id]};
    }, {});
  };

  const getSplitComponentMap = selectId => {
   return Object.keys(componentMap).reduce((prev, id)=> {
      const item = componentMap[id];
     if (item.parentId === selectId) {
       return {
         ...prev,
         [id]: {
           ...item,
           parentId: null,
           containerProps: {
             ...componentMap[id].containerProps,
             style: realtiveToAbsoluteCoordinate(
               componentMap[id].containerProps?.style,
               componentMap[selectId].containerProps.style,
             ),
           }
         }
       }
     } else if(selectId !== id){
       return {
         ...prev,
         [id]: item,
       }
     } else {
       return {...prev}
     }
    },{});
  }

  const handleCombine = () => {
    const parentId = uuid();
    const combineMap = getCombineComponentMap(parentId);
    updateComponentMap(
      {
        ...combineMap,
        [parentId]: {
          type: "group",
          containerProps: {
            style: {
              ...boxInfo,
            },
          },
        },
      },
      parentId,
      [], // 组合按钮变成禁用
      {
        startPos: { // 重置框选
          left: 0,
          top: 0,
        },
        endPos: {
          left: 0,
          top: 0,
        }
      }
    );
  };

  const handleSplit  = () => {
   const { type }  = componentMap[selectComponentId];
   if (type === 'group') {
     // pid === selectComponentId
     const splitMap = getSplitComponentMap(selectComponentId);
     updateComponentMap(
      {
        ...splitMap,
      },
      '',
      [],
      { startPos, endPos }
     )
   }
  }

  return (
    <div className={styles.header}>
      宽 * 高
      <NumberPicker
        onChange={(val) => changeWidth(val)}
        className={styles.numberPicker}
        value={canvasWidth}
      />{" "}
      *
      <NumberPicker
        onChange={(val) => changeHeight(val)}
        className={styles.numberPicker}
        value={canvasHeight}
      />
      缩放
      <NumberPicker
        max={500}
        min={0}
        onChange={(val) => changeScale(val)}
        value={scale}
      />{" "}
      %
      <Button
        disabled={containIds.length <= 1}
        btnType="primary"
        onClick={handleCombine}
      >
        组合
      </Button>

      <Button
        
        btnType="primary"
        onClick={handleSplit}
      >
        拆分
      </Button>
    </div>
  );
}

export default connect(
  (state) => state,
  (dispatch) => {
    return {
      changeWidth: (val) => dispatch(changeState("canvasWidth", val)),
      changeHeight: (val) => dispatch(changeState("canvasHeight", val)),
      changeScale: (val) => dispatch(changeState("scale", val)),
      updateComponentMap: (val, id, containIds ,pos?) =>{
        if(!pos) {
          dispatch(
            changeState([
              {
                componentMap: val,
              },
              {
                selectComponentId: id,
              },
              {
                containIds,
              },
              // {
              //   areaPos: pos,
              // }
            ])
          );
        }
        dispatch(
          changeState([
            {
              componentMap: val,
            },
            {
              selectComponentId: id,
            },
            {
              containIds,
            },
            {
              areaPos: pos,
            }
          ])
        );
      }
       
    };
  }
)(Header);
