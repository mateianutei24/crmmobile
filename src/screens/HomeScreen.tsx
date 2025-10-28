import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppDispatch } from '../redux/hooks';
import { signOut } from '../redux/slices/authSlice';
import SectionTitle from './SectionTitle';
import StatCard from './StatCard';
// Replace this with your actual logo asset
import { testRoute } from '../redux/slices/configSlice';
import { getVisits } from '../redux/slices/actions/getVisits';

interface ProgressBarProps {
  value: number; // 0 to 100
  label: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, label }) => {
  // Determine color based on value
  let progressColor = '#ff3b30'; // red by default
  if (value >= 50 && value < 80) progressColor = '#ff9500'; // orange
  else if (value >= 80 && value < 100) progressColor = '#ffd60a'; // yellow
  else if (value === 100) progressColor = '#34c759'; // green

  return (
    <View style={styles.progressContainer}>
      <Text style={styles.label}>{label}: {value}%</Text>
      <View style={styles.progressBackground}>
        <View style={[styles.progressFill, { width: `${value}%`, backgroundColor: progressColor }]} />
      </View>
    </View>
  );
};

const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  // You can later pull these from Redux or an API
  const userName = 'Anutei Matei';
  const userRole = 'Analist date';

  return (
    <View style={styles.content}>
      {/* Company Branding */}
      {/* <View style={styles.brandingRow}>
        <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
        <Text style={styles.brandText}>CRM PRIMAGRA</Text>
      </View> */}

      {/* User Info + Logout */}
      <View style={styles.userRow}>
        <View>
          <Text style={styles.welcomeText}>{userName}</Text>
          <Text style={styles.roleText}>{userRole}</Text>
        </View>

        <TouchableOpacity onPress={() => dispatch(signOut())}>
          <Ionicons name="log-out-outline" size={30} color="#007AFF" />
        </TouchableOpacity>
      </View>
    <StatCard 
      iconName="flag-outline"
      title="Total Vizite"
      value={24}
      color="black"
    />
    <StatCard 
      iconName="checkmark-done-circle-outline"
      title="Vizite efectuate"
      value={24}
      color="#28A745"
    />
      {/* <SectionTitle title='Prospectare de piata' iconName='trending-up'/> */}
      <ProgressBar value={30} label="Realizare plan de prospectare" />
      <ProgressBar value={60} label="Realizare numar minim vizite" />
      <ProgressBar value={90} label="Numar minim de vizite fizice" />
      <ProgressBar value={74} label="Actualizarea bazei de date" />
        <TouchableOpacity onPress={()=>{
          dispatch(getVisits());}
        }>
        <Text>TESTEAZA ROUTE</Text>
        </TouchableOpacity>
      {/* <SectionTitle title='Prospectare de piata' iconName='trending-up'/>
      <ProgressBar value={44} label="Actualizarea bazei de date" /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },

  // --- Branding Section ---
  brandingRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 25,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
    textTransform: 'uppercase',
  },

  // --- User Info Section ---
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  roleText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  ontent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  progressBackground: {
    height: 20,
    width: '100%',
    backgroundColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
});

export default HomeScreen;
