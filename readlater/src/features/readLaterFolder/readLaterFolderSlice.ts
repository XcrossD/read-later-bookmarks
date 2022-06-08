import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface ReadLaterFolderState {
  readLaterFolder: chrome.bookmarks.BookmarkTreeNode | null;
  status: string;
  error: string | null | undefined;
}

const initialState: ReadLaterFolderState = {
  readLaterFolder: null,
  status: 'idle',
  error: null
}

const readLaterFolderSlice = createSlice({
  name: 'readLaterFolder',
  initialState,
  reducers: {
    
  },
  extraReducers(builder) {
    builder
      .addCase(fetchreadLaterFolder.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchreadLaterFolder.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        state.readLaterFolder = action.payload;
      })
      .addCase(fetchreadLaterFolder.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export const fetchreadLaterFolder = createAsyncThunk('bookmarks/fetchreadLaterFolder', async () => {
  const readLaterFolderSearchResult = await chrome.bookmarks.search({ title: "Read Later Bookmarks" });
  let readLaterFolder = null;
  if (readLaterFolderSearchResult.length > 0) {
    readLaterFolder = readLaterFolderSearchResult[0];
  } else {
    readLaterFolder = await chrome.bookmarks.create({ title: "Read Later Bookmarks" });
  }
  return readLaterFolder;
})

export default readLaterFolderSlice.reducer

export const selectReadLaterFolder = (state: RootState) => state.readLaterFolder.readLaterFolder