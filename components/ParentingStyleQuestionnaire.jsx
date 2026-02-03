import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Animated,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Likert scale labels
const LIKERT_SCALE = [
  { value: 1, label: 'Never' },
  { value: 2, label: 'Rarely' },
  { value: 3, label: 'Sometimes' },
  { value: 4, label: 'Often' },
  { value: 5, label: 'Always' },
];

// 20 questions organized by style (5 per style)
const questions = [
  // Authoritative (A1-A5)
  {
    id: 'A1',
    question: "I explain the reason behind the rules (not just \"because I said so\").",
    style: 'Authoritative',
    category: 'A'
  },
  {
    id: 'A2',
    question: "I set clear expectations, and I'm open to discussion if my teen disagrees respectfully.",
    style: 'Authoritative',
    category: 'A'
  },
  {
    id: 'A3',
    question: "When my teen messes up, we focus on learning and consequences—not shame.",
    style: 'Authoritative',
    category: 'A'
  },
  {
    id: 'A4',
    question: "I encourage independence while still setting boundaries.",
    style: 'Authoritative',
    category: 'A'
  },
  {
    id: 'A5',
    question: "I regularly check in on feelings (stress, friendships, mood) and listen fully.",
    style: 'Authoritative',
    category: 'A'
  },
  // Authoritarian (B1-B5)
  {
    id: 'B1',
    question: "I expect immediate obedience when I give an instruction.",
    style: 'Authoritarian',
    category: 'B'
  },
  {
    id: 'B2',
    question: "I believe strict rules matter more than my teen's opinion in family decisions.",
    style: 'Authoritarian',
    category: 'B'
  },
  {
    id: 'B3',
    question: "I use punishment to enforce compliance (even if my teen doesn't understand why).",
    style: 'Authoritarian',
    category: 'B'
  },
  {
    id: 'B4',
    question: "If my teen questions a rule, I see it as disrespectful.",
    style: 'Authoritarian',
    category: 'B'
  },
  {
    id: 'B5',
    question: "I raise my voice or use threats when my teen won't cooperate.",
    style: 'Authoritarian',
    category: 'B'
  },
  // Permissive (C1-C5)
  {
    id: 'C1',
    question: "I avoid setting firm rules because I don't want conflict.",
    style: 'Permissive',
    category: 'C'
  },
  {
    id: 'C2',
    question: "If my teen strongly resists, I often give in to keep peace.",
    style: 'Permissive',
    category: 'C'
  },
  {
    id: 'C3',
    question: "I prefer being a friend to my teen rather than enforcing discipline.",
    style: 'Permissive',
    category: 'C'
  },
  {
    id: 'C4',
    question: "My teen decides most things (sleep, screen time, study routine) with minimal limits.",
    style: 'Permissive',
    category: 'C'
  },
  {
    id: 'C5',
    question: "Even when rules exist, I don't consistently follow through on consequences.",
    style: 'Permissive',
    category: 'C'
  },
  // Uninvolved/Neglectful (D1-D5)
  {
    id: 'D1',
    question: "I'm often too busy/tired to notice my teen's emotional state.",
    style: 'Uninvolved',
    category: 'D'
  },
  {
    id: 'D2',
    question: "I rarely track school deadlines, friendships, or daily routines.",
    style: 'Uninvolved',
    category: 'D'
  },
  {
    id: 'D3',
    question: "I don't have clear expectations about behavior at home.",
    style: 'Uninvolved',
    category: 'D'
  },
  {
    id: 'D4',
    question: "When problems come up, I tend to disengage rather than address them.",
    style: 'Uninvolved',
    category: 'D'
  },
  {
    id: 'D5',
    question: "I spend very little one-on-one time talking or doing activities with my teen.",
    style: 'Uninvolved',
    category: 'D'
  },
];

export default function ParentingStyleQuestionnaire({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [fadeAnim] = useState(new Animated.Value(1));

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    // Animate to next question
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Calculate results
        const results = calculateResults(newAnswers);
        onComplete(results);
      }
    }, 200);
  };

  const calculateResults = (answers) => {
    // Step 1: Compute subscale scores (means)
    const authoritativeScores = [];
    const authoritarianScores = [];
    const permissiveScores = [];
    const uninvolvedScores = [];

    questions.forEach(q => {
      const answer = answers[q.id];
      if (answer !== undefined) {
        switch (q.style) {
          case 'Authoritative':
            authoritativeScores.push(answer);
            break;
          case 'Authoritarian':
            authoritarianScores.push(answer);
            break;
          case 'Permissive':
            permissiveScores.push(answer);
            break;
          case 'Uninvolved':
            uninvolvedScores.push(answer);
            break;
        }
      }
    });

    const AUTHO = authoritativeScores.length > 0 
      ? authoritativeScores.reduce((a, b) => a + b, 0) / authoritativeScores.length 
      : 0;
    const AUTHN = authoritarianScores.length > 0 
      ? authoritarianScores.reduce((a, b) => a + b, 0) / authoritarianScores.length 
      : 0;
    const PERM = permissiveScores.length > 0 
      ? permissiveScores.reduce((a, b) => a + b, 0) / permissiveScores.length 
      : 0;
    const UNINV = uninvolvedScores.length > 0 
      ? uninvolvedScores.reduce((a, b) => a + b, 0) / uninvolvedScores.length 
      : 0;

    const scores = {
      Authoritative: AUTHO,
      Authoritarian: AUTHN,
      Permissive: PERM,
      Uninvolved: UNINV
    };

    // Step 2: Assign parenting style label (highest subscale score)
    const sortedScores = Object.entries(scores)
      .sort(([, a], [, b]) => b - a);

    const topScore = sortedScores[0];
    const secondTopScore = sortedScores[1];

    // Step 3: Calculate confidence score
    const confidence = topScore[1] - (secondTopScore ? secondTopScore[1] : 0);

    // Step 4: Handle edge cases / tie-break
    let predictedStyle = topScore[0];
    let isMixed = false;
    let mixedStyles = null;

    if (confidence < 0.20 && secondTopScore) {
      isMixed = true;
      mixedStyles = [topScore[0], secondTopScore[0]].sort().join('–');
      predictedStyle = 'Mixed';
    }

    // Map Uninvolved to Neglectful for backward compatibility
    const styleMapping = {
      'Authoritative': 'Authoritative',
      'Authoritarian': 'Authoritarian',
      'Permissive': 'Permissive',
      'Uninvolved': 'Neglectful',
      'Mixed': 'Mixed'
    };

    const dominantStyle = styleMapping[predictedStyle] || predictedStyle;

    // Interpret confidence
    let confidenceLevel = 'low';
    if (confidence >= 0.51) {
      confidenceLevel = 'strong';
    } else if (confidence >= 0.21) {
      confidenceLevel = 'moderate';
    }

    return {
      dominantStyle,
      scores,
      confidence,
      confidenceLevel,
      isMixed,
      mixedStyles,
      answers,
      // For backward compatibility, also include counts (but as means)
      counts: {
        Authoritative: Math.round(AUTHO * 10) / 10,
        Authoritarian: Math.round(AUTHN * 10) / 10,
        Permissive: Math.round(PERM * 10) / 10,
        Neglectful: Math.round(UNINV * 10) / 10
      }
    };
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const selectedValue = answers[currentQ?.id];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Parenting Style Assessment</Text>
        <Text style={styles.subtitle}>Question {currentQuestion + 1} of {questions.length}</Text>
        <Text style={styles.instruction}>
          Answer based on your typical behavior with your teen (10–17)
        </Text>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
        <Text style={styles.questionText}>
          {currentQ?.question}
        </Text>

        <ScrollView style={styles.optionsContainer}>
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>Never</Text>
            <Text style={styles.scaleLabel}>Always</Text>
          </View>

          {LIKERT_SCALE.map((scale) => (
            <TouchableOpacity
              key={scale.value}
              style={[
                styles.radioButton,
                selectedValue === scale.value && styles.radioButtonSelected
              ]}
              onPress={() => handleAnswer(currentQ.id, scale.value)}
            >
              <View style={styles.radioContent}>
                <View style={styles.radioCircle}>
                  {selectedValue === scale.value && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={[
                  styles.radioLabel,
                  selectedValue === scale.value && styles.radioLabelSelected
                ]}>
                  {scale.value}. {scale.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 5,
  },
  instruction: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E9ECEF',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3498DB',
    borderRadius: 2,
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    lineHeight: 26,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  scaleLabel: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '500',
  },
  radioButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  radioButtonSelected: {
    borderColor: '#3498DB',
    backgroundColor: '#EBF5FB',
  },
  radioContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6C757D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3498DB',
  },
  radioLabel: {
    fontSize: 16,
    color: '#2C3E50',
    flex: 1,
  },
  radioLabelSelected: {
    fontWeight: '600',
    color: '#2C3E50',
  },
});
