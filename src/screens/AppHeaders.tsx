// components/AppHeader.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AppHeader: React.FC = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        <Image 
          source={require("../assets/logo.png")} 
          style={styles.logo} 
          resizeMode="contain" 
        />
        <Text style={styles.brandText}>CRM PRIMAGRA</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6, // Very thin header
    minHeight: 40,
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  brandText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
});

export default AppHeader;