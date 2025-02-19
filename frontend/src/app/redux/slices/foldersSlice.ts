import { Folder } from "@/app/notepad/page";

interface FoldersState {
  folders: Folder[];
  selectedFolder: Folder | null;
}
const initialState: FoldersState = {
  folders: [],
  selectedFolder: null,
};

const foldersSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    addFolder: (state, action: payloadAction<Folder>) => {
      state.folders.push(action.payload);
    },
    updateFolder: (
      state,
      action: payloadAction<{ id: string; name: string }>
    ) => {
      const index = state.folders.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.folders[index].name = action.payload.name;
      }
    },
    deleteFolders: (state, action: payloadAction<string>) => {
      state.folders = state.folders.filter((f) => f.id !== action.payload);
    },
    selectFolder: (state, action: payloadAction<Folder | null>) => {
      state.selectedFolder = action.payload;
    },
    setFolders: (state, action: payloadAction<Folder[]>) => {
      state.folders = action.payload;
    },
  },
});

export const {addFolder,updateFolder,deleteFolder,selectFolder,setFolders}=foldersSlice.action;
export default foldersSlice.reducer;