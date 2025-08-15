import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { folderApi } from '../../service/folder';

interface Folder {
  id: number;
  name: string;
}

interface FolderState {
  folders: Folder[];
  selectedFolder: Folder | null;
  search: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FolderState = {
  folders: [],
  selectedFolder: null,
  search: '',
  status: 'idle',
  error: null,
};

export const fetchFolders = createAsyncThunk('folders/fetchAll', async () => {
  const response = await folderApi.getAll();
  return response.data;
});

export const addFolder = createAsyncThunk('folders/create', async (name: string) => {
  const response = await folderApi.create(name);
  return response.data;
});

export const editFolder = createAsyncThunk('folders/update', 
  async ({ id, name }: { id: number; name: string }) => {
    await folderApi.update(id, name);
    return { id, name };
  }
);

export const removeFolder = createAsyncThunk('folders/delete', async (id: number) => {
  await folderApi.delete(id);
  return id;
});

const foldersSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSelectedFolder: (state, action: PayloadAction<Folder | null>) => {
      state.selectedFolder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFolders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFolders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.folders = action.payload;
      })
      .addCase(fetchFolders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch folders';
      })
      .addCase(addFolder.fulfilled, (state, action) => {
        state.folders.push(action.payload);
      })
      .addCase(editFolder.fulfilled, (state, action) => {
        const index = state.folders.findIndex(f => f.id === action.payload.id);
        if (index !== -1) state.folders[index].name = action.payload.name;
      })
      .addCase(removeFolder.fulfilled, (state, action) => {
        state.folders = state.folders.filter(f => f.id !== action.payload);
        if (state.selectedFolder?.id === action.payload) {
          state.selectedFolder = null;
        }
      });
  }
});

export const { setSearch, setSelectedFolder } = foldersSlice.actions;
export default foldersSlice.reducer;