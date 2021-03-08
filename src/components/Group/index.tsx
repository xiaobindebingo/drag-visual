import React from 'react';
import styles from './index.module.scss';

function Group() {
  return (
    <div
      className={styles.group}
      style={{
        width: '100%',
        height: '100%',
        zIndex: 99999,
      }}
     />
  )
}

export default Group;
