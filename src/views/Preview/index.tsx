import React from 'react';
import { Dialog } from '@ali/wind';
import { connect } from 'react-redux';
import { changeState } from '../../utils';

function Preview(props) {
  const {
    model,
    updateState,
  } = props;
  const { 
    previewVisible,
    canvasWidth,
    canvasHeight,
    componentMap,
  } = model;
  if(!previewVisible) {
    return null;
  }

  return (
    <Dialog 
    visible={previewVisible}
    title="预览"
    onClose={
      () => updateState({
        ...model,
        previewVisible: false,
      })
    }
    >
      <div
        style={{
          width: canvasWidth,
          height: canvasHeight,
        }}
      >
      {JSON.stringify(componentMap)}
      </div>
    </Dialog>
  )
}

export default connect(
  state => ({
    model: state,
  }),
  dispatch => ({
    updateState: (val) => dispatch(changeState(val))
  })
)(Preview)