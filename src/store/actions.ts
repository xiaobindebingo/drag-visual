import * as actionTypes from './actionType';

export const saveRecords = () => ({ type: actionTypes.SAVE_RECORDS });

export const cancelRecords = (payload) => ({ type: actionTypes.CANCEL_RECORDS , payload});

export const redoRecords = () => ({
  type: actionTypes.REDO,
})
