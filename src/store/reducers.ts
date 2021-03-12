import * as actionTypes from "./actionType";
import record from "./record";

function reducer(state = record.list[0], action) {

  if (action.type === actionTypes.SAVE) {
    return {
      ...state,
      ...action.payload,
    };
  }
  
  // 更新componentContainerStyle属性
  if (action.type === actionTypes.UPDATE_CURCONTAINER_STYLE) {
    const { payload } = action;
    const { selectComponentId: id } = state;
    return {
      ...state,
      componentMap: {
        ...state.componentMap,
        [id]: {
          ...state.componentMap[id],
          containerProps: {
            ...state.componentMap[id]["containerProps"],
            style: {
              ...state.componentMap[id]["containerProps"]["style"],
              ...payload,
            },
          },
        },
      },
    };
  }

  if (action.type === actionTypes.SAVE_RECORDS) {
    record.addRecord(state);
    return state;
  }

  if (action.type === actionTypes.CANCEL_RECORDS) {
    return  record.getPrevRecord();
  }

  if (action.type === actionTypes.REDO) {
    return record.getNextRecord();
  }

  return state;
}

export default reducer;
