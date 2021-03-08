
const initialState = {

  componentMap: {},  // {uuid: {type:'componentType', containerProps, componentProps}}
  canvasWidth: 1200,
  canvasHeight: 750,
  scale: 100,
  selectComponentId: '',
  containIds: [],
  areaPos: {
    startPos:{
      left: 0,
      top: 0,
    },
    endPos: {
      left: 0,
      top: 0,
    } 
  }, 

        
}

function reducer(state = initialState, action) {
  if (typeof state === 'undefined') {
    return {}
  }
  if (action.type === 'save') {
    return {
      ...state,
      ...action.payload,
    }
  }

  if (action.type === 'updateComponent') {
    const {key, ...restProps } = action.payload;

    const result  =JSON.parse(restProps.itemProps);
    console.log(result,'restProps')
    return {
      ...state,
      componentMap: {
        
        ...state.componentMap,
        [key]: {
          ...state.componentMap[key],
          ...result
        },
      }
    }
  }

  if (action.type === 'updateConatainer') {
    const { key,...restProps } = action.payload;

    return {
      ...state,
      componentMap: {
        ...state.componentMap,
        [key]: {
          ...state.componentMap[key],
          containerProps: {
            ...state.componentMap[key]['containerProps'],
            style: {
              ...state.componentMap[key]['containerProps']['style'],
              ...restProps,
            }
          }
        }
      }
    }
  }

  if (action.type === 'updateCurComponentPos') {
    const { payload } = action;
    const {left, top} = payload;
    const { selectComponentId: id } = state;
    return {
      ...state,
      componentMap: {
        ...state.componentMap,
        [id]: {
          ...state.componentMap[id],
          containerProps: {
            ...state.componentMap[id]['containerProps'],
            style: {
              ...state.componentMap[id]['containerProps']['style'],
              left,
              top,
            }
          }
        }
      }
    }
  }
  // 这里暂不处理任何 action，
  // 仅返回传入的 state。
  return state
}

export default reducer;