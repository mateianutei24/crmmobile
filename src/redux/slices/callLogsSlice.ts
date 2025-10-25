import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import CallLogsModule, { CallLogItem, TopContact } from '../../modules/CallLogsModule';

interface CallLogsState {
  callLogs: CallLogItem[];
  topContacts: TopContact[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CallLogsState = {
  callLogs: [],
  topContacts: [],
  isLoading: false,
  error: null,
};

export const fetchCallLogs = createAsyncThunk(
  'callLogs/fetch',
  async (limit: number, { rejectWithValue }) => {
    try {
      const logs = await CallLogsModule.getCallLogs(limit);
      return logs;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTopContacts = createAsyncThunk(
  'callLogs/fetchTopContacts',
  async (limit: number, { rejectWithValue }) => {
    try {
      const contacts = await CallLogsModule.getTopContactsByDuration(limit);
      return contacts;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const callLogsSlice = createSlice({
  name: 'callLogs',
  initialState,
  reducers: {
    clearCallLogs: (state) => {
      state.callLogs = [];
      state.topContacts = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Call Logs
    builder
      .addCase(fetchCallLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCallLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.callLogs = action.payload;
      })
      .addCase(fetchCallLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Top Contacts
    builder
      .addCase(fetchTopContacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTopContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topContacts = action.payload;
      })
      .addCase(fetchTopContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCallLogs } = callLogsSlice.actions;
export default callLogsSlice.reducer;