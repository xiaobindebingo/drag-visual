import ComponentStore from "./resourceCenter/componentStore";
import cloneDeep from 'lodash/cloneDeep';

export function changeBatchState(obj) {
    return {
      type: 'save',
      payload: obj,
    }

}

export function changeState(key, newVal?) {

  if (Object.prototype.toString.call(key) === "[object Object]") {
    return {
      type: 'save',
      payload: key,
    }
  }
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
      result[key] = mixinObject(oldObj[key], newObj[key]);
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

const pxToPercent = val => `${val * 100}%`;
const percentToPx = (val, percent) => {
  const ratio = percent.match(/\d+/g)[0] / 100;
  return val * ratio;
}
/**
 * @description 绝对坐标 -> 相对坐标
 * @param containerPropsStyle 布局盒样式
 * @param innterPropsStyle innterPropsStyle
 * @returns 
 */
export const absoluteToRealtiveCoordinate = (innterPropsStyle, containerBox) => {
  if (!innterPropsStyle) {
    return { top: 0, left: 0, width: 0, height: 0 };
  }
  const { top, left, width, height } = innterPropsStyle;
  const result = {
    left: pxToPercent((left - containerBox.left) / containerBox.width),
    top: pxToPercent((top - containerBox.top) / containerBox.height),
    width: pxToPercent((width / containerBox.width)),
    height:  pxToPercent((height / containerBox.height)),
  };
  return result;
};

export const realtiveToAbsoluteCoordinate = (innterPropsStyle, containerBox) => {

  const { top, left, width, height } = innterPropsStyle;
  const result = {
    left: percentToPx(containerBox.width,left) + containerBox.left,
    top: percentToPx(containerBox.height, top) + containerBox.top,
    width: percentToPx(containerBox.width, width),
    height: percentToPx(containerBox.height, height),
  }

  return  result;
}

export const plainDatatoTree = componentMap => {
  const uuids = Object.keys(componentMap);
  const copyComponentMap = cloneDeep(componentMap)
  uuids.forEach(id => {
    const { parentId } = copyComponentMap[id];
    if (parentId) {
      if(copyComponentMap[parentId].children) {
        copyComponentMap[parentId]['children'][id] = copyComponentMap[id]
      } else {
        copyComponentMap[parentId]['children'] = {
          [id]: copyComponentMap[id]
        }
      }
      delete copyComponentMap[id];
    }
  });
  return copyComponentMap;
}
