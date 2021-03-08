import React, { useState } from 'react';
import ss from 'classnames';
import './alert.scss';
export type AlertType = 'success'|'danger'|'warning'|'default'
interface baseAlertProps{
    className?: string,
    alertType?: AlertType,
    children: React.ReactNode,
    title: React.ReactNode,
    closeble: Boolean,
}
export type AlertProps =  Partial<baseAlertProps & React.HTMLAttributes<HTMLElement>>;
const Alert: any = (props)=>{
    const [open, setOpen] = useState<Boolean>(true);
    const {className, alertType ,children, title} = props;
    const klass = ss('alert', className, {
        [`alert-${alertType}`]: alertType,
        
    })
    return ( open ? <div className={klass}>
        <div className="alert-message">{title} { props.closeble && <span className="alert-close" onClick={()=>setOpen(false)}>关闭</span>}</div>
            <div className='alert-content'>{children}</div>
            </div> : null)
}
Alert.defaultProps = {
    alertType: 'default',
    
}
export { Alert }
export default Alert;