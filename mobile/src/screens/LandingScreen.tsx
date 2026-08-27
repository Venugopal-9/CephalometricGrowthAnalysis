import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Sparkles, UserPlus, ChevronRight, Brain, Cloud, ShieldCheck, LineChart, Ruler } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

export const LandingScreen = ({ navigation }: any) => {
  const { user } = useAuth();

  const metrics = [
    { label: 'Demo scans', value: '3.2k+' },
    { label: 'Time saved', value: '68%' },
    { label: 'Growth groups', value: '3' },
    { label: 'Audit ready', value: '100%' },
  ];

  const features = [
    { Icon: Brain, title: 'AI angle support', body: 'Vision-ready endpoint for landmark reasoning and report generation.' },
    { Icon: Cloud, title: 'Neon + Prisma', body: 'Patient cases, angles, classes, and confidence scores are ready for persistence.' },
    { Icon: ShieldCheck, title: 'Protected workspace', body: 'Uploads and X-ray tools are only visible after login or signup.' },
    { Icon: LineChart, title: 'Serial trends', body: 'Compare prior and current scans to visualize growth progression.' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Top Header / Brand */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Ruler size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.brandTitle}>CephGrow AI</Text>
          </View>
          <View style={styles.authButtons}>
            {user ? (
              <TouchableOpacity
                style={styles.workspaceBtn}
                onPress={() => navigation.navigate('MainTabs')}
              >
                <Text style={styles.workspaceBtnText}>Workspace</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.loginHeaderBtn}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.loginHeaderBtnText}>Login</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroCard}>
          <View style={styles.tag}>
            <Sparkles size={14} color="#0f766e" />
            <Text style={styles.tagText}>AI Growth Pattern Prediction</Text>
          </View>
          <Text style={styles.heroTitle}>
            Measure angles. Predict growth. Plan orthodontics with confidence.
          </Text>
          <Text style={styles.heroBody}>
            A clinical app for lateral cephalograms, mandibular plane angle review, and growth classification.
          </Text>

          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={styles.primaryCta}
              onPress={() => navigation.navigate(user ? 'MainTabs' : 'Signup')}
            >
              <Text style={styles.primaryCtaText}>{user ? 'Open Workspace' : 'Create Account'}</Text>
              <UserPlus size={16} color="#FFFFFF" />
            </TouchableOpacity>

            {!user && (
              <TouchableOpacity
                style={styles.secondaryCta}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.secondaryCtaText}>Sign In</Text>
                <ChevronRight size={16} color="#334155" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          {metrics.map((m) => (
            <View key={m.label} style={styles.metricCard}>
              <Text style={styles.metricValue}>{m.value}</Text>
              <Text style={styles.metricLabel}>{m.label}</Text>
            </View>
          ))}
        </View>

        {/* Platform Features */}
        <Text style={styles.sectionHeaderTitle}>Platform Capabilities</Text>
        <View style={styles.featuresGrid}>
          {features.map(({ Icon, title, body }) => (
            <View key={title} style={styles.featureCard}>
              <Icon size={22} color="#0d9488" />
              <Text style={styles.featureTitle}>{title}</Text>
              <Text style={styles.featureBody}>{body}</Text>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#1d4ed8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  authButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  workspaceBtn: {
    backgroundColor: '#17212b',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  workspaceBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  loginHeaderBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loginHeaderBtnText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 13,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ccfbf1',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f766e',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    lineHeight: 32,
  },
  heroBody: {
    fontSize: 14,
    color: '#475569',
    marginTop: 8,
    lineHeight: 20,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  primaryCta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0d9488',
    paddingVertical: 12,
    borderRadius: 10,
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  secondaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  secondaryCtaText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 14,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 8,
  },
  featuresGrid: {
    gap: 10,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 8,
  },
  featureBody: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 18,
  },
});
