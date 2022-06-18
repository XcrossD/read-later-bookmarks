import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const searchKeywordSlice = createSlice({
    name: 'searchKeyword',
    initialState,
    reducers: {
      updateSearchKeyword(state, action) {
        return action.payload;
      }
    }
});

export const { updateSearchKeyword } = searchKeywordSlice.actions;

export default searchKeywordSlice.reducer;