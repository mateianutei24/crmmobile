import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SectionTitleProps {
  iconName: string;
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ iconName, title }) => {
  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={22} color="#007AFF" style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
});

export default SectionTitle;
