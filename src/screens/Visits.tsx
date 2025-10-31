import React, { useState, useCallback, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, SafeAreaView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import { DatePicker } from "@s77rt/react-native-date-picker";
import type { DatePickerHandle } from "@s77rt/react-native-date-picker";

import MonthPicker from 'react-native-month-year-picker';


import { getVisits } from '../redux/slices/actions/getVisits';

import { setHelperDate,setCompanyName, resetList } from '../redux/slices/visitsSlice';
import VisitList from './VisitsList';




const VisitsScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const [date, setDate] = useState<Date | null>(new Date());
  const [show, setShow] = useState<boolean>(false);


  const [textValue, setTextValue] = useState<string>('');



  const datePicker = useRef<DatePickerHandle>(null);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);



  const helperDate = useAppSelector((state)=>state.visits.helperDate);
  const companyName=useAppSelector((state)=>state.visits.companyName);

  const showPicker = useCallback((value: boolean) => setShow(value), []);


  const onValueChange = useCallback(
    (event: any, newDate?: Date) => {
      const selectedDate = newDate || helperDate;
      showPicker(false);
      dispatch(setHelperDate(selectedDate))
    },
    [date, showPicker],
  );

  const formatMonthYear = (dateObj: Date | null): string => {
    if (!dateObj) return 'Select a month';
    return dateObj.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const handleClear = () => {
    dispatch(setHelperDate(null));
    dispatch(getVisits());
  };




  return (
    <SafeAreaView style={styles.content}>
      <Text style={styles.label}>Selecteaza luna</Text>
    <>
		<View>
	<TouchableOpacity
    style={styles.outlinedButton}
    onPress={() => datePicker.current?.showPicker()}
  >
  <Text style={styles.outlinedButtonText}>
    {helperDate
      ? helperDate.toLocaleDateString('ro-RO', {
          month: 'long',
          year: 'numeric',
        })
      : 'Selectează luna'}
  </Text>
    </TouchableOpacity>
				<DatePicker
					ref={datePicker}
					type="yearmonth"
					value={helperDate}
					onChange={(value)=>{
            dispatch(resetList({}));
            dispatch(setHelperDate(value))
            dispatch(getVisits())
          }}
				/>
			</View>
		</>

      <Text style={styles.labelMarginTop}>Introdu numele companiei </Text>
      <TextInput
        style={styles.textInput}
        placeholder="Compania..."
        placeholderTextColor="#999"
        value={companyName}
        onChangeText={((text)=>{
          dispatch(resetList({}));
          dispatch(setCompanyName(text))
          dispatch(getVisits());
        })}
      />

      <VisitList/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  }, 
  labelMarginTop: {
    marginTop:16,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    padding: 15,
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  outlinedButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlinedButtonText: {
    fontSize: 16,
    color: '#333',
    textTransform: 'capitalize', // makes month names like "Ianuarie"
  },
});

export default VisitsScreen;