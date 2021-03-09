import React from "react";
import { connect } from "react-redux";
// import ResizeWrapper from "../ResizeWrapper";
// import { IArea } from "../../../interface";

function Area(props) {
  const { 
    areaPos: {
      startPos, 
      endPos,
    },
    // containerProps,
    // selectComponentId,
    // updateConatainerPropsStyle,
    // updateSelectComponent, 
  } = props;
  const width = Math.abs(endPos.left - startPos.left);
  const height = Math.abs(endPos.top - startPos.top);
  let boxLeft = endPos.left > startPos.left ? startPos.left : endPos.left;
  let boxTop = endPos.top > startPos.top ? startPos.top : endPos.top;
  if (!width || !height) {
    return null;
  }

  return (
      <div
        style={{
          zIndex: 999999,
          position: "absolute",
          width,
          height,
          left: boxLeft,
          top: boxTop,
          border: "1px solid #409eff",
        }}
      />
  );
}

export default connect((state) => state)(Area);
