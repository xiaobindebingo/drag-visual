import React from 'react';
import ComponentStore from '../../resourceCenter/componentStore';
import { connect } from 'react-redux';
import styles from './index.module.scss';

function ComponentPanel(props) {
  return (
    <div className={styles.componentList}>
      {
      Object.keys(ComponentStore).map(key=> {
        const component = ComponentStore[key];
        return (
          <div 
          className={styles.cell} 
          key={key} 
          draggable 
          onDragStart={
            (e) => e.dataTransfer.setData('type', key)
          }>
            <img src={component?.config?.icon} />
            <br/>
            <div className={styles.text}>{component?.config?.text}</div>
          </div>
        )
      }
        
      )}
     

    </div>
  )
}

export default connect((state)=>state,()=>({}))(ComponentPanel);