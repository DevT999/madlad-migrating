import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

/**
 * The way the contracts state is structured
 */
interface ContractsState {
  user: string;
  signer: ethers.Signer | undefined;
  connected: boolean;
}

/**
 * The initial values of the `Contracts` state
 */
const initialState: ContractsState = {
  user: '',
  signer: undefined,
  connected: false,
};

/**
 * The slice which handles the state management logic
 */
const contractsSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
    },
  },
});

/**
 * The actions which are available
 */
export const { setUser } = contractsSlice.actions;

/**
 * A reference to the reducer
 */
export const contractsReducer = contractsSlice.reducer;
