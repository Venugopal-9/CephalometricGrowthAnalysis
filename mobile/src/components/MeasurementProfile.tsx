import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Rect, Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { Measurements } from '../types';
import { classify, measureGrowthClass } from '../api/config';

type Props = {
  angle: number;
  measurements: Measurements;
};

export const MeasurementProfile: React.FC<Props> = ({ angle, measurements }) => {
  const metrics = [
    { label: 'Gonial 3-point angle', value: angle, unit: '°', min: 100, max: 155, horizontal: 121, vertical: 135, className: classify(angle) },
    ...(measurements.fma === undefined ? [] : [{ label: 'FMA', value: measurements.fma, unit: '°', min: 10, max: 60, horizontal: 21, vertical: 28, className: measureGrowthClass(measurements.fma, 21, 28) }]),
    ...(measurements.yAxis === undefined ? [] : [{ label: 'Y-axis', value: measurements.yAxis, unit: '°', min: 45, max: 80, horizontal: 59, vertical: 66, className: measureGrowthClass(measurements.yAxis, 59, 66) }]),
    ...(measurements.jarabakRatio === undefined ? [] : [{ label: 'Jarabak ratio', value: measurements.jarabakRatio, unit: '%', min: 45, max: 85, horizontal: 65, vertical: 60, className: measureGrowthClass(100 - measurements.jarabakRatio, 35, 40) }]),
  ];

  const chartHeight = 58 + metrics.length * 54;
  const getX = (val: number, metric: (typeof metrics)[0]) => 120 + ((val - metric.min) / (metric.max - metric.min)) * 260;

  return (
    <View style={styles.container}>
      <Svg viewBox={`0 0 400 ${chartHeight}`} style={styles.svg}>
        {metrics.map((metric, index) => {
          const y = 38 + index * 54;
          const first = Math.min(metric.horizontal, metric.vertical);
          const second = Math.max(metric.horizontal, metric.vertical);
          const xVal = Math.max(metric.min, Math.min(metric.value, metric.max));

          return (
            <G key={metric.label}>
              <SvgText x="4" y={y - 8} fill="#102a63" fontSize="12" fontWeight="bold">
                {metric.label}
              </SvgText>
              <SvgText x="4" y={y + 10} fill="#64748b" fontSize="10">
                {`${metric.value.toFixed(1)}${metric.unit} · ${metric.className}`}
              </SvgText>
              <Rect x="120" y={y - 14} width="260" height="14" rx="7" fill="#dbeafe" />
              <Rect x={getX(first, metric)} y={y - 14} width={getX(second, metric) - getX(first, metric)} height="14" fill="#e2e8f0" />
              <Rect x={getX(second, metric)} y={y - 14} width={380 - getX(second, metric)} height="14" rx="7" fill="#ffedd5" />
              <Line x1={getX(first, metric)} y1={y - 18} x2={getX(first, metric)} y2={y + 4} stroke="#64748b" strokeWidth="1" />
              <Line x1={getX(second, metric)} y1={y - 18} x2={getX(second, metric)} y2={y + 4} stroke="#64748b" strokeWidth="1" />
              <Circle cx={getX(xVal, metric)} cy={y - 7} r="6" fill="#1d4ed8" stroke="#FFFFFF" strokeWidth="2" />
            </G>
          );
        })}
        <SvgText x="120" y={chartHeight - 8} fill="#64748b" fontSize="10">Horizontal</SvgText>
        <SvgText x="230" y={chartHeight - 8} fill="#64748b" fontSize="10">Average</SvgText>
        <SvgText x="340" y={chartHeight - 8} fill="#64748b" fontSize="10">Vertical</SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  svg: {
    width: '100%',
  },
});
