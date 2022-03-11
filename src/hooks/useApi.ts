import React, { useRef } from 'react';

import axios, { AxiosInstance } from 'axios';

/**
 * An instance of axios to communicate with the API
 */
const instance = axios.create({
  baseURL:
    process.env.REACT_APP_TESTNET === 'true'
      ? process.env.REACT_APP_API_T
      : process.env.REACT_APP_API_M,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * A hook that provides access to the back-end API
 *
 * @returns The `useApi` hook
 */
export function useApi(): AxiosInstance {
  /**
   * Stores the API in a reference
   */
  const { current: api } = useRef(instance);

  return api;
}
