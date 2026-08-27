import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CaseRecord, GrowthClass } from '../types';
import { CephalogramImage } from './CephalogramImage';

type Props = {
  item: CaseRecord;
  onPress?: () => void;
};

const badgeStyles: Record<GrowthClass, { bg: string; text: string }> = {
  Vertical: { bg: '#ffe4e6', text: '#be123c' },
  Average: { bg: '#ccfbf1', text: '#0f766e' },
  Horizontal: { bg: '#fef3c7', text: '#b45309' },
};

export const CaseRow: React.FC<Props> = ({ item, onPress }) => {
  const badge = badgeStyles[item.className];

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageBox}>
        <CephalogramImage src={item.image} style={styles.image} />
      </View>
      <View style={styles.content}>
        <Text style={styles.patient}>{item.patient}</Text>
        <Text style={styles.meta}>{`${item.id} · ${item.date}`}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.angle}>{`${item.angle}°`}</Text>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.text }]}>{item.className}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
  },
  imageBox: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  patient: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  meta: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  angle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
