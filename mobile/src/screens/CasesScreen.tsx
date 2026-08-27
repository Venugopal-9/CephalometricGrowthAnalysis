import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Upload } from 'lucide-react-native';
import { CaseRecord } from '../types';
import { CaseRow } from '../components/CaseRow';

const demoCases: CaseRecord[] = [
  {
    id: 'CG-2401',
    patient: 'Demo Case A',
    image: 'https://raw.githubusercontent.com/CephalometricGrowthAnalysis/cephgrow-assets/main/ceph-average.jpeg',
    angle: 127.5,
    className: 'Average',
    confidence: 91,
    date: 'Serial 02',
  },
  {
    id: 'CG-2402',
    patient: 'Demo Case B',
    image: 'https://raw.githubusercontent.com/CephalometricGrowthAnalysis/cephgrow-assets/main/ceph-vertical.jpeg',
    angle: 139.2,
    className: 'Vertical',
    confidence: 88,
    date: 'Serial 01',
  },
  {
    id: 'CG-2403',
    patient: 'Demo Case C',
    image: 'https://raw.githubusercontent.com/CephalometricGrowthAnalysis/cephgrow-assets/main/ceph-horizontal.jpeg',
    angle: 116.4,
    className: 'Horizontal',
    confidence: 94,
    date: 'Serial 03',
  },
];

export const CasesScreen = ({ navigation }: any) => {
  const [allCases, setAllCases] = useState<CaseRecord[]>(demoCases);

  useEffect(() => {
    AsyncStorage.getItem('cephgrow-analysis-history')
      .then((stored) => {
        if (stored) {
          const userCases = JSON.parse(stored);
          setAllCases([...userCases, ...demoCases]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.tag}>Patient Cases</Text>
            <Text style={styles.title}>Growth Records</Text>
          </View>
          <TouchableOpacity
            style={styles.newBtn}
            onPress={() => navigation.navigate('UploadTab')}
          >
            <Upload size={14} color="#FFFFFF" />
            <Text style={styles.newBtnText}>Upload</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={allCases}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <CaseRow item={item} onPress={() => navigation.navigate('UploadTab')} />
          )}
          contentContainerStyle={styles.list}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tag: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0f766e',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0d9488',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  list: {
    paddingBottom: 16,
  },
});
