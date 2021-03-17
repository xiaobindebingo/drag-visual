import React, { useState } from "react";
import { connect } from "react-redux";
import cloneDeep from "lodash/cloneDeep";
import { NumberPicker, Button, Range } from "@ali/wind";
import {
  changeState,
  absoluteToRealtiveCoordinate,
  realtiveToAbsoluteCoordinate,
} from "../../utils";
import { v4 as uuid } from "uuid";
import styles from "./index.module.scss";
import { 
  cancelRecords,
  redoRecords,
  saveRecords,
  toggleLockAction,
} from "../../store/actions";
import record from "../../store/record";

function Header(props) {
  const {
    model,
    changeWidth,
    changeHeight,
    changeScale,
    updateState,
    addRecords,
    cancelRecords,
    redoRecords,
    toggleLock,
  } = props;
  const {
    containIds,
    canvasWidth,
    canvasHeight,
    scale,
    areaPos,
    componentMap,
    selectComponentId,
  } = model;
  const { startPos, endPos } = areaPos;
  const boxInfo = {
    left: Math.min(startPos.left, endPos.left),
    top: Math.min(startPos.top, endPos.top),
    width: Math.abs(endPos.left - startPos.left),
    height: Math.abs(endPos.top - startPos.top),
  };



  const { isLocked } =  componentMap[selectComponentId] || {};
  const [speed, setSpeed] = useState<number>(1000);

  const playback = (state, speed) => {
    const item = state.shift();
    setTimeout(() => {
      updateState(item);
      if (state.length > 0) {
        playback(state, 1000 / speed);
      }
    }, 1000 / speed);
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
    addRecords();
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
        },
      },
    };
    updateState(newState);
    addRecords();
  };

  const handleLock = () => {
    toggleLock({
      id: selectComponentId,
      locked: !isLocked,
    })
  }

  const handleSplit = () => {
    addRecords();
    const { type } = componentMap[selectComponentId];
    if (type === "group") {
      const splitMap = getSplitComponentMap(selectComponentId);
      const newState = {
        componentMap: { ...splitMap },
        selectComponentId: "",
        containIds: [],
        areaPos,
      };
      updateState(newState);
    }
  };

  return (
    <div className={styles.header}>
      <div
        style={{
          display: "flex",
          // flexDirection: "column",
          marginRight: 50,
        }}
      >
          <Range
            style={{
              width: 40,
            }}
            min={1}
            max={10}
            hasTip
            value={speed}
            onChange={(val) => setSpeed(Number(val))}
          />
        <Button
          onClick={() => {
            const records = cloneDeep(record.list);
            playback(records, speed);
          }}
        >
          回放
        </Button>
        </div>
      宽：
      <NumberPicker
        onChange={(val) => changeWidth(val)}
        className={styles.numberPicker}
        value={canvasWidth}
      />
      高：
      <NumberPicker
        onChange={(val) => changeHeight(val)}
        className={styles.numberPicker}
        value={canvasHeight}
      />
      缩放：
      <NumberPicker
        max={500}
        min={0}
        onChange={(val) => changeScale(val)}
        value={scale}
      />
      %
      <div style={{ marginLeft: 16 }}>
      <Button
          type="secondary"
          disabled={!selectComponentId}
          onClick={handleLock}
        >
          { isLocked ? "解锁" : "锁定" }
        </Button>
        <Button
          type="primary"
          disabled={containIds.length <= 1}
          onClick={handleCombine}
        >
          组合
        </Button>
        <Button
          type="secondary"
          disabled={
            !componentMap[selectComponentId] ||
            componentMap[selectComponentId].type !== "group"
          }
          onClick={handleSplit}
        >
          拆分
        </Button>
        <Button onClick={cancelRecords}>撤销</Button>
        <Button onClick={redoRecords}>重做</Button>
        <Button
          onClick={() =>
            updateState({
              ...model,
              previewVisible: true,
            })
          }
        >
          预览
        </Button>
      </div>
    </div>
  );
}

export default connect(
  (state) => ({ model: state }),
  (dispatch) => {
    return {
      changeWidth: (val) => dispatch(changeState("canvasWidth", val)),
      changeHeight: (val) => dispatch(changeState("canvasHeight", val)),
      changeScale: (val) => dispatch(changeState("scale", val)),
      updateState: (val) => dispatch(changeState(val)),
      cancelRecords: (step) => dispatch(cancelRecords(step)),
      redoRecords: () => dispatch(redoRecords()),
      addRecords: () => dispatch(saveRecords()),
      toggleLock: val => dispatch(toggleLockAction(val)),
    };
  }
)(Header);
