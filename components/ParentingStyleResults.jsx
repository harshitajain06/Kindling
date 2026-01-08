import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { generateDescriptiveTitle } from '../config/openai';

// Function to get icon name based on parenting style
const getStyleIcon = (style) => {
  const iconMap = {
    Authoritative: "heart-circle",
    Authoritarian: "school",
    Permissive: "heart",
    Neglectful: "refresh-circle"
  };
  return iconMap[style] || "heart";
};

const styleDescriptions = {
  Authoritative: {
    title: "Authoritative Parent",
    emoji: "🤝",
    description: "You balance warmth and structure beautifully!",
    characteristics: [
      "Set clear expectations with love and understanding",
      "Encourage independence while providing guidance",
      "Use reasoning and explanation in discipline",
      "Are responsive to your child's emotional needs",
      "Create a nurturing environment with appropriate boundaries"
    ],
    strengths: [
      "Children tend to be confident and self-reliant",
      "Better academic performance and social skills",
      "Lower rates of behavioral problems",
      "Strong parent-child relationship"
    ],
    tips: [
      "Continue being consistent with rules and consequences",
      "Keep listening to your child's perspective",
      "Maintain the balance between support and structure"
    ],
    color: "#27AE60"
  },
  Authoritarian: {
    title: "Authoritarian Parent",
    emoji: "📏",
    description: "You value discipline and structure!",
    characteristics: [
      "Set strict rules with high expectations",
      "Believe in obedience and respect for authority",
      "Use punishment as the primary discipline method",
      "Less likely to explain reasoning behind rules",
      "Focus on control and order"
    ],
    strengths: [
      "Children often perform well academically",
      "Clear boundaries and expectations",
      "Strong sense of responsibility",
      "Respect for authority figures"
    ],
    tips: [
      "Try to explain the reasoning behind rules",
      "Consider your child's perspective more often",
      "Balance discipline with warmth and understanding",
      "Allow for some flexibility when appropriate"
    ],
    color: "#E74C3C"
  },
  Permissive: {
    title: "Permissive Parent",
    emoji: "💝",
    description: "You prioritize your child's happiness and freedom!",
    characteristics: [
      "Set few rules and boundaries",
      "Avoid confrontation and conflict",
      "Act more like a friend than a parent",
      "Allow children to regulate their own behavior",
      "Provide lots of warmth and affection"
    ],
    strengths: [
      "Children feel loved and accepted",
      "High self-esteem and creativity",
      "Strong emotional connection",
      "Children feel heard and valued"
    ],
    tips: [
      "Consider setting more consistent boundaries",
      "Practice saying 'no' when necessary",
      "Balance freedom with appropriate limits",
      "Help children understand consequences of their actions"
    ],
    color: "#F39C12"
  },
  Neglectful: {
    title: "Neglectful Parent",
    emoji: "😔",
    description: "You may be dealing with challenges that affect your parenting!",
    characteristics: [
      "Provide little guidance, nurturing, or attention",
      "May be overwhelmed by personal problems",
      "Uninvolved in child's life and activities",
      "Few expectations for behavior or achievement",
      "Limited emotional connection"
    ],
    strengths: [
      "Children may develop independence early",
      "Opportunity for significant positive change",
      "Self-awareness is the first step to improvement"
    ],
    tips: [
      "Consider seeking support or counseling",
      "Start with small, consistent interactions",
      "Set aside dedicated time for your child",
      "Focus on building emotional connection",
      "Don't hesitate to ask for help from family or professionals"
    ],
    color: "#95A5A6"
  }
};

export default function ParentingStyleResults({ results, onRetake, onClose, onViewAIAnalysis }) {
  const { dominantStyle, counts } = results;
  const styleInfo = styleDescriptions[dominantStyle];
  const [descriptiveTitle, setDescriptiveTitle] = useState(null);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(true);

  useEffect(() => {
    const generateTitle = async () => {
      if (!results) return;
      
      setIsGeneratingTitle(true);
      try {
        const title = await generateDescriptiveTitle(results);
        setDescriptiveTitle(title);
      } catch (error) {
        console.error('Error generating descriptive title:', error);
        // Use fallback from styleDescriptions
        setDescriptiveTitle(styleInfo?.description || 'Your unique parenting approach');
      } finally {
        setIsGeneratingTitle(false);
      }
    };

    generateTitle();
  }, [results, styleInfo]);

  const getScoreBar = (style, count) => {
    const maxCount = Math.max(...Object.values(counts));
    const percentage = (count / maxCount) * 100;
    
    return (
      <View key={style} style={styles.scoreItem}>
        <Text style={styles.scoreLabel}>{style}</Text>
        <View style={styles.scoreBarContainer}>
          <View style={[styles.scoreBar, { width: `${percentage}%`, backgroundColor: styleDescriptions[style].color }]} />
        </View>
        <Text style={styles.scoreValue}>{count}/10</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <View style={[styles.iconOuterRing, { borderColor: `${styleInfo.color}40` }]}>
              <View style={[styles.iconCircle, { backgroundColor: styleInfo.color }]}>
                <Ionicons 
                  name={getStyleIcon(dominantStyle)} 
                  size={48} 
                  color="#fff" 
                />
              </View>
            </View>
          </View>
          {isGeneratingTitle ? (
            <View style={styles.loadingTitleContainer}>
              <ActivityIndicator size="small" color={styleInfo.color} />
              <Text style={styles.loadingTitleText}>Generating your personalized description...</Text>
            </View>
          ) : (
            <Text style={styles.headerTitle}>
              {descriptiveTitle || styleInfo.description}
            </Text>
          )}
        </View>

        {/* Score Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Results</Text>
          {Object.entries(counts).map(([style, count]) => getScoreBar(style, count))}
        </View>

        {/* Characteristics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Parenting Characteristics</Text>
          {styleInfo.characteristics.map((characteristic, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={20} color={styleInfo.color} />
              <Text style={styles.listText}>{characteristic}</Text>
            </View>
          ))}
        </View>

        {/* Strengths */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Strengths</Text>
          {styleInfo.strengths.map((strength, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="star" size={20} color="#F1C40F" />
              <Text style={styles.listText}>{strength}</Text>
            </View>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Growth Opportunities</Text>
          {styleInfo.tips.map((tip, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="bulb" size={20} color="#3498DB" />
              <Text style={styles.listText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {onViewAIAnalysis && (
            <TouchableOpacity style={[styles.button, styles.aiAnalysisButton]} onPress={onViewAIAnalysis}>
              <Ionicons name="analytics" size={20} color="#fff" />
              <Text style={styles.buttonText}>Get AI Analysis</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={[styles.button, styles.retakeButton]} onPress={onRetake}>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.buttonText}>Retake Assessment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  iconWrapper: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOuterRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 10,
  },
  loadingTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  loadingTitleText: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 8,
    textAlign: 'center',
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
  buttonContainer: {
    flexDirection: 'column',
    padding: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 8,
  },
  aiAnalysisButton: {
    backgroundColor: '#9B59B6',
  },
  retakeButton: {
    backgroundColor: '#6C757D',
  },
  closeButton: {
    backgroundColor: '#27AE60',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

