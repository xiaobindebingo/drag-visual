import React from 'react';
import styles from './index.module.scss';

function Group(props) {
  return (
    <div
      className={styles.group}
    >
      {props.children}
    </div>
  )
}

export default Group;
