import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../components/AuthProvider';
import { useTestStore } from '../stores/testStore';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import Button from '../components/Button';
import Card from '../components/Card';

export default function Tribe() {
  const { user, session, signInAnonymously, signOut, isLoading } = useAuth();
  const { isSyncing, lastSyncTime, syncWithSupabase } = useTestStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings & Sync</Text>
      
      <Card padding="lg">
        <Text style={styles.sectionTitle}>Account Status</Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : user ? (
          <>
            <Text style={styles.statusText}>✅ Connected to Cloud</Text>
            <Text style={styles.userIdText}>User ID: {user.id.substring(0, 8)}...</Text>
            <Text style={styles.infoText}>
              Your data is automatically backed up and synced across devices.
            </Text>
            <Button
              title="Sign Out"
              onPress={signOut}
              variant="outline"
              fullWidth
            />
          </>
        ) : (
          <>
            <Text style={styles.statusText}>📱 Local Mode</Text>
            <Text style={styles.infoText}>
              Your data is stored locally. Sign in to enable cloud backup and sync across devices.
            </Text>
            <Button
              title="Enable Cloud Sync"
              onPress={signInAnonymously}
              fullWidth
            />
          </>
        )}
      </Card>

      {user && (
        <Card padding="lg">
          <Text style={styles.sectionTitle}>Sync Status</Text>
          {isSyncing ? (
            <View style={styles.syncingContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.syncingText}>Syncing...</Text>
            </View>
          ) : lastSyncTime ? (
            <Text style={styles.statusText}>
              ✅ Last synced: {lastSyncTime.toLocaleTimeString()}
            </Text>
          ) : (
            <Text style={styles.statusText}>⏳ Not synced yet</Text>
          )}
          <Button
            title="Sync Now"
            onPress={syncWithSupabase}
            disabled={isSyncing}
            loading={isSyncing}
            variant="secondary"
            fullWidth
          />
        </Card>
      )}

      <Card padding="lg">
        <Text style={styles.sectionTitle}>Coming Soon</Text>
        <Text style={styles.comingSoonText}>👥 Share progress with friends</Text>
        <Text style={styles.comingSoonText}>🏆 Compare BioAge with others</Text>
        <Text style={styles.comingSoonText}>💬 Community insights</Text>
        <Text style={styles.comingSoonText}>🎯 Group challenges</Text>
      </Card>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>About Cloud Sync</Text>
        <Text style={styles.infoDescription}>
          • Your data is encrypted end-to-end{'\n'}
          • Automatic background sync{'\n'}
          • Works offline, syncs when connected{'\n'}
          • Free unlimited storage{'\n'}
          • Cancel anytime, keep local data
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  statusText: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  userIdText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    fontFamily: 'monospace',
  },
  infoText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: Typography.normal * Typography.base,
  },
  syncingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  syncingText: {
    marginLeft: Spacing.sm,
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  comingSoonText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  infoCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.primary,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.card,
  },
  infoTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  infoDescription: {
    fontSize: Typography.base,
    color: Colors.white,
    lineHeight: Typography.normal * Typography.base,
  },
});

