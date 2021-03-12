import React from "react";
import ReactDOM from "react-dom";
import Stats from 'stats-js';
import store from './store';
import {Provider} from 'react-redux';
import Header from './views/Header';
import ComponentList from './views/ComponentPanel';
import Editor from './views/Editor';
import AttributePanel from './views/AttributePanel';
import Preview from './views/Preview';
import styles from './index.module.css';
import '@ali/wind/dist/wind.min.css';

const Parent = () => {

  return (
    <div className={styles.container}>
      <Header></Header>
      <div className={styles.content}>
        <ComponentList />
        <div className={styles.editor}>
          <Editor />
        </div>
        <AttributePanel />
        <Preview />
      </div>
    </div>
  )
}


ReactDOM.render(
  <Provider store={store}>
    <Parent />
  </Provider>
, document.getElementById("root"));

const stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

function animate() {
 
    stats.begin();
 
    stats.end();
 
    requestAnimationFrame( animate );
 
}
 
requestAnimationFrame( animate );