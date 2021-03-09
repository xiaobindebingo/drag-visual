import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import store from './store';
import {Provider} from 'react-redux';
import "./styles/index.scss";
import Header from './views/Header';
import ComponentList from './views/ComponentPanel';
import Editor from './views/Editor';
import AttributePanel from './views/AttributePanel';
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
      </div>
    </div>
  )
}


ReactDOM.render(
  <Provider store={store}>
    <Parent />
  </Provider>
, document.getElementById("root"));