import { call, put, select, takeLatest } from 'redux-saga/effects';
import { getMapSecurityUsers } from '../../services/api/mapSecurityUsers';

import {
  ACTION_GET_MAP_SECURITY_USERS_FAILED,
  ACTION_GET_MAP_SECURITY_USERS_SUCCEEDED,
} from './action';
import { ACTION_NOTIFICATION_ERROR } from '../notifications/action';

import { MESSAGES } from '../notifications/config';

import { GET_MAP_SECURITY_USERS_REQUESTED } from './types';

function* getMapSecurityUsersSaga({ mapId }) {
  try {
    const mapSecurityUsers = yield call(getMapSecurityUsers, mapId);

    yield put(ACTION_GET_MAP_SECURITY_USERS_SUCCEEDED(mapSecurityUsers));
  } catch (error) {
    const { response, message } = error;
    const errorMessage = response ? response.statusText : message;

    yield put(ACTION_GET_MAP_SECURITY_USERS_FAILED());
    yield put(ACTION_NOTIFICATION_ERROR(errorMessage));
  }
}

function* mapSecurityUsersSaga() {
  yield takeLatest(GET_MAP_SECURITY_USERS_REQUESTED, getMapSecurityUsersSaga);
}

export default mapSecurityUsersSaga;
