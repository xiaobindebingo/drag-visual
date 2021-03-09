import React from "react";
import { connect } from "react-redux";
import Button from "../../components/Button";
import { NumberPicker } from "@ali/wind";
import { changeState } from "../../utils";
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
  } = props;

  const boxInfo = {
    left: Math.min(startPos.left, endPos.left),
    top: Math.min(startPos.top, endPos.top),
    width: Math.abs(endPos.left - startPos.left),
    height: Math.abs(endPos.top - startPos.top),
  };

  const AbsoluteToRealtiveCoordinate = (containerPropsStyle) => {
    if (!containerPropsStyle) {
      return { top: 0, left: 0, width: 0, height: 0 };
    }
    const { top, left, width, height } = containerPropsStyle;
    return {
      left: left - boxInfo.left,
      top: top - boxInfo.top,
      width,
      height,
    };
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
              style: AbsoluteToRealtiveCoordinate(
                componentMap[id].containerProps?.style
              ),
            },
            parentId,
          },
        };
      }
      return {[id]: componentMap[id]};
    }, {});
  };
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
        startPos: {
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
      updateComponentMap: (val, id, containIds ,pos) =>{
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
