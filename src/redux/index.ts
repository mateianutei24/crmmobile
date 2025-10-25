import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import locationReducer from './slices/locationSlice';
import callLogsReducer from './slices/callLogsSlice';
import statisticsReducer from "./slices/statisticsSlice";
import visitsReducer from "./slices/visitsSlice"
import configReducer from "./slices/configSlice"

import logger from 'redux-logger';

const rootReducer = combineReducers({
  auth: authReducer,
  location: locationReducer,
  callLogs: callLogsReducer,
  visits: visitsReducer,
  statistics: statisticsReducer,
  config: configReducer,
});


export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
});


export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof rootReducer>