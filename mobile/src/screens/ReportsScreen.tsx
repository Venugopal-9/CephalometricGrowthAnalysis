import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CaseRecord, GrowthClass } from '../types';
import { CephalogramImage } from '../components/CephalogramImage';

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

const badgeStyles: Record<GrowthClass, { bg: string; text: string }> = {
  Vertical: { bg: '#ffe4e6', text: '#be123c' },
  Average: { bg: '#ccfbf1', text: '#0f766e' },
  Horizontal: { bg: '#fef3c7', text: '#b45309' },
};

export const ReportsScreen = () => {
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
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.tag}>Reports</Text>
          <Text style={styles.title}>Growth Pattern Summary</Text>
        </View>

        {allCases.map((item, idx) => {
          const badge = badgeStyles[item.className];
          return (
            <View key={`${item.id}-${idx}`} style={styles.card}>
              <View style={styles.imageBox}>
                <CephalogramImage src={item.image} style={styles.image} />
              </View>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.patient}>{item.patient}</Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.badgeText, { color: badge.text }]}>{item.className}</Text>
                </View>
              </View>

              <Text style={styles.desc}>
                {`Mandibular angle of ${item.angle}° with ${item.confidence}% model confidence. Clinician verification recommended.`}
              </Text>
            </View>
          );
        })}
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
    gap: 14,
  },
  header: {
    marginBottom: 4,
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
  card: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  imageBox: {
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  patient: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  date: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  desc: {
    fontSize: 13,
    color: '#475569',
    marginTop: 8,
    lineHeight: 18,
  },
});
