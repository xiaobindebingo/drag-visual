import React from "react";
import { Dialog } from "@ali/wind";
import { connect } from "react-redux";

import { changeState, plainDatatoTree, getElementByType } from "../../utils";
import { GROUP } from "../../constants";

function Preview(props) {
  const { model, updateState } = props;
  const { previewVisible, canvasWidth, canvasHeight, componentMap } = model;
  if (!previewVisible) {
    return null;
  }

  const transferData = plainDatatoTree(componentMap);

  const renderElement = (transferData) => {
    if (!transferData) {
      return null;
    }
    return Object.keys(transferData).map((id, index) => {
      const { type, containerProps, componentProps, children } = transferData[
        id
      ];
      const Component = getElementByType(type);

      const renderComponent = () => {
        //group渲染
        if (type === GROUP) {
          return renderElement(children);
        }

        // 独立component渲染
        if (type !== GROUP) {
          return <Component {...componentProps} />;
        }

        return null;
      };

      return (
        <div key={id} style={{ position: "absolute", ...containerProps.style }}>
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
      onOk={closeDialog}
    >
      <div
        style={{
          position: "relative",
          width: canvasWidth,
          height: canvasHeight,
        }}
      >
        {renderElement(transferData)}
      </div>
    </Dialog>
  );
}

export default connect(
  (state) => ({
    model: state,
  }),
  (dispatch) => ({
    updateState: (val) => dispatch(changeState(val)),
  })
)(Preview);
