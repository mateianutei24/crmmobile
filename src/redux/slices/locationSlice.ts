import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Geolocation from 'react-native-geolocation-service';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  timestamp: string;
}

interface LocationState {
  currentLocation: LocationData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: LocationState = {
  currentLocation: null,
  isLoading: false,
  error: null,
};

export const fetchLocation = createAsyncThunk(
  'location/fetch',
  async (_, { rejectWithValue }) => {
    return new Promise<LocationData>((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            timestamp: new Date(position.timestamp).toLocaleString(),
          };
          resolve(locationData);
        },
        (error) => {
          reject(rejectWithValue(error.message));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    clearLocation: (state) => {
      state.currentLocation = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLocation = action.payload;
      })
      .addCase(fetchLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearLocation } = locationSlice.actions;
export default locationSlice.reducer;