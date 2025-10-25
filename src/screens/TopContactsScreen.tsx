import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchTopContacts } from '../redux/slices/callLogsSlice';
import { useNavigation } from '@react-navigation/native';

const TopContactsScreen: React.FC = ({  }) => {
  const dispatch = useAppDispatch();
  const { topContacts, isLoading, error } = useAppSelector((state) => state.callLogs);
  const navigation = useNavigation();

  const requestCallLogPermission = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
          {
            title: 'Call Log Permission',
            message: 'This app needs access to your call logs',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return false;
    } catch (error) {
      console.log('Error requesting call log permission:', error);
      return false;
    }
  };

  const handleFetchTopContacts = async (): Promise<void> => {
    if (Platform.OS !== 'android') {
      Alert.alert('Not Supported', 'Call logs are only available on Android');
      return;
    }

    const hasPermission = await requestCallLogPermission();
    
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Please enable call log permission in settings.'
      );
      return;
    }

    dispatch(fetchTopContacts(10));
  };

  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return '0s';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getTotalDuration = (): number => {
    return topContacts.reduce((sum, contact) => sum + contact.totalDuration, 0);
  };

  const getPercentage = (duration: number): string => {
    const total = getTotalDuration();
    if (total === 0) return '0%';
    return `${((duration / total) * 100).toFixed(1)}%`;
  };

  const screenWidth = Dimensions.get('window').width;
  
  const chartData = topContacts.map((contact, index) => {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#E7E9ED', '#8DD3C7', '#BEBADA', '#FB8072'
    ];
    
    return {
      name: contact.name.length > 15 ? contact.name.substring(0, 15) + '...' : contact.name,
      duration: contact.totalDuration,
      color: colors[index % colors.length],
      legendFontColor: '#333',
      legendFontSize: 12,
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>📊 Top 10 Contacts</Text>
        <Text style={styles.subtitle}>By Total Call Duration</Text>
        
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleFetchTopContacts}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {topContacts.length > 0 ? 'Refresh Data' : 'Load Top Contacts'}
            </Text>
          )}
        </TouchableOpacity>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {topContacts.length > 0 && (
          <>
            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Summary</Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{topContacts.length}</Text>
                  <Text style={styles.summaryLabel}>Contacts</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>
                    {formatDuration(getTotalDuration())}
                  </Text>
                  <Text style={styles.summaryLabel}>Total Time</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>
                    {topContacts.reduce((sum, c) => sum + c.callCount, 0)}
                  </Text>
                  <Text style={styles.summaryLabel}>Total Calls</Text>
                </View>
              </View>
            </View>

            {/* Pie Chart */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Distribution by Duration</Text>
              <PieChart
                data={chartData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="duration"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>

            {/* Detailed Stats */}
            <View style={styles.statsContainer}>
              <Text style={styles.statsTitle}>Detailed Rankings</Text>
              {topContacts.map((contact, index) => (
                <View key={index} style={styles.contactCard}>
                  <View style={styles.contactHeader}>
                    <View style={styles.rankBadge}>
                      <Text style={styles.rankText}>#{index + 1}</Text>
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactPhone}>{contact.phoneNumber}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                      <Text style={styles.statIcon}>🕒</Text>
                      <Text style={styles.statValue}>
                        {formatDuration(contact.totalDuration)}
                      </Text>
                      <Text style={styles.statLabel}>Duration</Text>
                    </View>
                    
                    <View style={styles.statBox}>
                      <Text style={styles.statIcon}>📞</Text>
                      <Text style={styles.statValue}>{contact.callCount}</Text>
                      <Text style={styles.statLabel}>Calls</Text>
                    </View>
                    
                    <View style={styles.statBox}>
                      <Text style={styles.statIcon}>📊</Text>
                      <Text style={styles.statValue}>
                        {getPercentage(contact.totalDuration)}
                      </Text>
                      <Text style={styles.statLabel}>Share</Text>
                    </View>
                    
                    <View style={styles.statBox}>
                      <Text style={styles.statIcon}>⏱️</Text>
                      <Text style={styles.statValue}>
                        {formatDuration(Math.floor(contact.totalDuration / contact.callCount))}
                      </Text>
                      <Text style={styles.statLabel}>Avg/Call</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
         <TouchableOpacity style={styles.backButton} onPress={()=>{
          navigation.goBack()
         }}>
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
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
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
  },
  backButton: {
  backgroundColor: '#6c757d',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 20,
  marginBottom: 40,
},
backButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},
});

export default TopContactsScreen;