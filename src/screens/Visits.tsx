import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import MonthPicker from 'react-native-month-year-picker';
import { getVisits } from '../redux/slices/actions/getVisits';

import { setHelperDate,setCompanyName } from '../redux/slices/visitsSlice';
import VisitList from './VisitsList';

const VisitsScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const [date, setDate] = useState<Date | null>(new Date());
  const [show, setShow] = useState<boolean>(false);
  const [textValue, setTextValue] = useState<string>('');


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
      <View style={styles.pickerContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => showPicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {formatMonthYear(helperDate)}
          </Text>
        </TouchableOpacity>
        {helperDate && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {show && (
        <MonthPicker
          onChange={(event,newDate)=>{
          console.log("NEW DATE");
          console.log(newDate)
          showPicker(false);
          dispatch(setHelperDate(newDate))
          dispatch(getVisits());
          }}
          value={helperDate || new Date()}
          minimumDate={new Date(2020, 0)}
          maximumDate={new Date(2030, 11)}
          locale="en"
        />
      )}

      <Text style={styles.label}>Introdu numele companiei </Text>
      <TextInput
        style={styles.textInput}
        placeholder="Compania..."
        placeholderTextColor="#999"
        value={companyName}
        onChangeText={((text)=>{
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
});

export default VisitsScreen;