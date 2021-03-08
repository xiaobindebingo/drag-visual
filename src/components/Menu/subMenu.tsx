import React, { ReactElement, useState } from 'react';
import {IMenuItemProps} from './menuItem';
import classNames from 'classnames';
import './index.scss';
export interface ISubMenu{
    index?: string,
    title?: React.ReactNode,
}
export const SubMenu: React.FC<ISubMenu>  = (props)=>{
    const { index,children, title } = props;
    const [show, setShow] = useState<boolean>(false);
    const renderChidren = ()=>{
        return React.Children.map(children,(child,i)=>{
            const childElement = child as React.FunctionComponentElement<IMenuItemProps>;
            if(childElement.type.displayName === 'menuItem'){
                return React.cloneElement(childElement,{
                    index: `${index}-${i}`
                })
            }else{
                console.error('subMenu has an element which is not a MenuItem');
            }
          
        })
    }
    const cls = classNames({
        show: show,
        hide: !show,
        subChild:true,
    })
    return <div className='subMenu'>
        <div className="subMenuTitle" onClick={()=>{
            setShow(!show)
        }}>
        { title }
        </div>
        <div className={cls}>
            {renderChidren()}
        </div>
 
    </div>

}
SubMenu.displayName = 'subMenu';