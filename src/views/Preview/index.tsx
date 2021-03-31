import React from 'react';
import { connect } from 'react-redux';

import { Dialog } from '@ali/wind';

import { GROUP } from '../../constants';
import { changeState, plainDatatoTree, getElementByType } from '../../utils';

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

  if (!previewVisible) {
    return null;
  }

  const transferData = plainDatatoTree(componentMap);

  const renderElement: (transferData: any) => any = data => {
    if (!data) {
      return null;
    }

    return Object.keys(data).map(id => {
      const { type, containerProps, componentProps, children } = data[
          id
      ];
      const Component = getElementByType(type);

      const renderComponent = () => {
        // group渲染
        if (type === GROUP) {
          return renderElement(children);
        }

        // 独立component渲染
        if (type !== GROUP) {
          return (
            <Component
              {...componentProps} />
          );
        }

        return null;
      };

      return (
        <div
          key={id}
          style={{
            position: 'absolute',
            ...containerProps.style,
            transform: `rotate(${containerProps.style.rotate}deg)`
          }}>
          {renderComponent()}
        </div>
      );
    });
  };

  const closeDialog = () =>
    updateState({
      ...model,
      previewVisible: false,
    });

  return (
    <Dialog
      visible={previewVisible}
      title="预览"
      onClose={closeDialog
      }
      onCancel={closeDialog}
      onOk={closeDialog}>
      <div
        style={{
          position: 'relative',
          width: canvasWidth,
          height: canvasHeight,
        }}>
        {renderElement(transferData)}
      </div>
    </Dialog>
  );
}

export default connect(
    state => ({
      model: state,
    }),
    dispatch => ({
      updateState: val => dispatch(changeState(val)),
    })
)(Preview);
