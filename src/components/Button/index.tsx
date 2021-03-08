import React, {
  useState,
  useEffect,
  ReactElement,
  ButtonHTMLAttributes,
} from "react";
import classNames from "classnames";
import "./button.scss";

export type ButtonType = "primary" | "warning" | "danger" | "link" | "default";
type Size = "small" | "big" | "middle";
interface IProps {
  // className?:string,
  size: Size;
  disabled: boolean;
  btnType: ButtonType;
  // children: React.ReactElement,
  children: React.ReactNode; // A ReactElement is an object with a type and props.  A ReactNode is a ReactElement, a ReactFragment, a string, a number or an array of ReactNodes, or null, or undefined, or a boolean:
  href: string;
}
type NativeButtonProps = IProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
type NativeAnchorProps = IProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;
type ButtonProps = Partial<NativeButtonProps & NativeAnchorProps>;

const Button: any = (props) => {
  const { href, size, btnType, children, className, ...restProps } = props;
  const { disabled } = props;
  const klass = classNames(
    "btn",
    className,
    {
      [`btn-${size}`]: size,
      disabled,
    },
    [`btn-${btnType}`]
  );
  if (btnType === "link" && href) {
    return (
      <a className={klass} {...restProps} href={href}>
        {children}
      </a>
    );
  }
  return (
    <button className={klass} {...restProps} disabled={disabled}>
      {children}
    </button>
  );
};

Button.defaultProps = {
  disabled: false,
  size: "middle",
  btnType: "default",
  children: 'test',
};
export default Button;
