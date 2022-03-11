import {
  combineReducers,
  configureStore,
  EnhancedStore,
} from '@reduxjs/toolkit';

import { appReducer } from 'features';
import { contractsReducer } from 'features/contracts';

/**
 * An object which stores all the reducers in the application
 */
const reducers = combineReducers({
  app: appReducer,
  contracts: contractsReducer,
});

/**
 * A function that configures the app store
 *
 * @param initialState The initial state to use in the application
 *
 * @returns An instantiation of the application store
 */
const configureAppStore = (initialState = {}): EnhancedStore =>
  configureStore({
    reducer: reducers,
    preloadedState: initialState,
    devTools: process.env.NODE_ENV !== 'production',
  });

/**
 * An instance of the application store
 */
export const store = configureAppStore();

/**
 * A type that returns a dispatch of store
 */
export type AppDispatch = typeof store.dispatch;

/**
 * A type that retrieves the return type of the root state
 */
export type RootState = ReturnType<typeof reducers>;
