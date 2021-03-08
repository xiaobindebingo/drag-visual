import {createContext} from 'react';

export interface IMenuContext {
    handleClick?: (index:string)=>any;
    index?: string,
}
export const MenuContext = createContext<IMenuContext>({});
export const {Provider} = MenuContext;