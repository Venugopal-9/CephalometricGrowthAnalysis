import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Upload, LogOut } from 'lucide-react-native';
import { CaseRecord } from '../types';
import { CaseRow } from '../components/CaseRow';
import { useAuth } from '../context/AuthContext';

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

export const DashboardScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [userCases, setUserCases] = useState<CaseRecord[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('cephgrow-analysis-history')
      .then((stored) => {
        if (stored) {
          setUserCases(JSON.parse(stored));
        }
      })
      .catch(() => {});
  }, []);

  const allCases = [...userCases, ...demoCases].slice(0, 5);

  const totals = [
    { label: 'Total Cases', val: '128' },
    { label: 'Average', val: '54' },
    { label: 'Horizontal', val: '39' },
    { label: 'Vertical', val: '35' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>{`Welcome, ${user?.name || 'Doctor'}`}</Text>
            <Text style={styles.subhead}>Cephalometric growth analysis dashboard</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <LogOut size={18} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Total Cards */}
        <View style={styles.statsGrid}>
          {totals.map((t) => (
            <View key={t.label} style={styles.statCard}>
              <Text style={styles.statLabel}>{t.label}</Text>
              <Text style={styles.statVal}>{t.val}</Text>
            </View>
          ))}
        </View>

        {/* Quick Action */}
        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>Next Clinical Action</Text>
          <Text style={styles.actionBody}>
            Upload a lateral cephalogram scan to run AI landmark detection and growth pattern support analysis.
          </Text>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('UploadTab')}
          >
            <Upload size={16} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>Upload Cephalogram</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Cases */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Serial Cases</Text>
          {allCases.map((c) => (
            <CaseRow key={c.id} item={c} onPress={() => navigation.navigate('UploadTab')} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scroll: {
    padding: 16,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
  },
  subhead: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  logoutBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  statVal: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 4,
  },
  actionCard: {
    backgroundColor: '#17212b',
    padding: 16,
    borderRadius: 14,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionBody: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 6,
    lineHeight: 18,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0d9488',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 14,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
});
