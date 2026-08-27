import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AnalysisResult, GrowthClass, Measurements } from '../types';
import { CephalogramImage } from './CephalogramImage';
import { LandmarkOverlay } from './LandmarkOverlay';
import { MeasurementProfile } from './MeasurementProfile';
import { classify, measureGrowthClass } from '../api/config';

type Props = {
  imageSrc: string;
  result: AnalysisResult;
  measurements: Measurements;
};

const badgeStyles: Record<GrowthClass, { bg: string; text: string }> = {
  Vertical: { bg: '#ffe4e6', text: '#be123c' },
  Average: { bg: '#ccfbf1', text: '#0f766e' },
  Horizontal: { bg: '#fef3c7', text: '#b45309' },
};

export const GeneratedVisuals: React.FC<Props> = ({ imageSrc, result, measurements }) => {
  const angle = Number(result.angle);
  const className = result.growthClass;
  const badge = badgeStyles[className];

  const evidence = [
    { label: 'Mandibular plane', value: `${angle.toFixed(1)}°`, result: classify(angle) },
    ...(measurements.fma === undefined ? [] : [{ label: 'FMA', value: `${measurements.fma.toFixed(1)}°`, result: measureGrowthClass(measurements.fma, 21, 28) }]),
    ...(measurements.yAxis === undefined ? [] : [{ label: 'Y-axis', value: `${measurements.yAxis.toFixed(1)}°`, result: measureGrowthClass(measurements.yAxis, 59, 66) }]),
    ...(measurements.jarabakRatio === undefined ? [] : [{ label: 'Jarabak ratio', value: `${measurements.jarabakRatio.toFixed(1)}%`, result: measureGrowthClass(100 - measurements.jarabakRatio, 35, 40) }]),
  ];

  const aligned = evidence.filter((item) => item.result === className).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTag}>Generated Support Report</Text>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.text }]}>{`${className} Grower`}</Text>
        </View>
      </View>

      {/* Annotated Cephalogram card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Annotated Cephalogram</Text>
        <View style={styles.imageBox}>
          <CephalogramImage src={imageSrc} style={styles.image} />
          {result.landmarks && <LandmarkOverlay landmarks={result.landmarks} showLabels={false} />}
        </View>
        <Text style={styles.cardDesc}>
          Reviewed landmark points and mandibular plane reference.
        </Text>
      </View>

      {/* Measurement Profile */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Entered Measures vs Reference Bands</Text>
        <MeasurementProfile angle={angle} measurements={measurements} />
      </View>

      {/* AI Alignment & Prompts */}
      <View style={[styles.card, styles.highlightCard]}>
        <Text style={styles.highlightTitle}>{`AI Alignment: ${aligned}/${evidence.length}`}</Text>
        {evidence.map((item) => (
          <View key={item.label} style={styles.evidenceRow}>
            <Text style={styles.evidenceLabel}>{`${item.label}: ${item.value}`}</Text>
            <Text style={[styles.evidenceResult, { color: badgeStyles[item.result].text }]}>
              {item.result}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTag: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ea580c',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  imageBox: {
    height: 220,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
  },
  highlightCard: {
    backgroundColor: '#fff7ed',
    borderColor: '#ffedd5',
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#9a3412',
    marginBottom: 8,
  },
  evidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#fed7aa',
  },
  evidenceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  evidenceResult: {
    fontSize: 13,
    fontWeight: '800',
  },
});
