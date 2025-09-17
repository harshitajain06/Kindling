import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { getAssessmentStats } from '../services/assessmentService';

export default function AssessmentStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const assessmentStats = await getAssessmentStats();
      setStats(assessmentStats);
    } catch (err) {
      setError('Failed to load assessment statistics');
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStyleColor = (style) => {
    const colors = {
      Authoritative: '#27AE60',
      Authoritarian: '#E74C3C',
      Permissive: '#F39C12',
      Neglectful: '#95A5A6'
    };
    return colors[style] || '#3498DB';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498DB" />
        <Text style={styles.loadingText}>Loading statistics...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={50} color="#E74C3C" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadStats}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Ionicons name="analytics" size={32} color="#3498DB" />
        <Text style={styles.title}>Assessment Statistics</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadStats}>
          <Ionicons name="refresh" size={20} color="#3498DB" />
        </TouchableOpacity>
      </View>

      {/* Total Assessments */}
      <View style={styles.statCard}>
        <Text style={styles.statCardTitle}>Total Assessments</Text>
        <Text style={styles.statCardValue}>{stats?.totalAssessments || 0}</Text>
      </View>

      {/* Style Distribution */}
      <View style={styles.statCard}>
        <Text style={styles.statCardTitle}>Parenting Style Distribution</Text>
        {Object.entries(stats?.styleDistribution || {}).map(([style, count]) => (
          <View key={style} style={styles.distributionItem}>
            <View style={[styles.styleIndicator, { backgroundColor: getStyleColor(style) }]} />
            <Text style={styles.styleName}>{style}</Text>
            <Text style={styles.styleCount}>{count}</Text>
            <Text style={styles.stylePercentage}>
              ({stats?.totalAssessments > 0 ? ((count / stats.totalAssessments) * 100).toFixed(1) : 0}%)
            </Text>
          </View>
        ))}
      </View>

      {/* Average Scores */}
      <View style={styles.statCard}>
        <Text style={styles.statCardTitle}>Average Scores</Text>
        {Object.entries(stats?.averageScores || {}).map(([style, average]) => (
          <View key={style} style={styles.averageItem}>
            <Text style={styles.averageStyle}>{style}</Text>
            <Text style={styles.averageValue}>{average}/10</Text>
          </View>
        ))}
      </View>

      {/* Last Updated */}
      <Text style={styles.lastUpdated}>
        Last updated: {new Date().toLocaleString()}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 10,
    flex: 1,
  },
  refreshButton: {
    padding: 5,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  statCardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3498DB',
    textAlign: 'center',
  },
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  styleIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  styleName: {
    fontSize: 16,
    color: '#2C3E50',
    flex: 1,
  },
  styleCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginRight: 10,
  },
  stylePercentage: {
    fontSize: 14,
    color: '#6C757D',
  },
  averageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  averageStyle: {
    fontSize: 16,
    color: '#2C3E50',
  },
  averageValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498DB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6C757D',
    marginTop: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    marginTop: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

