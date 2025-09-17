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

const questions = [
  {
    id: 1,
    question: "When your child makes a mistake, you typically...",
    options: [
      { text: "Talk through the mistake and discuss consequences together.", type: "Authoritative" },
      { text: "Enforce a strict punishment with no discussion.", type: "Authoritarian" },
      { text: "Let it go—they'll figure it out eventually.", type: "Permissive" },
      { text: "Might not even be aware it happened.", type: "Neglectful" }
    ]
  },
  {
    id: 2,
    question: "How do you handle rules at home?",
    options: [
      { text: "Set clear rules but allow discussion and flexibility.", type: "Authoritative" },
      { text: "Have many strict rules and expect complete obedience.", type: "Authoritarian" },
      { text: "Rarely enforce rules—it's more important for them to be happy.", type: "Permissive" },
      { text: "Don't really have rules or expectations.", type: "Neglectful" }
    ]
  },
  {
    id: 3,
    question: "When your child wants to try something new (like a hobby or activity), you...",
    options: [
      { text: "Encourage them and guide them if needed.", type: "Authoritative" },
      { text: "Allow it only if you believe it's a worthwhile activity.", type: "Authoritarian" },
      { text: "Support whatever they want—it's totally up to them.", type: "Permissive" },
      { text: "Are often unaware of their interests.", type: "Neglectful" }
    ]
  },
  {
    id: 4,
    question: "How do you respond to your child's emotions?",
    options: [
      { text: "Acknowledge and validate their feelings while helping them cope.", type: "Authoritative" },
      { text: "Expect them to suppress emotions and \"toughen up.\"", type: "Authoritarian" },
      { text: "Comfort them immediately and try to avoid anything that causes distress.", type: "Permissive" },
      { text: "Struggle to connect with or notice their emotions.", type: "Neglectful" }
    ]
  },
  {
    id: 5,
    question: "When your child breaks a rule, you...",
    options: [
      { text: "Explain why the rule matters and enforce a fair consequence.", type: "Authoritative" },
      { text: "Punish them to ensure they never do it again.", type: "Authoritarian" },
      { text: "Don't enforce consequences—mistakes are part of life.", type: "Permissive" },
      { text: "Rarely follow up or take action.", type: "Neglectful" }
    ]
  },
  {
    id: 6,
    question: "How often do you spend quality time with your child?",
    options: [
      { text: "Regularly and intentionally—it's a priority.", type: "Authoritative" },
      { text: "Only during structured family time.", type: "Authoritarian" },
      { text: "Whenever they want to, often letting them lead.", type: "Permissive" },
      { text: "Rarely, due to being busy or unavailable.", type: "Neglectful" }
    ]
  },
  {
    id: 7,
    question: "How do you handle your child questioning your decisions?",
    options: [
      { text: "Welcome discussion and explain your reasoning.", type: "Authoritative" },
      { text: "Discourage any form of backtalk—your word is final.", type: "Authoritarian" },
      { text: "Usually go along with what they want.", type: "Permissive" },
      { text: "Don't engage—it's their problem.", type: "Neglectful" }
    ]
  },
  {
    id: 8,
    question: "What is your top parenting goal?",
    options: [
      { text: "Raising a confident, independent, and empathetic child.", type: "Authoritative" },
      { text: "Ensuring discipline, respect, and success.", type: "Authoritarian" },
      { text: "Keeping them happy and avoiding conflict.", type: "Permissive" },
      { text: "Just getting through the day.", type: "Neglectful" }
    ]
  },
  {
    id: 9,
    question: "How do you respond to your child's academic struggles?",
    options: [
      { text: "Help them work through it and find resources or strategies.", type: "Authoritative" },
      { text: "Demand better performance—no excuses.", type: "Authoritarian" },
      { text: "Reassure them that grades don't matter much.", type: "Permissive" },
      { text: "Don't involve yourself in their school matters.", type: "Neglectful" }
    ]
  },
  {
    id: 10,
    question: "How do you balance your needs with your child's?",
    options: [
      { text: "Try to meet both with healthy boundaries.", type: "Authoritative" },
      { text: "Prioritize your authority and expectations.", type: "Authoritarian" },
      { text: "Put their needs and wants first, always.", type: "Permissive" },
      { text: "Focus mostly on your own needs and space.", type: "Neglectful" }
    ]
  }
];

export default function ParentingStyleQuestionnaire({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [fadeAnim] = useState(new Animated.Value(1));

  const handleAnswer = (questionId, answerType) => {
    const newAnswers = { ...answers, [questionId]: answerType };
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
    const counts = {
      Authoritative: 0,
      Authoritarian: 0,
      Permissive: 0,
      Neglectful: 0
    };

    Object.values(answers).forEach(answer => {
      counts[answer]++;
    });

    const dominantStyle = Object.keys(counts).reduce((a, b) => 
      counts[a] > counts[b] ? a : b
    );

    return {
      dominantStyle,
      counts,
      answers
    };
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Parenting Style Assessment</Text>
        <Text style={styles.subtitle}>Question {currentQuestion + 1} of {questions.length}</Text>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
        <Text style={styles.questionText}>
          {questions[currentQuestion].question}
        </Text>

        <ScrollView style={styles.optionsContainer}>
          {questions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(questions[currentQuestion].id, option.type)}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>{option.text}</Text>
                <Ionicons name="chevron-forward" size={20} color="#666" />
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
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#2C3E50',
    flex: 1,
    lineHeight: 22,
  },
});

