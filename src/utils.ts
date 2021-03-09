import ComponentStore from "./resourceCenter/componentStore";

export function changeBatchState(obj) {
    return {
      type: 'save',
      payload: obj,
    }

}

export function changeState(key, newVal?) {
  if (Array.isArray(key)) {
    const payload = key.reduce((prev ,cur)=>{
      return {
        ...prev,
        ...cur,
      }
    }, {});

    return {
      type: 'save',
      payload,
    }
  }
  return {
    type: 'save',
    payload: {[key]: newVal}
  }
}


export function getClientPosByEvent(e) {
  return {
    x: e.clientX,
    y: e.clientY,
  }
}

export function getElementPosByEvent(e: React.DragEvent) {
  return {
    left: e.nativeEvent.offsetX,
    top: e.nativeEvent.offsetY,
  };
}

export function getElementByType(type) {
    const Component = ComponentStore[type];
    if (Component) return Component;
    return {};
}

export function mixinObject (oldObj, newObj) {
  const result = {...oldObj};
  Object.keys(newObj).forEach(key => {
    if(typeof oldObj[key] !== newObj[key]) {
      throw new Error(`新的对象${key}与原有对象类型不符`);
    }
    if(!oldObj[key]) {
      result[key] = newObj[key]
    }
    if (typeof oldObj[key] === 'object' && typeof newObj[key] === 'object') {
      result[key] = mixinObject(oldObj[key], newObj[key])
    }
    if(typeof oldObj[key] !== 'object' && typeof newObj[key] !== 'object') {
      result[key] = newObj[key];
    }
  })
  return result;
}

export function findDOMByEventAndId(e,id) {
  let element;
  if (e.target) {
    element = e.target;
  } else if (e.parentNode) {
    element = e.parentNode
  }
  if(element.id !== id) {
    return findDOMByEventAndId(element, id)
  } else {
    return element;
  }
}
/**
 * @description 绝对坐标 -> 相对坐标
 * @param containerPropsStyle 布局盒样式
 * @param containerBox container
 * @returns 
 */
export const absoluteToRealtiveCoordinate = (containerPropsStyle, containerBox) => {
  if (!containerPropsStyle) {
    return { top: 0, left: 0, width: 0, height: 0 };
  }
  const { top, left, width, height } = containerPropsStyle;
  return {
    left: left - containerBox.left,
    top: top - containerBox.top,
    width,
    height,
  };
};

export const realtiveToAbsoluteCoordinate = (containerPropsStyle, containerBox) => {
  console.log(containerBox,'gggg')
  const { top, left, width, height } = containerPropsStyle;
  return {
    left: left + containerBox.left,
    top: top + containerBox.top,
    width,
    height,
  };
}