import React from 'react';
import { connect } from 'react-redux';

import styles from './index.module.scss';

function AttributePanel(props):React.ReactElement {
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
      rotate: {containerProps.style.rotate}
      {/* <Input.TextArea
        rows={20}
        value={JSON.stringify(containerProps)} 
        // onChange= {handleChange}
      /> */}
    </div>
  );
}

export default connect(state => state, dispatch => ({

}))(AttributePanel);
