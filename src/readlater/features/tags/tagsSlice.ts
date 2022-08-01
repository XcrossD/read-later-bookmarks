import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ITagsState {
  tags: Array<string>;
  associations: {[key: string]: Array<string>};
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined; 
};

type ModifyTagObj = {
  oldName: string,
  newName: string
};

type AssociationObj = {
  tag: string,
  items: string | Array<string>
};

const initialState: ITagsState = {
  tags: [],
  associations: {},
  status: 'idle',
  error: null
};

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTags.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const {tags: chromeTags} = action.payload;
        state.tags = Object.keys(chromeTags);
        state.associations = chromeTags;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message
      })
      .addCase(addTag.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(addTag.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(addTag.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message
      })
      .addCase(deleteTag.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message
      })
      .addCase(modifyTag.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(modifyTag.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(modifyTag.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message
      })
      .addCase(addAssociation.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(addAssociation.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(addAssociation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message
      })
      .addCase(removeAssociation.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(removeAssociation.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(removeAssociation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message
      })
  }
});

export const fetchTags = createAsyncThunk('tags/fetchTags', async () => {
  const tags = await chrome.storage.local.get('tags');
  return tags;
});

export const addTag = createAsyncThunk('tags/addTag', async (name: string, { dispatch, getState }) => {
  const { tags: storeTags } = getState() as { tags: ITagsState};
  const { associations } = storeTags;
  const newTags = { ...associations };
  newTags[name] = [];
  await chrome.storage.local.set({ tags: newTags });
  dispatch(fetchTags());
});

export const deleteTag = createAsyncThunk('tags/deleteTag', async (name: string, { dispatch, getState }) => {
  const { tags: storeTags } = getState() as { tags: ITagsState};
  const { associations } = storeTags;
  const newTags = { ...associations };
  delete newTags[name];
  await chrome.storage.local.set({ tags: newTags });
  dispatch(fetchTags());
});

export const modifyTag = createAsyncThunk('tags/modifyTag', async ({ oldName, newName }: ModifyTagObj, { dispatch, getState }) => {
  const { tags: storeTags } = getState() as { tags: ITagsState};
  const { associations } = storeTags;
  if (oldName in associations) {
    const newTags = { ...associations };
    newTags[newName] = newTags[oldName];
    delete newTags[oldName];
    await chrome.storage.local.set({ tags: newTags });
    dispatch(fetchTags());
  }
});

export const addAssociation = createAsyncThunk('tags/addAssociation', async ({ tag, items }: AssociationObj, { dispatch, getState }) => {
  const { tags: storeTags } = getState() as { tags: ITagsState};
  const { associations } = storeTags;
  const newTagObj = { ...associations };
  if (Array.isArray(items)) {
    newTagObj[tag].push(...items);
  } else {
    newTagObj[tag].push(items);
  }
  await chrome.storage.local.set({ tags: newTagObj });
  dispatch(fetchTags());
});

export const removeAssociation = createAsyncThunk('tags/removeAssociation', async ({ tag, items }: AssociationObj, { dispatch, getState }) => {
  const { tags: storeTags } = getState() as { tags: ITagsState};
  const { associations } = storeTags;
  const newTagObj = { ...associations };
  if (Array.isArray(items)) {
    const indexSet = new Set(items);
    newTagObj[tag] = newTagObj[tag].filter((elem) => !indexSet.has(elem));
  } else {
    const idx = newTagObj[tag].indexOf(items);
    newTagObj[tag].slice(idx, 1);
  }
  await chrome.storage.local.set({ tags: newTagObj });
  dispatch(fetchTags());
});

export default tagsSlice.reducer;