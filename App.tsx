import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useAppDispatch, useAppSelector } from './src/redux/hooks';
import { setUser } from './src/redux/slices/authSlice';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

// Auth Screens
import LoginScreen from './src/screens/LoginScreen';

// App Screens
import HomeScreen from './src/screens/HomeScreen';
import LocationScreen from './src/screens/LocationScreen';
import CallLogsScreen from './src/screens/CallLogsScreen';
import TopContactsScreen from './src/screens/TopContactsScreen';
import AppHeader from './src/screens/AppHeaders';

//actual screens
import LocationsScreen from './src/screens/Locations';
import VisitsScreen from './src/screens/Visits';

import VisitsStack from './src/components/visitsNavigation';



// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Auth Stack Navigator
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName='Acasa'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = 'home';

          if (route.name === 'Acasa') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Locatii') {
            iconName = focused ? 'location' : 'location-outline';
          } else if (route.name === 'Vizite') {
            iconName = focused ? 'walk' : 'walk-outline';
          } 

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        // Use custom header component for all screens
        header: () => <AppHeader/>,
      })}
    >
      <Tab.Screen 
        name="Locatii" 
        component={LocationsScreen}
        options={{
          header: () => <AppHeader/>,
        }}
      />
      <Tab.Screen 
        name="Acasa" 
        component={HomeScreen}
        options={{
          header: () => <AppHeader/>,
        }}
      />
      <Tab.Screen 
        name="Vizite" 
        component={VisitsStack}
        options={{
          header: () => <AppHeader/>,
        }}
      />
    </Tab.Navigator>
  );
};

const App = (): React.JSX.Element => {
  const [initializing, setInitializing] = useState(true);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  // Handle authentication state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        dispatch(setUser(firebaseUser.toJSON()));
      } else {
        dispatch(setUser(null));
      }
      
      if (initializing) {
        setInitializing(false);
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [dispatch, initializing]);

  // Show loading screen while checking auth state
  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Render navigation based on auth state
  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default App;