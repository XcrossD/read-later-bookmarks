import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface IPocket {
  access_token?: string;
  username?: string;
}

interface pocketState {
  pocket: IPocket;
  status: string;
  error: string | null | undefined;
}

const initialState: pocketState = {
  pocket: {},
  status: 'idle',
  error: null
}

const pocketSlice = createSlice({
  name: 'pocket',
  initialState,
  reducers: {
    
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPocket.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPocket.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.pocket = action.payload.pocket;
      })
      .addCase(fetchPocket.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
});

export const fetchPocket = createAsyncThunk('bookmarks/fetchPocket', async () => {
  const pocket = await chrome.storage.local.get('pocket');
  return pocket;
});

export default pocketSlice.reducer;