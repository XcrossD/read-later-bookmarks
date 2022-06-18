import { configureStore } from '@reduxjs/toolkit'
import bookmarksReducer from '../features/bookmarks/bookmarksSlice'
import bookmarkMetasReducer from '../features/bookmarkMetas/bookmarkMetasSlice'
import optionsReducer from '../features/options/optionsSlice'
import readLaterFolderReducer from '../features/readLaterFolder/readLaterFolderSlice'
import searchKeywordReducer from '../features/searchKeyword/searchKeywordSlice'
import pocketReducer from '../features/credentials/pocketSlice'
import instapaperReducer from '../features/credentials/instapaperSlice'

export const store = configureStore({
  reducer: {
    bookmarks: bookmarksReducer,
    readLaterFolder: readLaterFolderReducer,
    searchKeyword: searchKeywordReducer,
    options: optionsReducer,
    bookmarkMetas: bookmarkMetasReducer,
    pocket: pocketReducer,
    instapaper: instapaperReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch