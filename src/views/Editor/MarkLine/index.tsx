import React, { useState, useEffect } from "react";
import cls from "classnames";
import useDeepCompareEffect from 'use-deep-compare-effect';
import { connect } from "react-redux";
// import events from "../../../eventbus";
import styles from "./index.module.scss";

const diff = 3;
const initlineArr = [
  {
    type: "xt",
    show: false,
    left: 0,
    top: 0,
  },
  {
    type: "xc",
    show: false,
    left: 0,
    top: 0,
  },
  {
    type: "xb",
    show: false,
    left: 0,
    top: 0,
  },
  {
    type: "yl",
    show: false,
    left: 0,
    top: 0,
  },
  {
    type: "yc",
    show: false,
    left: 0,
    top: 0,
  },
  {
    type: "yr",
    show: false,
    left: 0,
    top: 0,
  },
];

function MarkLine(props) {
  const [lineArr, setLineArr] = useState(initlineArr);
  const { componentMap, selectComponentId, updateCurComponentPos } = props;

  const isNearly = (dragVal, targetVal) =>
    Math.abs(dragVal - targetVal) <= diff;

  const getCurrentComponentsPosition = () => {
    const currentComponent = componentMap[selectComponentId] || {};
    const { containerProps } = currentComponent || {};
    const { style } = containerProps || {};
    const { top: curTop, left: curLeft, width, height } = style || {};
    const curBottom = curTop + height;
    const curRight = curLeft + width;

    return {
      curTop,
      curLeft,
      curBottom,
      curRight,
      curWidth: width,
      curHeight: height,
    };
  };

  const updateLineArr = ({ type, left, top, show = true }) => {
    setLineArr((prev) => {
      return prev.map((item) => {
        if (item.type === type) {
          return {
            ...item,
            show,
            top,
            left,
          };
        }
        return item;
      });
    });
  };

  const {
    curTop,
    curLeft,
    curBottom,
    curRight,
    curWidth,
    curHeight,
  } = getCurrentComponentsPosition();

  const hideLine = () => {
    setLineArr(initlineArr);
  };

  useDeepCompareEffect(() => {
    Object.keys(componentMap).forEach((id) => {
      const { containerProps } = componentMap[id];
      // 当前组件被组合组件包括，或者选中的组件是当前组件不显示markline
      if (id === selectComponentId || componentMap[id]['parentId']) return;
      const { top, left, width, height } = containerProps.style;
      const right = left + width;
      const bottom = top + height;
      const centerPos = { left: left + width / 2, top: top + height / 2 };
      const curCenterPos = {
        left: curLeft + curWidth / 2,
        top: curTop + curTop / 2,
      };

      if (isNearly(curCenterPos.top, centerPos.top)) {
        updateLineArr({
          type: "xc",
          top: centerPos.top,
          left: 0,
        });
        updateCurComponentPos({
          top: top - (curHeight - height) / 2,
          left: curLeft,
        });
      }

      if (isNearly(curCenterPos.left, centerPos.left)) {
        updateLineArr({
          type: "yc",
          top: 0,
          left: centerPos.left,
        });

        updateCurComponentPos({
          top: curTop,
          left: left - (curWidth - width) / 2,
        });
      }

      if (isNearly(curCenterPos.left, centerPos.left)) {
        updateLineArr({
          type: "yc",
          left: curCenterPos.left,
          top: 0,
        });
      }
      // 两个盒子top接近时
      if (isNearly(curTop, top) || isNearly(curBottom, top)) {
        updateLineArr({
          type: "xt",
          top,
          left: 0,
        });

        if (isNearly(curTop, top)) {
          updateCurComponentPos({
            top,
            left: curLeft,
          });
        }

        if (isNearly(curBottom, top)) {
          updateCurComponentPos({
            top: top - curHeight,
            left: curLeft,
          });
        }
      }

      if (isNearly(curLeft, left) || isNearly(curRight, left)) {
        updateLineArr({
          type: "yl",
          left,
          top: 0,
        });

        if (isNearly(curLeft, left)) {
          updateCurComponentPos({
            left,
            top: curTop,
          });
        }

        if (isNearly(curRight, left)) {
          updateCurComponentPos({
            left: left - curWidth,
            top: curTop,
          });
        }
      }
      // 当right接近时 ||  当dragElement left接近 element右边时
      if (isNearly(curRight, right) || isNearly(curLeft, right)) {
        updateLineArr({
          type: "yr",
          left: right,
          top: 0,
        });

        if (isNearly(curRight, right)) {
          updateCurComponentPos({
            left: right - curWidth,
            top: curTop,
          });
        }

        if (isNearly(curLeft, right)) {
          updateCurComponentPos({
            left: right,
            top: curTop,
          });
        }
      }

      if (isNearly(curBottom, bottom) || isNearly(curTop, bottom)) {
        updateLineArr({
          type: "xb",
          left: 0,
          top: bottom,
        });

        if (isNearly(curBottom, bottom)) {
          updateCurComponentPos({
            left: curLeft,
            top: top + height - curHeight,
          });
        }

        if (isNearly(curTop, bottom)) {
          updateCurComponentPos({
            left: curLeft,
            top: height + top,
          });
        }
      }
    });
  }, [curTop, curLeft, curRight, componentMap]);

  useEffect(() => {
    document.addEventListener("mouseup", hideLine);
    return () => {
      document.removeEventListener("mouseup", hideLine);
    };
  }, []);

  return (
    <div className={styles.markline}>
      {lineArr.map(({ left, top, show, type }) => (
        <div
          style={{
            left,
            top,
          }}
          key={type}
          className={cls({
            [styles.hide]: !show,
            [styles.hor]: type.includes("x"),
            [styles.ver]: type.includes("y"),
            [styles.line]: true,
          })}
        />
      ))}
    </div>
  );
}

export default connect(
  (state) => state,
  (dispatch) => ({
    updateCurComponentPos: (val) =>
      dispatch({ type: "updateCurComponentPos", payload: val }),
  })
)(MarkLine);
