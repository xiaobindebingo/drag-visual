
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Button, { ButtonType } from './index';
interface IlinkProps<T> {
    href?:string,
    btnType?: T
}
const linkProps:IlinkProps<ButtonType> = {
    href: 'https://www.baidu.com',
    btnType:'link'
}
describe('test Button Component', ()=>{
    it('render a link button', ()=>{
        const wrapper = render(<Button data-testid="linkbtn" {...linkProps}>Link</Button>)
        const element = wrapper.getByTestId('linkbtn');
        // expect(element).toBeInTheDocument();
        expect(element.tagName).toEqual('A');
        expect(element).toHaveClass('btn btn-middle btn-link')
        
    })
    it('render a default button', ()=>{
        const wrap = render(<Button {...defaultProps}>nice</Button>);
        const element = wrap.getByText('nice') as HTMLButtonElement;
        expect(element).toBeInTheDocument();
        expect(element.tagName).toEqual('BUTTON');
        expect(element.className).toEqual('btn btn-middle btn-default');
        fireEvent.click(element);
        expect(defaultProps.onClick).toBeCalled();
    })
    it('render a disabled default button', ()=>{
        const wrap = render(<Button {...disabledProps} {...defaultProps}>disabled</Button>);
        const element = wrap.getByText('disabled') as HTMLButtonElement;
        expect(element.className).toEqual('btn btn-middle disabled btn-default');
        expect(element).toBeDisabled();
    })
 
    it('should render disabled button when disabled set to true', () => {
        const wrapper = render(<Button {...disabledProps}>Nice</Button>)
        const element = wrapper.getByText('Nice') as HTMLButtonElement
        expect(element).toBeInTheDocument()
        expect(element.disabled).toBeTruthy()
        fireEvent.click(element)
        expect(disabledProps.onClick).not.toHaveBeenCalled()
      })
});