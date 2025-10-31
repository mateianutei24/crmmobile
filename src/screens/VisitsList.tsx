import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import VisitScreen from '../interfaces/Visit'; // Your interface import
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  LoaderKitView,
} from 'react-native-loader-kit';

import { setPage } from '../redux/slices/visitsSlice';
import { getVisits } from '../redux/slices/actions/getVisits';
import { setSelectedVisitId } from '../redux/slices/visitsSlice';
import { useNavigation } from '@react-navigation/native';


// Helper function to get icon based on visit type
const getVisitIcon = (tipVizita: string): string => {
  const iconMap: Record<string, string> = {
    'fizica': 'location-sharp',
    'telefonica': 'call',
    'neprecizat': 'help-circle',
    'locatie neutra': 'people',
    'in punct': 'business',
  };
  
  return iconMap[tipVizita.toLowerCase()] || 'help-circle';
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const months = [
    'Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun',
    'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

// Individual Visit Item Component with VisitScreen interface
interface VisitItemProps {
  visit: VisitScreen;
}

const VisitItem: React.FC<VisitItemProps> = ({ visit }) => {
  const statusColor = visit.efectuata ? '#4CAF50' : '#F44336';
  const iconName = getVisitIcon(visit.tip_vizita);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => {
      dispatch(setSelectedVisitId(visit.visit_id));
      // @ts-ignore
      navigation.navigate('VisitDetails', {
        visit: visit
      });
    }}>
    <View style={styles.visitCard}>
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, { backgroundColor: statusColor + '20' }]}>
          <Ionicons 
            name={iconName} 
            size={24} 
            color={statusColor}
          />
        </View>
      </View>
      
      <View style={styles.middleSection}>
        <Text style={styles.companyName} numberOfLines={1}>
          {visit.companie}
        </Text>
        <Text style={styles.visitType}>
          {visit.tip_vizita.charAt(0).toUpperCase() + visit.tip_vizita.slice(1)}
        </Text>
        <Text style={styles.deadline}>
          Termen: {formatDate(visit.data_limita)}
        </Text>
      </View>
      
      <View style={styles.rightSection}>
        <View style={[styles.statusIndicator, { backgroundColor: statusColor }]}>
          <Ionicons 
            name={visit.efectuata ? 'checkmark' : 'close'} 
            size={16} 
            color="white"
          />
        </View>
        <Text style={[styles.statusText, { color: statusColor }]}>
          {visit.efectuata ? 'Efectuată' : 'Neefectuată'}
        </Text>
      </View>
    </View>
    </TouchableOpacity>
  );
};

// Define RootState interface for Redux

// Main Visit List Component
const VisitList: React.FC = () => {
  const dispatch = useAppDispatch();

  const visits = useAppSelector ((state) => state.visits.visits);
  const loadingVisits = useAppSelector((state)=>state.visits.loading)
  const page = useAppSelector((state) => state.visits.page)
  const hasMore = useAppSelector((state) => state.visits.hasMore)
  const renderItem: ListRenderItem<VisitScreen> = ({ item }) => <VisitItem visit={item} />;
  
  const keyExtractor = (item: VisitScreen) => item.visit_id;
  
  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Nu există vizite</Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={visits}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if(loadingVisits == false && hasMore == true){
              dispatch(setPage(page+1));
              dispatch(getVisits())
          }
      }}
      onEndReachedThreshold={0.3}
      />
      {loadingVisits? <LoaderKitView
      style={{ width: 50, height: 50, alignSelf: "center" }}
      name={'BallPulse'}
      animationSpeedMultiplier={1.0} 
      color={'grey'} 
      />:null}
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  visitCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  leftSection: {
    marginRight: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleSection: {
    flex: 1,
    marginRight: 12,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  visitType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  deadline: {
    fontSize: 12,
    color: '#999',
  },
  rightSection: {
    alignItems: 'center',
  },
  statusIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
});

export default VisitList;