import * as actionTypes from './actionType';

export const SAVE = (payload) => ({type: actionTypes.SAVE, payload});

export const saveRecords = () => ({ type: actionTypes.SAVE_RECORDS });

export const cancelRecords = (payload) => ({ type: actionTypes.CANCEL_RECORDS , payload});

export const redoRecords = () => ({
  type: actionTypes.REDO,
});

export const updateCurContainerStyleAction = (payload) => ({
  type: actionTypes.UPDATE_CURCONTAINER_STYLE,
  payload,
});

export const toggleLockAction = payload => ({
  type: actionTypes.TOGGLE_LOCK,
  payload,
})

