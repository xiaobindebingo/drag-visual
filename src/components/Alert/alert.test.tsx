import React from 'react';
import Alert, { AlertProps, AlertType } from './Alert';
import { render, fireEvent} from '@testing-library/react';
interface IAlertProps<T> {
    alertType?: T,
    title?: string
}
const defaultProps: IAlertProps<AlertType> = {
    alertType: 'default',
    title: '我是标题'
}
describe('test alert', ()=>{
    it('show a default alert',()=>{
        const wrapper = render(<Alert title="123" {...defaultProps}>Alert</Alert>);
        const element = wrapper.getByText('Alert') as HTMLElement;
        expect(element).toBeInTheDocument();
    })
})