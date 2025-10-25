import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { useAppDispatch } from '../redux/hooks';
import { signOut } from '../redux/slices/authSlice';

const VisitsScreen: React.FC = () => {
  const navigation  = useNavigation()
  const dispatch = useAppDispatch();
  return (
    <View style={styles.content}>
      <Text style={styles.title}>Visits</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  menuButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default VisitsScreen;