import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle, Rect, Text as SvgText, G, Line } from 'react-native-svg';
import { CephalometricLandmark } from '../types';

type Props = {
  landmarks: CephalometricLandmark[];
  showLabels?: boolean;
  angleValue?: number;
};

const landmarkDetails: Record<string, { color: string; desc: string }> = {
  S: { color: '#10b981', desc: 'Green Dot 1: Sella (S) - Superior Anchor' },
  Go: { color: '#10b981', desc: 'Green Dot 2: Gonion (Go) - Mandibular Angle' },
  Me: { color: '#10b981', desc: 'Green Dot 3: Menton (Me) - Chin Landmark' },
};

export const LandmarkOverlay: React.FC<Props> = ({ landmarks, showLabels = true, angleValue }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const getLandmark = (id: string) => landmarks.find((item) => item.id === id);
  const sella = getLandmark('S') || landmarks[0];
  const gonion = getLandmark('Go') || landmarks[2] || landmarks[1];
  const menton = getLandmark('Me') || landmarks[3] || landmarks[2];

  if (!sella || !gonion || !menton) return null;

  const threeDots = [
    { ...sella, id: 'S', name: 'Dot 1: Sella (S)' },
    { ...gonion, id: 'Go', name: 'Dot 2: Gonion (Go)' },
    { ...menton, id: 'Me', name: 'Dot 3: Menton (Me)' },
  ];

  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 700 520" preserveAspectRatio="none">
        {/* Ray 1: Dot 1 (S) to Dot 2 (Go) */}
        <Line
          x1={sella.x}
          y1={sella.y}
          x2={gonion.x}
          y2={gonion.y}
          stroke="#10b981"
          strokeWidth="3.5"
        />
        {/* Ray 2: Dot 2 (Go) to Dot 3 (Me) */}
        <Line
          x1={gonion.x}
          y1={gonion.y}
          x2={menton.x}
          y2={menton.y}
          stroke="#10b981"
          strokeWidth="3.5"
        />

        {/* 3 Green Landmark Dots */}
        {threeDots.map((item) => {
          const detail = landmarkDetails[item.id] || { color: '#10b981', desc: item.name };
          const isActive = activeId === item.id;
          return (
            <G key={item.id} onPress={() => setActiveId(isActive ? null : item.id)}>
              <Circle
                cx={item.x}
                cy={item.y}
                r={isActive ? 18 : 13}
                fill="#10b981"
                opacity={0.4}
              />
              <Circle
                cx={item.x}
                cy={item.y}
                r={7}
                fill="#10b981"
                stroke="#FFFFFF"
                strokeWidth={2.5}
              />
              {showLabels && (
                <G>
                  <Rect
                    x={item.x + 10}
                    y={item.y - 28}
                    width={item.name.length * 7 + 24}
                    height="22"
                    rx="6"
                    fill="rgba(15, 23, 42, 0.88)"
                  />
                  <SvgText
                    x={item.x + 16}
                    y={item.y - 13}
                    fill="#34d399"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {item.name}
                  </SvgText>
                </G>
              )}
            </G>
          );
        })}
      </Svg>
      {activeId && landmarkDetails[activeId] && (
        <TouchableOpacity style={styles.tooltip} onPress={() => setActiveId(null)}>
          <Text style={styles.tooltipTitle}>{activeId}</Text>
          <Text style={styles.tooltipText}>{landmarkDetails[activeId].desc}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#34d399',
  },
  tooltipTitle: {
    color: '#34d399',
    fontWeight: '800',
    fontSize: 14,
  },
  tooltipText: {
    color: '#f8fafc',
    fontSize: 12,
    marginTop: 2,
  },
});
