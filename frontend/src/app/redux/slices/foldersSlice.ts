import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Folder = {
  id: string;
  name: string;
};

type FolderState = {
  folders: Folder[];
  selectedFolder: Folder | null;
  search: string;
};

const initialState: FolderState = {
  folders: [],
  selectedFolder: null,
  search: '',
};

const foldersSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    addFolder: (state, action: PayloadAction<string>) => {
      const newFolder = { id: Date.now().toString(), name: action.payload };
      state.folders.push(newFolder);
    },
    updateFolder: (state, action: PayloadAction<{ id: string; newName: string }>) => {
      const folder = state.folders.find((f) => f.id === action.payload.id);
      if (folder) folder.name = action.payload.newName;
    },
    deleteFolder: (state, action: PayloadAction<string>) => {
      state.folders = state.folders.filter((folder) => folder.id !== action.payload);
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSelectedFolder: (state, action: PayloadAction<Folder | null>) => {
      state.selectedFolder = action.payload;
    },
  },
});

export const { addFolder, updateFolder, deleteFolder, setSearch, setSelectedFolder } = foldersSlice.actions;
export default foldersSlice.reducer;