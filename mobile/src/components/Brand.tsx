import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ruler } from 'lucide-react-native';

export const Brand: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Ruler size={20} color="#FFFFFF" />
      </View>
      <View>
        <Text style={styles.title}>CephGrow AI</Text>
        <Text style={styles.subtitle}>Cephalometric intelligence</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.style({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#1d4ed8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
});
