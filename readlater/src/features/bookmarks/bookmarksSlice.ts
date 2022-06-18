import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchBookmarkMetas } from '../bookmarkMetas/bookmarkMetasSlice';

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
        state.bookmarks = action.payload;
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export const fetchBookmarks = createAsyncThunk('bookmarks/fetchBookmarks', async (arg, { dispatch, getState }) => {
  const state = getState() as RootState;
  // console.log(state);
  if (state.readLaterFolder.readLaterFolder?.id) {
    const bookmarks = await chrome.bookmarks.getChildren(state.readLaterFolder.readLaterFolder.id);
    dispatch(fetchBookmarkMetas(bookmarks));
    return bookmarks;
  } else {
    return [];
  }
});

export default bookmarksSlice.reducer

export const selectAllBookmarks = (state: RootState) => state.bookmarks.bookmarks