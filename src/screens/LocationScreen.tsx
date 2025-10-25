import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchLocation } from '../redux/slices/locationSlice';
import {useNavigation} from '@react-navigation/native';


const LocationScreen: React.FC = ({ }) => {
  const dispatch = useAppDispatch();
  const { currentLocation, isLoading } = useAppSelector((state) => state.location);
  const navigation = useNavigation();


  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.log('Error requesting location permission:', error);
      return false;
    }
  };

  const handleGetLocation = async (): Promise<void> => {
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Please enable location permission in settings.'
      );
      return;
    }

    dispatch(fetchLocation());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location</Text>
      
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleGetLocation}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Get My Location</Text>
        )}
      </TouchableOpacity>

      {currentLocation && (
        <View style={styles.dataContainer}>
          <View style={styles.dataItem}>
            <Text style={styles.label}>Latitude:</Text>
            <Text style={styles.value}>{currentLocation.latitude.toFixed(6)}</Text>
          </View>
          <View style={styles.dataItem}>
            <Text style={styles.label}>Longitude:</Text>
            <Text style={styles.value}>{currentLocation.longitude.toFixed(6)}</Text>
          </View>
          <View style={styles.dataItem}>
            <Text style={styles.label}>Accuracy:</Text>
            <Text style={styles.value}>{currentLocation.accuracy.toFixed(2)}m</Text>
          </View>
          <View style={styles.dataItem}>
            <Text style={styles.label}>Time:</Text>
            <Text style={styles.value}>{currentLocation.timestamp}</Text>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.backButton} onPress={()=>{
        navigation.goBack();
      }}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#99c7ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  dataContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  dataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  backButton: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LocationScreen;