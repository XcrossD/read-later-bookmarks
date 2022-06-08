import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const searchKeywordSlice = createSlice({
    name: 'searchKeyword',
    initialState,
    reducers: {
      update(state, action) {
        state = action.payload;
      }
    }
});

export const { update } = searchKeywordSlice.actions;

export default searchKeywordSlice.reducer;