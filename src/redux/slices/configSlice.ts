import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {RootState} from "../index"
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

export const testRoute = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'config/testRoute',
  async (_,{getState,rejectWithValue}) => {

    let token = null;
    token = await auth().currentUser?.getIdToken();
    let backendHostname = getState().config.backendHostname;

  console.log(`${backendHostname}/mobile/test`)
    try{
    const response = await axios.get(`http://${backendHostname}/mobile/test`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

      console.log("response from back")
      console.log(response);
      }catch(error){
        console.log("error from test route");
        console.log(error)
        return rejectWithValue("value")
      }

      return;
    
  }
);


interface ConfigState {
  backendHostname: string
}

// "http://10.0.2.2:5800"
// "https://europe-central2-crm-production-af45e.cloudfunctions.net/backCrm"
const initialState: ConfigState = {
  backendHostname : "https://europe-central2-crm-production-af45e.cloudfunctions.net/backCrm"
};



const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
   builder
      .addCase(testRoute.pending, (state) => {
        console.log("PENDING")
      })
      .addCase(testRoute.fulfilled, (state) => {
        console.log("FULFILLED")
      })
      .addCase(testRoute.rejected, (state) => {
       console.log("REJECTED")
      });
  },
});

export const {  } = configSlice.actions;
export default configSlice.reducer;