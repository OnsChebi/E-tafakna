import { Note } from "@/app/notepad/page";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface NotesState{
    notes:Note[];
}
const initialState:NotesState={
    notes:[],
}
const notesSlice = createSlice({
    name:'notes',
    initialState,
    reducers:{
        addNote:(state, action:PayloadAction<Note>)=>{
            state.notes.push(action.payload);
        },
        updateNote:(state,action:PayloadAction<Note>)=>{
            const index = state.notes.findIndex(n=>n.id === action.payload.id);
            if(index !== -1){
                state.notes[index] = action.payload;
            }
        },
        deleteNote:(state,action:PayloadAction<string>)=>{
            state.notes = state.notes.filter(n=>n.id !== action.payload); 
        },
        setNotes:(state, action:PayloadAction<Note[]>)=>{
            state.notes = action.payload;
        }
    },
});
export const {addNote,updateNote,deleteNote,setNotes} = notesSlice.actions;
export default notesSlice.reducer;