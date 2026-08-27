import React, { useState, useEffect } from 'react';
import { Image, View, Text, StyleSheet, ImageStyle, StyleProp } from 'react-native';
import { FileImage } from 'lucide-react-native';

type Props = {
  src: string;
  style?: StyleProp<ImageStyle>;
};

const DEFAULT_DEMO_IMAGE = 'https://raw.githubusercontent.com/CephalometricGrowthAnalysis/cephgrow-assets/main/ceph-average.jpeg';

export const CephalogramImage: React.FC<Props> = ({ src, style }) => {
  const [failed, setFailed] = useState(false);

  // Reset failed state whenever src changes
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const isUri = typeof src === 'string' && (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('data:') ||
    src.startsWith('file:') ||
    src.startsWith('content:') ||
    src.startsWith('/')
  );

  const source = isUri ? { uri: src } : { uri: DEFAULT_DEMO_IMAGE };

  if (failed) {
    return (
      <View style={[styles.fallback, style]}>
        <FileImage size={32} color="#94a3b8" />
        <Text style={styles.fallbackTitle}>Preview unavailable</Text>
        <Text style={styles.fallbackDesc}>Re-select image to view preview</Text>
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={[styles.image, style]}
      onError={() => {
        console.warn('Image load error for:', src);
        setFailed(true);
      }}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  fallbackTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  fallbackDesc: {
    marginTop: 4,
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
