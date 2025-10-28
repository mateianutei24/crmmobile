import {  createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {RootState} from "../../index"
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import axios from 'axios';
import FilterCondition from '../../../interfaces/FilterCondition';



function getMonthRange(date: Date) {
  // Get first and last days (local time)
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  // Format safely as YYYY-MM-DD (using local time, not UTC)
  const formatLocalDate = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return {
    firstDay: formatLocalDate(firstDay),
    lastDay: formatLocalDate(lastDay),
  };
}


export const getVisits= createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'visits/fetch',
  async (_,{getState,rejectWithValue}) => {

    let token = null;
    token = await auth().currentUser?.getIdToken();

    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };


    let backendHostname = getState().config.backendHostname;

    let helperDate = getState().visits.helperDate;
    let companyName = getState().visits.companyName;

    let conditions: FilterCondition[] = [];

    if(helperDate != null){
   const { firstDay, lastDay } = getMonthRange(helperDate);
      conditions.push({
        column: "data_limita",
        objectId: "data_limita",
        joinKey: null,
        operation: "dupa", // Initialize with a default operation
        value: firstDay,
        type: "date",
        error: false,
        helperText: "",
      });
      conditions.push({
        column: "data_limita",
        objectId: "data_limita",
        joinKey: null,
        operation: "inainte de", // Initialize with a default operation
        value: lastDay,
        type: "date",
        error: false,
        helperText: "",
      });

    }

    if(companyName != undefined){
         conditions.push({
        column: "companie_denumire",
        objectId: "companie_denumire",
        joinKey: ["Companie"],
        operation: "contine", // Initialize with a default operation
        value: companyName,
        type: "text",
        error: false,
        helperText: "",
      });
    }

    var url:string =`${backendHostname}/vizite/pagination?page=${
        1
      }&limit=${
        20
      }&conditions=${JSON.stringify(conditions)}`


      console.log(url)

     try {
      const response = await axios.get(url, config);
      return response.data;
    } catch (error) {
      console.log(error)
      return rejectWithValue("S-a produs o eroare la preluarea vizitelor");
    }

  }
);