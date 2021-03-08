import React, { useRef } from "react";
import { connect } from "react-redux";
import {
  changeState,
  getElementByType,
} from "../../../utils";
import ResizeWrapper from '../ResizeWrapper';


function Element(props) {
  const {
    id,
    item: { type, componentProps, containerProps, parentId},
  } = props;
  const Component = getElementByType(type);
  return (
    <ResizeWrapper containerProps={containerProps} id={id} parentId={parentId} >
      <Component {...componentProps} >
        </Component>
        {props.children}
    </ResizeWrapper>
  );
}

export default connect(
  (state) => state,
)(Element);
