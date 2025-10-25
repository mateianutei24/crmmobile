import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';


interface StatisticsState {
  statistics: [];
}

const initialState: StatisticsState = {
  statistics: []
};



const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    clearStatistics: (state) => {
        state.statistics = [];
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

export const { clearStatistics } = statisticsSlice.actions;
export default statisticsSlice.reducer;