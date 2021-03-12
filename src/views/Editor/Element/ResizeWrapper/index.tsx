import React, { useRef } from "react";
import { connect } from "react-redux";
import cls from "classnames";
import cloneDeep from "lodash/cloneDeep";
import { changeState, getClientPosByEvent } from "../../../../utils";
import { CirclePos } from "../../../../types";
import Circle from "../../Circle";
import { circleProps } from "./constants";
import events from '../../../../eventbus';
import styles from "./index.module.scss";
import { saveRecords } from "../../../../store/actions";
import record from "../../../../store/record";

const updateComponentMapOrder = (id, componentMap) => {
  const copyObj = cloneDeep(componentMap);
  delete copyObj[id];
  copyObj[id] = componentMap[id];
  return copyObj;
};

function ResizeWrapper(props) {
  const {
    containerProps,
    model,
    index,
    style,
    className,
    id,
    updateConatainerPropsStyle,
    updateSelectComponentAndOrderMap,
    addRecord,
  } = props;

  const {
    componentMap,
    selectComponentId,
  } = model;

  const wrapper = useRef<any>({});
  const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = wrapper.current;
  const isSelected = id && id === selectComponentId;

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
        // top: Math.round(offsetTop - distanceY),
      },
      r: {
        width: Math.round(offsetWidth + distanceX),
      },

      b: {
        height: Math.round(offsetHeight + distanceY),
      },
    };

    updateConatainerPropsStyle({
      key: id,
      ...newPropsByPos[position],
    });
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const orderMap = updateComponentMapOrder(id, componentMap);
    const { x: startX, y: startY } = getClientPosByEvent(e);
    const left = e.currentTarget.offsetLeft;
    const top = e.currentTarget.offsetTop;

    updateSelectComponentAndOrderMap(id, orderMap);
    const move = (moveEvent) => {
      const { x: curX, y: curY } = getClientPosByEvent(moveEvent);
      const curLeft = curX - startX + left;
      const curTop = curY - startY + top;
      updateConatainerPropsStyle({
        key: id,
        left: curLeft,
        top: curTop,
      });
    
    
    };

    const up = () => {
      addRecord();
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  return (
    <div
      ref={wrapper}
      key={id}
      className={cls({
        [className]: true,
        [styles.selected]: isSelected,
      })}
      style={{
        position: "absolute",
        cursor: "move",
        ...style,
        zIndex: index,
        ...containerProps.style,
        width: containerProps.style.width,
        height: containerProps.style.height,
      }}
      onMouseDown={handleMouseDown}
      onDragOver={(e) => e.preventDefault()}
    >
      {isSelected &&
        circleProps.map((circleProp) => {
          return (
            <Circle
              addRecord={addRecord}
              updateComponentItemByPos={updateComponentItemByPos}
              key={circleProp.position}
              {...circleProp}
            />
          );
        })}
      {props.children}
    </div>
  );
}

export default connect(
  (state) => ({
    model: state
  }),
  (dispatch) => ({
    updateConatainerPropsStyle: (val) =>
      dispatch({
        type: "updateConatainer",
        payload: val,
      }),
      updateSelectComponentAndOrderMap: (selectComponentId, componentMap) =>
      dispatch(
        changeState(
          {
            selectComponentId,
            componentMap,
          },
        )
      ),
      addRecord: () => dispatch(saveRecords()),
  })
)(ResizeWrapper);
