import React, {useContext} from "react";
import { MenuContext } from "./context";

export interface IMenuItemProps {
    index?: string,
}
export const MenuItem: React.FC<IMenuItemProps> = (props) => {
  const { children, index } = props;
  const { handleClick } = useContext(MenuContext);
 
  return <div onClick={()=>{
      if(index && handleClick){
        handleClick(index)
      }
  }}>{children}</div>;
};

MenuItem.displayName = 'menuItem';