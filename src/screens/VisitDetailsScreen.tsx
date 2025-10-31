import React, { useState, useCallback, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, SafeAreaView, Button, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import { DatePicker } from "@s77rt/react-native-date-picker";
import type { DatePickerHandle } from "@s77rt/react-native-date-picker";

import { getVisits } from '../redux/slices/actions/getVisits';

import { setHelperDate,setCompanyName, resetList } from '../redux/slices/visitsSlice';
import VisitList from './VisitsList';
import { setSelectedVisitId } from '../redux/slices/visitsSlice';
import { clearSelectedVisit } from '../redux/slices/visitsSlice';
import { useRoute } from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import VisitScreen from '../interfaces/Visit';

const VisitDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
   const route = useRoute();
   const {visit} = route.params as {visit : VisitScreen}
  console.log(visit)
 const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isOverdue = new Date(visit.data_limita) < new Date() && !visit.efectuata;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerContent}>
            <Ionicons
              name="business"
              size={32}
              color="#2563eb"
            />
            <View style={styles.headerText}>
              <Text style={styles.companyName}>{visit.companie}</Text>
              {/* <Text style={styles.visitType}>
                Vizită {visit.tip_vizita === 'fizica' ? 'fizică' : 'la locul de muncă'}
              </Text> */}
            </View>
          </View>
        </View>

        {/* Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                visit.efectuata ? styles.completedBadge : styles.pendingBadge,
              ]}
            >
              <Ionicons
                name={visit.efectuata ? 'checkmark-circle' : 'time-outline'}
                size={20}
                color={visit.efectuata ? '#059669' : '#f59e0b'}
              />
              <Text
                style={[
                  styles.statusText,
                  visit.efectuata ? styles.completedText : styles.pendingText,
                ]}
              >
                {visit.efectuata ? 'Efectuată' : 'Neefectuata'}
              </Text>
            </View>

            {isOverdue && (
              <View style={styles.overdueAlert}>
                <Ionicons
                  name="alert-circle"
                  size={18}
                  color="#dc2626"
                />
                <Text style={styles.overdueText}>Depășită data limită</Text>
              </View>
            )}
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalii</Text>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons
                name="calendar"
                size={20}
                color="#2563eb"
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Data Limită</Text>
              <Text style={styles.detailValue}>
                {formatDate(visit.data_limita)}
              </Text>
            </View>
          </View>

        

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons
                name="document-text"
                size={20}
                color="#2563eb"
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Tip Vizită</Text>
              <Text style={styles.detailValue}>{visit.tip_vizita}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons
                name={visit.locatie_verificata ? 'checkmark-done' : 'location-outline'}
                size={20}
                color={visit.locatie_verificata ? '#059669' : '#9ca3af'}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Locație Verificată</Text>
              <Text
                style={[
                  styles.detailValue,
                  visit.locatie_verificata && styles.verifiedText,
                ]}
              >
                {visit.locatie_verificata ? 'Da' : 'Nu'}
              </Text>
            </View>
          </View>

          {visit.locatie && (
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons
                  name="location"
                  size={20}
                  color="#2563eb"
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Adresă</Text>
                <Text style={styles.detailValue}>{visit.locatie}</Text>
              </View>
            </View>
          )}



        {/* Additional Info */}
        {/* <View style={styles.section}>
          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle"
              size={18}
              color="#2563eb"
            />
            <Text style={styles.infoText}>
              Această vizită a fost programată pentru{' '}
              {formatDate(visit.data_limita)}
              {visit.efectuata ? ' și a fost completată.' : '.'}
            </Text>
          </View>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  visitType: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  completedBadge: {
    backgroundColor: '#d1fae5',
  },
  pendingBadge: {
    backgroundColor: '#fef3c7',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  completedText: {
    color: '#059669',
  },
  pendingText: {
    color: '#d97706',
  },
  overdueAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  overdueText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#dc2626',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2563eb',
  },
  detailIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  verifiedText: {
    color: '#059669',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 18,
  },
});

export default VisitDetailsScreen;