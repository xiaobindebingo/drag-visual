import React, { useState } from 'react';

import { Provider, IMenuContext } from './context';

import { IMenuItemProps } from './menuItem';

import classnames from 'classnames';

import './index.scss';
interface IMenuProps{
   onSelect?: (index:string)=>any,
   defaultIndex?: string,
}

export const Menu: React.FC<IMenuProps> =(props)=>{
    const {children, defaultIndex = '1', onSelect} = props;
    const [index , setActiveIndex] = useState<string>(defaultIndex);
    const [show, setShow] = useState<boolean>(false)
    const handleClick = (index:string)=>{
        setActiveIndex(index);
        if(onSelect){
            onSelect(index);
        }
    }

    const inputcls = classnames({
        show,
        hide:!show,
    })
    const passedContext: IMenuContext = {
        handleClick,
        index,
    }
    const renderChidren = () => {
        return React.Children.map(children,(child,i)=>{
            const childElement = child as React.FunctionComponentElement<IMenuItemProps>;
            if(childElement.type.displayName === 'menuItem' || childElement.type.displayName==='subMenu'){
                return React.cloneElement(childElement , {
                    index: `${i}` as string,
                })
            }else{
                console.warn('Menu has an element which is not MenuItem');
            }
        })
    }
    return (
        <Provider value={passedContext}>
            <input onClick={()=>setShow(!show)} />
            <div className={inputcls}>
            {renderChidren()}
            </div>
         
        </Provider>
    )
}