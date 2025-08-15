import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { noteApi } from '../../service/note';

export interface Note {
  id: number;
  text: string;
  created_at: string;
  folderId: number;
}

interface NotesState {
  notes: Note[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  status: 'idle',
  error: null,
};

export const fetchNotes = createAsyncThunk('notes/fetchAll', async (folderId: number) => {
  const response = await noteApi.getByFolder(folderId);
  return response.data;
});

export const createNote = createAsyncThunk('notes/create', async (note: {text:string; folderId:number}) => {
  const response = await noteApi.create(note);
  return response.data;
});

export const updateNoteContent = createAsyncThunk('notes/update', async ({ id, text }: { id: number; text: string }) => {
  const response = await noteApi.update(id, text);
  return response.data;
});

export const deleteNote = createAsyncThunk('notes/delete', async (id: number) => {
  await noteApi.delete(id);
  return id;
});

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.status = 'loading';
        state.notes=[];
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notes = action.payload.map((note: { id: number; text: string; created_at: string; folderId: number; }) => ({
          id: note.id,
          text: note.text,
          created_at: note.created_at,
          folderId: note.folderId 
        }));
        state.error = null;
      }  
      )
      .addCase(fetchNotes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch notes';
      });
  }
});

export default notesSlice.reducer;
