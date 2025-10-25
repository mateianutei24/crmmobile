import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';


interface VisitsState {
  visits: [];
}

const initialState: VisitsState = {
  visits: []
};



const visitsSlice = createSlice({
  name: 'visits',
  initialState,
  reducers: {
    clearVisits: (state) => {
        state.visits = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Call Logs
    // builder
    //   .addCase(fetchCallLogs.pending, (state) => {
    //     state.isLoading = true;
    //     state.error = null;
    //   })
    //   .addCase(fetchCallLogs.fulfilled, (state, action) => {
    //     state.isLoading = false;
    //     state.callLogs = action.payload;
    //   })
    //   .addCase(fetchCallLogs.rejected, (state, action) => {
    //     state.isLoading = false;
    //     state.error = action.payload as string;
    //   });
  },
});

export const { clearVisits } = visitsSlice.actions;
export default visitsSlice.reducer;