import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { RootState } from '../store';

/**
 * A hook that is a typed version of the `useSelector` hook
 *
 * @returns The `useAppSelector` hook
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
