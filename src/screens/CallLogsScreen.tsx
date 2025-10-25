import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  FlatList,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCallLogs } from '../redux/slices/callLogsSlice';
import { useNavigation } from '@react-navigation/native';

const CallLogsScreen: React.FC = ({  }) => {
  const dispatch = useAppDispatch();
  const { callLogs, isLoading } = useAppSelector((state) => state.callLogs);
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

  const handleFetchCallLogs = async (): Promise<void> => {
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

    dispatch(fetchCallLogs(50));
  };

  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getCallTypeStyle = (type: string) => {
    switch (type) {
      case 'INCOMING':
        return { color: '#4CAF50' };
      case 'OUTGOING':
        return { color: '#2196F3' };
      case 'MISSED':
        return { color: '#F44336' };
      case 'REJECTED':
        return { color: '#FF9800' };
      default:
        return { color: '#9E9E9E' };
    }
  };

  const renderCallLogItem = ({ item }: { item: any }) => (
    <View style={styles.callLogItem}>
      <View style={styles.callLogHeader}>
        <Text style={styles.callLogName}>
          {item.name || item.phoneNumber}
        </Text>
        <Text style={[styles.callLogType, getCallTypeStyle(item.type)]}>
          {item.type}
        </Text>
      </View>
      {item.name && (
        <Text style={styles.callLogNumber}>{item.phoneNumber}</Text>
      )}
      <View style={styles.callLogFooter}>
        <Text style={styles.callLogDetail}>
          Duration: {formatDuration(item.duration)}
        </Text>
        <Text style={styles.callLogDetail}>
          {new Date(item.date).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Call Logs</Text>
      
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleFetchCallLogs}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Fetch Call Logs</Text>
        )}
      </TouchableOpacity>

      {callLogs.length > 0 && (
        <FlatList
          data={callLogs}
          renderItem={renderCallLogItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.callLogsList}
          contentContainerStyle={styles.callLogsContent}
        />
      )}

      <TouchableOpacity style={styles.backButton} onPress={() =>{
        navigation.goBack()
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
  backButton: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  callLogsList: {
    flex: 1,
    marginBottom: 10,
  },
  callLogsContent: {
    paddingBottom: 10,
  },
  callLogItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  callLogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  callLogName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  callLogType: {
    fontSize: 14,
    fontWeight: '600',
  },
  callLogNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  callLogFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  callLogDetail: {
    fontSize: 12,
    color: '#999',
  },
});

export default CallLogsScreen;