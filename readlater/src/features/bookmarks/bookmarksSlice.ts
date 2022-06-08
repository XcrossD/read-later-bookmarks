import { createSlice, nanoid, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface BookmarksState {
  bookmarks: Array<chrome.bookmarks.BookmarkTreeNode>;
  status: string;
  error: string | null | undefined;
}

const initialState: BookmarksState = {
  bookmarks: [],
  status: 'idle',
  error: null
}

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    
  },
  extraReducers(builder) {
    builder
      .addCase(fetchBookmarks.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        state.bookmarks = state.bookmarks.concat(action.payload)
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export const fetchBookmarks = createAsyncThunk('bookmarks/fetchBookmarks', async (arg, { getState }) => {
  const state = getState() as RootState;
  console.log(state);
  if (state.readLaterFolder.readLaterFolder?.id) {
    const response = await chrome.bookmarks.getChildren(state.readLaterFolder.readLaterFolder.id);
    return response;
  } else {
    return [];
  }
})

export default bookmarksSlice.reducer

export const selectAllBookmarks = (state: RootState) => state.bookmarks.bookmarks