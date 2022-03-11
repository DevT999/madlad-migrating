import { useDispatch } from 'react-redux';

import { AppDispatch } from '../store';

/**
 * A hook that is a typed version of the `useDispatch` hook
 *
 * @returns The `useAppDispatch` hook
 */
export function useAppDispatch() {
  return useDispatch<AppDispatch>();
}
