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
  page: number;
  loading:boolean;
  selectedVisitId : string | null;
  selectedVisit: null;
}

const initialState: VisitsState = {
  visits: [],
  helperDate:null,
  companyName:undefined,
  hasMore: false,
  page : 1,
  loading: false,
  selectedVisitId: null,
  selectedVisit : null,
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
    },
    setPage:(state,action) => {
      state.page = action.payload
    },
    resetList : (state,action) => {
      state.hasMore = false,
      state.page = 1;
      state.visits = [];
    },
    setSelectedVisitId : (state,action) => {
      state.selectedVisitId = action.payload;
    },
    clearSelectedVisit : (state,action) => {
      state.selectedVisit = null;
      state.selectedVisitId = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Call Logs
    builder
      .addCase(getVisits.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVisits.fulfilled, (state, action) => {
        
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
            data_limita: visit.data_limita,
            locatie_verificata: visit.locatie_verificata,
            locatie: visit.locatie_valoare
            })
          })
          
          if(state.visits.length > 0){
            let visitsTemp = (state.visits as VisitScreen[]).concat(visits);
            state.visits = visitsTemp
          }else{
            state.visits = visits
          }
         

          if(payload.hasMore){
            state.hasMore = true
          }else{
            state.hasMore= false;
          }

          state.loading = false;
        }
      })
      .addCase(getVisits.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { clearVisits, setHelperDate, setCompanyName,setPage,resetList, setSelectedVisitId,
  clearSelectedVisit

 } = visitsSlice.actions;
export default visitsSlice.reducer;