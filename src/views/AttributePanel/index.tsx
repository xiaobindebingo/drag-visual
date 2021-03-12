import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Input, Button } from '@ali/wind';
import styles from "./index.module.scss";

function AttributePanel(props) {
  const { selectComponentId, componentMap } = props;
  const {
    containerProps,
    componentProps,
  } = componentMap[selectComponentId] || {};

  return (
    selectComponentId && 
    <div className={styles.attributePanel}>
      x: {containerProps.style.left}
      y: {containerProps.style.top}
      width: {containerProps.style.width}
      height: {containerProps.style.height}
      {/* <Input.TextArea
        rows={20}
        value={JSON.stringify(containerProps)} 
        // onChange= {handleChange}
      /> */}
    </div>
  );
}

export default connect((state) => state, (dispatch)=>({
  changeComponentAttribute: (val,id) => {
    dispatch({
      type: 'updateComponent',
      payload: {key: id, itemProps:val }
    })
  }
}))(AttributePanel);
