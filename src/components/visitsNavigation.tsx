import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VisitsScreen from '../screens/Visits';
import VisitDetailsScreen from '../screens/VisitDetailsScreen'; // your secondary screen




const Stack = createNativeStackNavigator();

const VisitsStack: React.FC = () => {
  return (
    <Stack.Navigator
    screenOptions={{
        headerShown: false, 
      }}
    >
      <Stack.Screen
        name="VisitsList"
        component={VisitsScreen}
      />
      <Stack.Screen
        name="VisitDetails"
        component={VisitDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default VisitsStack;
