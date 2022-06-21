import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IOptions, DEFAULT_SETTINGS } from '../../../options/App';

interface OptionsState {
  options: IOptions;
  status: string;
  error: string | null | undefined;
}

const initialState: OptionsState = {
  options: DEFAULT_SETTINGS,
  status: 'idle',
  error: null
}

const optionsSlice = createSlice({
  name: 'options',
  initialState,
  reducers: {
    
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOptions.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchOptions.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.options = action.payload;
      })
      .addCase(fetchOptions.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
});

export const fetchOptions = createAsyncThunk('bookmarks/fetchOptions', async () => {
  const options = await chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS)) as IOptions;
  return options;
});

export default optionsSlice.reducer;