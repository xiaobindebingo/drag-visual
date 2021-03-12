import * as actionTypes from "./actionType";
import record, { initialState } from "./record";


function reducer(state = initialState, action) {
  if (typeof state === "undefined") {
    return {};
  }

  if (action.type === actionTypes.SAVE_RECORDS) {
    record.addRecord(state);
    return state;
  }

  if (action.type === actionTypes.CANCEL_RECORDS) {
    const curState = record.getPrevRecord();
    return curState;
  }
  if (action.type === actionTypes.REDO) {
    const curState = record.getNextRecord();
    return curState;
  }
  if (action.type === "save") {
    return {
      ...state,
      ...action.payload,
    };
  }

  if (action.type === "updateComponent") {
    const { key, ...restProps } = action.payload;

    const result = JSON.parse(restProps.itemProps);
    return {
      ...state,
      componentMap: {
        ...state.componentMap,
        [key]: {
          ...state.componentMap[key],
          ...result,
        },
      },
    };
  }

  if (action.type === "updateConatainer") {
    const { key, ...restProps } = action.payload;

    return {
      ...state,
      componentMap: {
        ...state.componentMap,
        [key]: {
          ...state.componentMap[key],
          containerProps: {
            ...state.componentMap[key]["containerProps"],
            style: {
              ...state.componentMap[key]["containerProps"]["style"],
              ...restProps,
            },
          },
        },
      },
    };
  }

  if (action.type === "updateCurComponentPos") {
    const { payload } = action;
    const { left, top } = payload;
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
              left,
              top,
            },
          },
        },
      },
    };
  }
  // 这里暂不处理任何 action，
  // 仅返回传入的 state。
  return state;
}

export default reducer;
