import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { generateFallbackAnalysis, generateParentingAnalysis } from '../config/openai';

export default function AIParentingAnalysis({ 
  questionnaireResults, 
  onBack, 
  onRetake,
  onSave 
}) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateAnalysis();
  }, []);

  const generateAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to generate AI analysis, fallback to basic analysis if API fails
      let analysisData;
      try {
        analysisData = await generateParentingAnalysis(questionnaireResults);
      } catch (apiError) {
        console.log('OpenAI API not available, using fallback analysis');
        analysisData = generateFallbackAnalysis(questionnaireResults);
      }
      
      setAnalysis(analysisData);
    } catch (err) {
      console.error('Error generating analysis:', err);
      setError('Failed to generate analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(analysis);
    }
    Alert.alert(
      'Analysis Saved',
      'Your parenting analysis has been saved to your profile.',
      [{ text: 'OK' }]
    );
  };

  const handleRetry = () => {
    generateAnalysis();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498DB" />
          <Text style={styles.loadingText}>Generating your personalized analysis...</Text>
          <Text style={styles.loadingSubtext}>This may take a few moments</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={60} color="#E74C3C" />
          <Text style={styles.errorTitle}>Analysis Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!analysis) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No analysis available</Text>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { dominantStyle, counts } = questionnaireResults;
  const isFallback = analysis.isFallback;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="analytics" size={40} color="#3498DB" />
            <Text style={styles.headerTitle}>AI-Powered Analysis</Text>
            <Text style={styles.headerSubtitle}>
              {isFallback ? 'Basic Analysis' : 'Personalized Insights'}
            </Text>
          </View>
          {isFallback && (
            <View style={styles.fallbackNotice}>
              <Ionicons name="information-circle" size={16} color="#F39C12" />
              <Text style={styles.fallbackText}>
                Using basic analysis. Configure OpenAI API for detailed insights.
              </Text>
            </View>
          )}
        </View>

        {/* Results Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Parenting Style Results</Text>
          <View style={styles.resultsSummary}>
            <Text style={styles.dominantStyle}>{dominantStyle}</Text>
            <View style={styles.scoreBreakdown}>
              {Object.entries(counts).map(([style, count]) => (
                <View key={style} style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>{style}</Text>
                  <View style={styles.scoreBarContainer}>
                    <View 
                      style={[
                        styles.scoreBar, 
                        { 
                          width: `${(count / 10) * 100}%`,
                          backgroundColor: getStyleColor(style)
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.scoreValue}>{count}/10</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Overall Assessment */}
        {analysis.overallAssessment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overall Assessment</Text>
            <Text style={styles.assessmentText}>{analysis.overallAssessment}</Text>
          </View>
        )}

        {/* Strengths */}
        {analysis.strengths && analysis.strengths.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Strengths</Text>
            {analysis.strengths.map((strength, index) => (
              <View key={index} style={styles.listItem}>
                <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
                <Text style={styles.listText}>{strength}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Areas for Growth */}
        {analysis.areasForGrowth && analysis.areasForGrowth.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Areas for Growth</Text>
            {analysis.areasForGrowth.map((area, index) => (
              <View key={index} style={styles.listItem}>
                <Ionicons name="trending-up" size={20} color="#3498DB" />
                <Text style={styles.listText}>{area}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Child Development Impact */}
        {analysis.childDevelopmentImpact && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Impact on Your Child's Development</Text>
            <Text style={styles.impactText}>{analysis.childDevelopmentImpact}</Text>
          </View>
        )}

        {/* Specific Recommendations */}
        {analysis.specificRecommendations && analysis.specificRecommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specific Recommendations</Text>
            {analysis.specificRecommendations.map((recommendation, index) => (
              <View key={index} style={styles.listItem}>
                <Ionicons name="bulb" size={20} color="#F39C12" />
                <Text style={styles.listText}>{recommendation}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Long-term Considerations */}
        {analysis.longTermConsiderations && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Long-term Considerations</Text>
            <Text style={styles.considerationsText}>{analysis.longTermConsiderations}</Text>
          </View>
        )}

        {/* Balancing Act */}
        {analysis.balancingAct && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Finding Balance</Text>
            <Text style={styles.balanceText}>{analysis.balancingAct}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="save" size={20} color="#fff" />
            <Text style={styles.buttonText}>Save Analysis</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.retakeButton} onPress={onRetake}>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.buttonText}>Retake Assessment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color="#6C757D" />
            <Text style={styles.backButtonText}>Back to Results</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This analysis is based on your questionnaire responses and current parenting research.
            {isFallback ? ' For more detailed insights, consider configuring the OpenAI API.' : ''}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function to get color for each parenting style
const getStyleColor = (style) => {
  const colors = {
    Authoritative: '#27AE60',
    Authoritarian: '#E74C3C',
    Permissive: '#F39C12',
    Neglectful: '#95A5A6'
  };
  return colors[style] || '#6C757D';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E74C3C',
    marginTop: 15,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6C757D',
    marginTop: 5,
  },
  fallbackNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9E7',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  fallbackText: {
    fontSize: 12,
    color: '#B7791F',
    marginLeft: 8,
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  resultsSummary: {
    alignItems: 'center',
  },
  dominantStyle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3498DB',
    marginBottom: 15,
  },
  scoreBreakdown: {
    width: '100%',
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    width: 100,
  },
  scoreBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  scoreBar: {
    height: '100%',
    borderRadius: 4,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C757D',
    width: 40,
    textAlign: 'right',
  },
  assessmentText: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  listText: {
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  impactText: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
  },
  considerationsText: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
  },
  balanceText: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
  },
  buttonContainer: {
    padding: 20,
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#27AE60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 8,
  },
  retakeButton: {
    backgroundColor: '#3498DB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 8,
  },
  backButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6C757D',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButtonText: {
    color: '#6C757D',
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#3498DB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 18,
  },
});

