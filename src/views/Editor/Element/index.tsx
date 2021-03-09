import React from "react";
import { connect } from "react-redux";
import { getElementByType } from "../../../utils";
import ResizeWrapper from "./ResizeWrapper";

  // 独立模式下： 没有parentId && 没有children
  // 组合模式下： 顶层group 中间层group，底层component
  //    顶层group：无parentId，type类型是group，
  //    中间层group： 有parentId，type是group 有children
  //    底层Component： 有parentId， 无children
function Element(props) {
  const {
    id,
    index,
    item: { type, componentProps, containerProps, parentId },
    children,
  } = props;
  const Component = getElementByType(type);
  // 独立模式下的Component渲染
  if(!containerProps) {
    return null;
  }
  if (!parentId && !children) {
    return (
      <ResizeWrapper
        index={index}
        containerProps={containerProps}
        id={id}
      >
        <Component {...componentProps} />
      </ResizeWrapper>
    );
  }
  // 组合模式下顶层Group渲染
  if (!parentId && type === "group") {
    return (
      <ResizeWrapper
        containerProps={containerProps}
        id={id}
      >
        <Component 
          {...componentProps}
        >
          {React.Children.map(children, (child)=>{
            return (
              <div style={{ position: 'absolute', zIndex: -1}}>
                {child}
              </div>
            )
          })}
        </Component>
      </ResizeWrapper>
    );
  }
 // 组合模式下 中间层group渲染
  if (parentId && type === "group" && children && children.length > 0) {
    return (
      <div
        style={{
          position: "absolute",
          cursor: "move",
          ...containerProps.style,
        }}
      >
        {children}
      </div>
    );
  }

  // 组合模式下，内含的Component渲染
  if (parentId && !children) {
    return (
      <div
      style={{
        position: "absolute",
        cursor: "move",
        ...containerProps.style,
      }}
    >
      <Component {...componentProps} />
    </div>
    )
  }
}

export default connect((state) => state)(Element);
