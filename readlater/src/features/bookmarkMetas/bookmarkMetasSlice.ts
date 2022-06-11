import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface BookmarkMeta {
  id: string;
  description: string | null;
  image: string | null;
}

interface BookmarkMetasState {
  bookmarkMetas: Array<BookmarkMeta>;
  status: string;
  error: string | null | undefined;
}

const parser = new DOMParser();

const initialState: BookmarkMetasState = {
  bookmarkMetas: [],
  status: 'idle',
  error: null
}

const bookmarkMetasSlice = createSlice({
  name: 'bookmarkMetas',
  initialState,
  reducers: {
    
  },
  extraReducers(builder) {
    builder
      .addCase(fetchBookmarkMetas.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchBookmarkMetas.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.bookmarkMetas = action.payload;
      })
      .addCase(fetchBookmarkMetas.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export const fetchBookmarkMetas = createAsyncThunk('bookmarkMetas/fetchBookmarkMetas',
  async (arg: Array<chrome.bookmarks.BookmarkTreeNode>) => {
    const promiseArr = arg.map((elem: chrome.bookmarks.BookmarkTreeNode) => {
      return fetch(elem.url as string);
    });
    const responses = await Promise.all(promiseArr);
    const responseTexts = await Promise.all(responses.map(res => res.text()));
    const metas = responseTexts.map((text, index) => {
      const doc = parser.parseFromString(text, "text/html");
      const metatags = doc.getElementsByTagName("meta");
      const metaObj = {
        id: arg[index].id,
        description: null,
        image: null,
      } as BookmarkMeta;
      for (let i = 0; i < metatags.length; i += 1) {
        if (metatags[i].getAttribute('name') === 'description') {
          metaObj['description'] = metatags[i].getAttribute('content')
        }
        if (metatags[i].getAttribute('name') === 'og:image') {
          metaObj['image'] = metatags[i].getAttribute('content')
        }
        if (metatags[i].getAttribute('name') === 'twitter:image') {
          metaObj['image'] = metatags[i].getAttribute('content')
        }
      }
      return metaObj;
    }); 
    return metas;
  }
);

export default bookmarkMetasSlice.reducer

export const selectAllBookmarkMetas = (state: RootState) => state.bookmarkMetas.bookmarkMetas