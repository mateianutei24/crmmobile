import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getVisits } from './actions/getVisits';
import GetObjectsResponse from '../../interfaces/GetObjectsResponse';
import VisitScreen from '../../interfaces/Visit';
import { Vizita } from '../../interfaces/Vizita';

interface VisitsState {
  visits: [] | VisitScreen[];
  helperDate: Date|null;
  companyName:string|undefined;
  hasMore: boolean;
}

const initialState: VisitsState = {
  visits: [],
  helperDate:null,
  companyName:undefined,
  hasMore: false
};



const visitsSlice = createSlice({
  name: 'visits',
  initialState,
  reducers: {
    clearVisits: (state) => {
        state.visits = [];
    },
    setHelperDate :(state,action) => {
      state.helperDate = action.payload;
    },
    setCompanyName: (state,action) => {
      state.companyName= action.payload
    }
  },
  extraReducers: (builder) => {
    // Fetch Call Logs
    builder
      .addCase(getVisits.pending, (state) => {
        console.log("GET VISITS PENDING")
      })
      .addCase(getVisits.fulfilled, (state, action) => {
        console.log("GET VISITS FULFILLED")
        
        let payload : GetObjectsResponse= action.payload as unknown as GetObjectsResponse;
        let visits: VisitScreen[] = [];

        if(payload.status == 200){
          let data:Vizita[] = payload.data;
        
          data.forEach((visit:Vizita) => {
            visits.push({
              visit_id : visit.vizita_id,
             companie: visit.Companie.companie_denumire,
            tip_vizita: visit.TipVizita.nume_tip_vizita,
            efectuata: visit.efectuata, // e.g. "egal cu"
            data_limita: visit.data_limita
            })
          })
          
          state.visits = visits

          if(payload.hasMore){
            state.hasMore = true
          }else{
            state.hasMore= false;
          }
        }
      })
      .addCase(getVisits.rejected, (state, action) => {
        console.log("GET VISITS REJECTED")
      });
  },
});

export const { clearVisits, setHelperDate, setCompanyName } = visitsSlice.actions;
export default visitsSlice.reducer;