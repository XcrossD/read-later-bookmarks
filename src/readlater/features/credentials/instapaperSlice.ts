import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface IInstapaper {
  username?: string;
  password?: string;
}

interface instapaperState {
  instapaper: IInstapaper;
  status: string;
  error: string | null | undefined;
}

const initialState: instapaperState = {
  instapaper: {},
  status: 'idle',
  error: null
}

const instapaperSlice = createSlice({
  name: 'instapaper',
  initialState,
  reducers: {
    
  },
  extraReducers(builder) {
    builder
      .addCase(fetchInstapaper.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchInstapaper.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.instapaper = action.payload.instapaper;
      })
      .addCase(fetchInstapaper.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
});

export const fetchInstapaper = createAsyncThunk('bookmarks/fetchInstapaper', async () => {
  const instapaper = await chrome.storage.local.get('instapaper');
  return instapaper;
});

export default instapaperSlice.reducer;