import React from "react";
import { connect } from "react-redux";
import Button from "../../components/Button";
import { NumberPicker } from "@ali/wind";
import {
  changeState,
  absoluteToRealtiveCoordinate,
  realtiveToAbsoluteCoordinate,
} from "../../utils";
import { v4 as uuid } from "uuid";
import styles from "./index.module.scss";
import { cancelRecords, redoRecords } from "../../store/actions";

function Header(props) {
  const {
    containIds,
    canvasWidth,
    canvasHeight,
    scale,
    updateState,
    changeWidth,
    changeHeight,
    changeScale,
    areaPos,
    componentMap,
    selectComponentId,
    records,
    cancelRecords,
    redoRecords,
  } = props;

  const  { startPos, endPos } = areaPos;
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
                boxInfo
              ),
            },
            parentId,
          },
        };
      }
      return { ...prev, [id]: componentMap[id] };
    }, {});
  };

  const getSplitComponentMap = (selectId) => {
    return Object.keys(componentMap).reduce((prev, id) => {
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
                componentMap[selectId].containerProps.style
              ),
            },
          },
        };
      } else if (selectId !== id) {
        return {
          ...prev,
          [id]: item,
        };
      } else {
        return { ...prev };
      }
    }, {});
  };

  const handleCombine = () => {
    const parentId = uuid();
    const combineMap = getCombineComponentMap(parentId);
    const newState = {
      componentMap: {
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
    selectComponentId: parentId,
    containIds: [],
    areaPos: {
      startPos: {
        left: 0,
        top: 0,
      },
      endPos: {
        left: 0,
        top: 0,
      }
    },
  }
    updateState(newState);
  };

  const handleSplit = () => {
    const { type } = componentMap[selectComponentId];
    if (type === "group") {
      const splitMap = getSplitComponentMap(selectComponentId);
      const newState = {
        componentMap: {...splitMap},
        selectComponentId: '',
        containIds: [],
        areaPos,
      }
      updateState(newState);
    }
  };

  const handleCancle = () => {
    cancelRecords()
  }

  const handleRedo = () => {
    redoRecords();
  }

  return (
    <div className={styles.header}>
      宽 * 高
      <NumberPicker
        onChange={(val) => changeWidth(val)}
        className={styles.numberPicker}
        value={canvasWidth}
      />
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
      />
      %
      <Button
        disabled={containIds.length <= 1}
        btnType="primary"
        onClick={handleCombine}
      >
        组合
      </Button>
      <Button
        disabled={
          !componentMap[selectComponentId] ||
          componentMap[selectComponentId].type !== "group"
        }
        btnType="primary"
        onClick={handleSplit}
      >
        拆分
      </Button>
      <Button onClick={handleCancle}>
        撤销
      </Button>
      <Button onClick={handleRedo}>
        重做
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
      updateState: (val) => dispatch(changeState(val)),
      cancelRecords: step => dispatch(cancelRecords(step)),
      redoRecords: ()=> dispatch(redoRecords()),
    };
  }

)(Header)
