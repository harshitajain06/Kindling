import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { ActivityIndicator, Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ParentingStyleQuestionnaire from "../../components/ParentingStyleQuestionnaire";
import ParentingStyleResults from "../../components/ParentingStyleResults";
import { auth } from '../../config/firebase';
import { getAssessmentResults, saveAssessmentResults } from "../../services/assessmentService";

// Function to get personalized suggestions based on parenting style
const getPersonalizedSuggestions = (dominantStyle) => {
  const suggestions = {
    Authoritative: [
      {
        icon: "book",
        color: "#3498DB",
        title: "Advanced Communication Techniques",
        description: "Learn advanced active listening and empathy-building skills to strengthen your already strong connection with your child."
      },
      {
        icon: "bulb",
        color: "#F39C12",
        title: "Balancing Structure with Flexibility",
        description: "Explore ways to maintain your effective structure while adapting to your child's changing needs and developmental stages."
      },
      {
        icon: "people",
        color: "#27AE60",
        title: "Mentoring Other Parents",
        description: "Share your successful parenting strategies with other parents who are working to develop a more balanced approach."
      },
      {
        icon: "trending-up",
        color: "#E74C3C",
        title: "Long-term Relationship Building",
        description: "Focus on maintaining your strong parent-child relationship as your child enters adolescence and young adulthood."
      }
    ],
    Authoritarian: [
      {
        icon: "heart",
        color: "#E74C3C",
        title: "Building Emotional Connection",
        description: "Learn techniques to express warmth and affection while maintaining your structured approach to parenting."
      },
      {
        icon: "chatbubbles",
        color: "#3498DB",
        title: "Open Communication Skills",
        description: "Develop skills to explain your reasoning and listen to your child's perspective while maintaining authority."
      },
      {
        icon: "hand-left",
        color: "#F39C12",
        title: "Flexible Discipline Strategies",
        description: "Explore alternative discipline methods that maintain respect while being more collaborative and understanding."
      },
      {
        icon: "happy",
        color: "#27AE60",
        title: "Positive Reinforcement Techniques",
        description: "Learn to balance consequences with positive reinforcement to encourage desired behaviors."
      }
    ],
    Permissive: [
      {
        icon: "shield-checkmark",
        color: "#3498DB",
        title: "Setting Healthy Boundaries",
        description: "Learn to establish clear, consistent limits while maintaining your warm and loving approach to parenting."
      },
      {
        icon: "checkmark-circle",
        color: "#27AE60",
        title: "Consistent Follow-Through",
        description: "Develop strategies to follow through on consequences while preserving your child's sense of being heard and valued."
      },
      {
        icon: "school",
        color: "#F39C12",
        title: "Teaching Responsibility",
        description: "Help your child develop self-discipline and responsibility while maintaining their high self-esteem and creativity."
      },
      {
        icon: "time",
        color: "#E74C3C",
        title: "Structured Routines",
        description: "Introduce gentle structure and routines that provide security while respecting your child's autonomy."
      }
    ],
    Neglectful: [
      {
        icon: "heart-circle",
        color: "#E74C3C",
        title: "Building Emotional Connection",
        description: "Start with small, consistent daily interactions to rebuild and strengthen your relationship with your child."
      },
      {
        icon: "calendar",
        color: "#3498DB",
        title: "Creating Quality Time",
        description: "Set aside dedicated time each day for meaningful interaction, even if it's just 15-30 minutes."
      },
      {
        icon: "people-circle",
        color: "#27AE60",
        title: "Seeking Support",
        description: "Connect with parenting support groups, counselors, or family members who can help guide your parenting journey."
      },
      {
        icon: "book-open",
        color: "#F39C12",
        title: "Learning Parenting Basics",
        description: "Start with fundamental parenting skills and gradually build your confidence and involvement in your child's life."
      }
    ]
  };

  return suggestions[dominantStyle] || suggestions.Authoritative;
};

// Function to get quick actions based on parenting style
const getQuickActions = (dominantStyle) => {
  const actions = {
    Authoritative: [
      { icon: "book-open", color: "#3498DB", title: "Read Articles" },
      { icon: "videocam", color: "#E74C3C", title: "Watch Videos" },
      { icon: "people", color: "#27AE60", title: "Join Community" },
      { icon: "calendar", color: "#F39C12", title: "Plan Activities" }
    ],
    Authoritarian: [
      { icon: "heart", color: "#E74C3C", title: "Warmth Tips" },
      { icon: "chatbubbles", color: "#3498DB", title: "Communication" },
      { icon: "hand-left", color: "#F39C12", title: "Flexible Rules" },
      { icon: "happy", color: "#27AE60", title: "Positive Focus" }
    ],
    Permissive: [
      { icon: "shield-checkmark", color: "#3498DB", title: "Set Boundaries" },
      { icon: "checkmark-circle", color: "#27AE60", title: "Consistency" },
      { icon: "school", color: "#F39C12", title: "Responsibility" },
      { icon: "time", color: "#E74C3C", title: "Routines" }
    ],
    Neglectful: [
      { icon: "heart-circle", color: "#E74C3C", title: "Connect Daily" },
      { icon: "calendar", color: "#3498DB", title: "Quality Time" },
      { icon: "people-circle", color: "#27AE60", title: "Get Support" },
      { icon: "book-open", color: "#F39C12", title: "Learn Basics" }
    ]
  };

  return actions[dominantStyle] || actions.Authoritative;
};

// Function to get detailed analysis based on assessment results
const getDetailedAnalysis = (dominantStyle, counts) => {
  const totalQuestions = 10;
  const dominantCount = counts?.[dominantStyle] || 0;
  const dominantPercentage = (dominantCount / totalQuestions) * 100;

  const analyses = {
    Authoritative: [
      {
        icon: "trending-up",
        color: "#27AE60",
        title: "Balanced Approach",
        description: `You scored ${dominantCount}/10 in the Authoritative style, showing a strong balance between structure and warmth. This approach typically leads to confident, well-adjusted children.`,
        percentage: dominantPercentage
      },
      {
        icon: "heart",
        color: "#E74C3C",
        title: "Emotional Connection",
        description: "Your responses show high emotional responsiveness. You're likely very attuned to your child's feelings and needs.",
        percentage: 85
      },
      {
        icon: "shield-checkmark",
        color: "#3498DB",
        title: "Consistent Boundaries",
        description: "You maintain clear expectations while being flexible. This helps children feel secure and understood.",
        percentage: 90
      }
    ],
    Authoritarian: [
      {
        icon: "school",
        color: "#E74C3C",
        title: "High Standards",
        description: `You scored ${dominantCount}/10 in the Authoritarian style, indicating strong emphasis on discipline and respect. Your children likely perform well academically.`,
        percentage: dominantPercentage
      },
      {
        icon: "trophy",
        color: "#F39C12",
        title: "Achievement Focus",
        description: "Your parenting emphasizes success and achievement. Consider balancing this with emotional support.",
        percentage: 80
      },
      {
        icon: "time",
        color: "#95A5A6",
        title: "Structure Preference",
        description: "You value order and predictability. This can be beneficial but may need flexibility in some situations.",
        percentage: 75
      }
    ],
    Permissive: [
      {
        icon: "happy",
        color: "#F39C12",
        title: "Child-Centered",
        description: `You scored ${dominantCount}/10 in the Permissive style, showing high warmth and acceptance. Your children likely feel very loved and supported.`,
        percentage: dominantPercentage
      },
      {
        icon: "heart-circle",
        color: "#E74C3C",
        title: "Emotional Support",
        description: "You excel at providing emotional comfort and understanding. This creates strong parent-child bonds.",
        percentage: 95
      },
      {
        icon: "hand-left",
        color: "#3498DB",
        title: "Flexibility",
        description: "You adapt well to your child's needs and preferences. Consider adding some consistent boundaries.",
        percentage: 70
      }
    ],
    Neglectful: [
      {
        icon: "refresh",
        color: "#95A5A6",
        title: "Growth Opportunity",
        description: `You scored ${dominantCount}/10 in the Neglectful style. This indicates an opportunity for positive change and increased involvement.`,
        percentage: dominantPercentage
      },
      {
        icon: "bulb",
        color: "#F39C12",
        title: "Self-Awareness",
        description: "Taking this assessment shows you're ready to improve your parenting approach. This is a great first step.",
        percentage: 60
      },
      {
        icon: "people",
        color: "#3498DB",
        title: "Support Available",
        description: "There are many resources and support systems available to help you strengthen your parenting skills.",
        percentage: 50
      }
    ]
  };

  return analyses[dominantStyle] || analyses.Authoritative;
};

// Function to get weekly challenges based on parenting style
const getWeeklyChallenges = (dominantStyle) => {
  const challenges = {
    Authoritative: [
      {
        icon: "mic",
        color: "#3498DB",
        title: "Active Listening Practice",
        description: "Spend 15 minutes each day practicing active listening with your child. Ask open-ended questions and reflect their feelings."
      },
      {
        icon: "calendar",
        color: "#27AE60",
        title: "Flexible Routine Day",
        description: "Choose one day this week to be more flexible with your usual routines. Let your child help make decisions."
      },
      {
        icon: "heart",
        color: "#E74C3C",
        title: "Emotional Check-ins",
        description: "Have daily emotional check-ins with your child. Ask about their feelings and share your own appropriately."
      },
      {
        icon: "people",
        color: "#F39C12",
        title: "Family Meeting",
        description: "Hold a family meeting where everyone can discuss rules, concerns, and suggestions for improvement."
      },
      {
        icon: "book",
        color: "#9B59B6",
        title: "Read Together",
        description: "Choose a book that explores emotions or problem-solving. Discuss the characters' decisions together."
      }
    ],
    Authoritarian: [
      {
        icon: "heart",
        color: "#E74C3C",
        title: "Warmth Moments",
        description: "Add 3 extra moments of physical affection or verbal praise each day. Focus on warmth, not just achievement."
      },
      {
        icon: "chatbubbles",
        color: "#3498DB",
        title: "Explanation Practice",
        description: "Before giving a rule or consequence, explain the reasoning behind it. Help your child understand the 'why'."
      },
      {
        icon: "hand-left",
        color: "#F39C12",
        title: "Flexibility Exercise",
        description: "Choose one rule to be more flexible about this week. Negotiate with your child when appropriate."
      },
      {
        icon: "happy",
        color: "#27AE60",
        title: "Positive Reinforcement",
        description: "Catch your child being good 5 times each day. Acknowledge positive behavior immediately."
      },
      {
        icon: "people",
                color: "#9B59B6",
        title: "Child's Choice Day",
        description: "Let your child make most of the decisions for one day (within safe boundaries). Practice letting go of control."
      }
    ],
    Permissive: [
      {
        icon: "shield-checkmark",
        color: "#3498DB",
        title: "Set One Clear Boundary",
        description: "Choose one area where you'll be more consistent with limits. Explain the boundary clearly and stick to it."
      },
      {
        icon: "checkmark-circle",
        color: "#27AE60",
        title: "Follow-Through Practice",
        description: "When you say 'no' or set a consequence, follow through consistently. This builds trust and security."
      },
      {
        icon: "school",
        color: "#F39C12",
        title: "Responsibility Building",
        description: "Give your child one new age-appropriate responsibility this week. Guide them through it step by step."
      },
      {
        icon: "time",
        color: "#E74C3C",
        title: "Routine Introduction",
        description: "Introduce one simple daily routine (like bedtime preparation). Consistency helps children feel secure."
      },
      {
        icon: "hand-left",
        color: "#9B59B6",
        title: "Natural Consequences",
        description: "Allow natural consequences to occur when safe. Let your child learn from their choices."
      }
    ],
    Neglectful: [
      {
        icon: "heart-circle",
        color: "#E74C3C",
        title: "Daily Connection",
        description: "Spend 10 minutes of undivided attention with your child each day. Put away distractions and focus on them."
      },
      {
        icon: "calendar",
        color: "#3498DB",
        title: "Quality Time",
        description: "Plan one special activity with your child this week. It can be simple - a walk, game, or cooking together."
      },
      {
        icon: "people",
        color: "#27AE60",
        title: "Seek Support",
        description: "Reach out to a friend, family member, or parenting group for support and guidance this week."
      },
      {
        icon: "book-open",
        color: "#F39C12",
        title: "Learn Together",
        description: "Read one parenting article or watch one parenting video. Apply one new technique with your child."
      },
      {
        icon: "bulb",
        color: "#9B59B6",
        title: "Small Steps",
        description: "Focus on one small positive change this week. Celebrate any progress, no matter how small."
      }
    ]
  };

  return challenges[dominantStyle] || challenges.Authoritative;
};

// Function to get community insights based on parenting style
const getCommunityInsights = (dominantStyle) => {
  const insights = {
    Authoritative: [
      {
        initial: "S",
        name: "Sarah M.",
        role: "Mother of 2",
        rating: 5,
        quote: "The balanced approach really works! My kids are confident but still respect boundaries. It's about finding that sweet spot."
      },
      {
        initial: "M",
        name: "Mike R.",
        role: "Father of 3",
        rating: 5,
        quote: "I love how this style lets me be both firm and loving. My children know they can come to me with anything."
      },
      {
        initial: "J",
        name: "Jennifer L.",
        role: "Mother of 1",
        rating: 4,
        quote: "It takes practice, but the results are amazing. My daughter is independent but still seeks my guidance when needed."
      }
    ],
    Authoritarian: [
      {
        initial: "D",
        name: "David K.",
        role: "Father of 2",
        rating: 4,
        quote: "I've learned that adding warmth to my discipline makes all the difference. My kids respond much better now."
      },
      {
        initial: "A",
        name: "Anna T.",
        role: "Mother of 3",
        rating: 4,
        quote: "Explaining the 'why' behind rules has been a game-changer. My children understand and respect the boundaries more."
      },
      {
        initial: "R",
        name: "Robert P.",
        role: "Father of 1",
        rating: 5,
        quote: "Finding the balance between structure and love has transformed our family dynamic. Highly recommend this approach."
      }
    ],
    Permissive: [
      {
        initial: "L",
        name: "Lisa W.",
        role: "Mother of 2",
        rating: 4,
        quote: "Setting consistent boundaries while maintaining our close relationship has been challenging but so rewarding."
      },
      {
        initial: "T",
        name: "Tom H.",
        role: "Father of 1",
        rating: 5,
        quote: "My child feels so loved and accepted. Now I'm learning to add gentle structure to help them thrive even more."
      },
      {
        initial: "C",
        name: "Carol D.",
        role: "Mother of 3",
        rating: 4,
        quote: "The warmth comes naturally to me, but I've learned that children also need clear limits to feel secure."
      }
    ],
    Neglectful: [
      {
        initial: "K",
        name: "Kevin S.",
        role: "Father of 2",
        rating: 5,
        quote: "Taking this assessment was the first step. Now I'm building daily habits to connect with my children more."
      },
      {
        initial: "N",
        name: "Nancy B.",
        role: "Mother of 1",
        rating: 4,
        quote: "I was overwhelmed before, but small daily changes are making a huge difference in our relationship."
      },
      {
        initial: "P",
        name: "Paul M.",
        role: "Father of 3",
        rating: 5,
        quote: "Seeking help was the best decision I made. My children are happier, and I feel more confident as a parent."
      }
    ]
  };

  return insights[dominantStyle] || insights.Authoritative;
};

// Function to get recommended resources based on parenting style
const getRecommendedResources = (dominantStyle) => {
  const resources = {
    Authoritative: [
      {
        icon: "book",
        color: "#3498DB",
        title: "Advanced Communication Techniques",
        description: "Master the art of active listening and empathetic responses with your child.",
        type: "Article",
        duration: "8 min read"
      },
      {
        icon: "videocam",
        color: "#E74C3C",
        title: "Balancing Structure with Flexibility",
        description: "Learn when to be firm and when to adapt your approach based on your child's needs.",
        type: "Video",
        duration: "12 min"
      },
      {
        icon: "people",
        color: "#27AE60",
        title: "Mentoring Other Parents",
        description: "Share your successful strategies and learn from other authoritative parents.",
        type: "Community",
        duration: "Ongoing"
      }
    ],
    Authoritarian: [
      {
        icon: "heart",
        color: "#E74C3C",
        title: "Building Emotional Connection",
        description: "Learn techniques to express warmth and affection while maintaining your structured approach.",
        type: "Article",
        duration: "6 min read"
      },
      {
        icon: "chatbubbles",
        color: "#3498DB",
        title: "Open Communication Skills",
        description: "Develop skills to explain your reasoning and listen to your child's perspective.",
        type: "Video",
        duration: "15 min"
      },
      {
        icon: "hand-left",
        color: "#F39C12",
        title: "Flexible Discipline Strategies",
        description: "Explore alternative discipline methods that maintain respect while being collaborative.",
        type: "Article",
        duration: "10 min read"
      }
    ],
    Permissive: [
      {
        icon: "shield-checkmark",
        color: "#3498DB",
        title: "Setting Healthy Boundaries",
        description: "Learn to establish clear, consistent limits while maintaining your warm approach.",
        type: "Video",
        duration: "18 min"
      },
      {
        icon: "checkmark-circle",
        color: "#27AE60",
        title: "Consistent Follow-Through",
        description: "Develop strategies to follow through on consequences while preserving your child's sense of being heard.",
        type: "Article",
        duration: "7 min read"
      },
      {
        icon: "school",
        color: "#F39C12",
        title: "Teaching Responsibility",
        description: "Help your child develop self-discipline while maintaining their high self-esteem.",
        type: "Article",
        duration: "9 min read"
      }
    ],
    Neglectful: [
      {
        icon: "heart-circle",
        color: "#E74C3C",
        title: "Building Emotional Connection",
        description: "Start with small, consistent daily interactions to rebuild your relationship with your child.",
        type: "Video",
        duration: "20 min"
      },
      {
        icon: "calendar",
        color: "#3498DB",
        title: "Creating Quality Time",
        description: "Learn how to set aside dedicated time for meaningful interaction with your child.",
        type: "Article",
        duration: "5 min read"
      },
      {
        icon: "people-circle",
        color: "#27AE60",
        title: "Seeking Support",
        description: "Connect with parenting support groups and resources to guide your parenting journey.",
        type: "Community",
        duration: "Ongoing"
      }
    ]
  };

  return resources[dominantStyle] || resources.Authoritative;
};

// Cross-platform alert function
const showAlert = (title, message, buttons = [{ text: "OK" }]) => {
  if (Platform.OS === 'web') {
    // Use browser's native alert for web
    if (buttons.length === 1) {
      alert(`${title}\n\n${message}`);
    } else {
      // For multiple buttons, use confirm
      const result = confirm(`${title}\n\n${message}\n\nClick OK to continue or Cancel to cancel.`);
      if (result && buttons[1] && buttons[1].onPress) {
        buttons[1].onPress();
      } else if (!result && buttons[0] && buttons[0].onPress) {
        buttons[0].onPress();
      }
    }
  } else {
    // Use React Native Alert for mobile
    Alert.alert(title, message, buttons);
  }
};

export default function PersonlizedScreen() {
  const [user, loading, error] = useAuthState(auth);
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'questionnaire', 'results'
  const [questionnaireResults, setQuestionnaireResults] = useState(null);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSavingData, setIsSavingData] = useState(false);
  const [challengeProgress, setChallengeProgress] = useState({});
  const [activeChallenge, setActiveChallenge] = useState(null);

  // Load existing assessment data when component mounts
  useEffect(() => {
    const loadAssessmentData = async () => {
      if (user && !loading) {
        setIsLoadingData(true);
        try {
          const existingResults = await getAssessmentResults(user.uid);
          if (existingResults) {
            setQuestionnaireResults(existingResults);
            setHasCompletedAssessment(true);
          }
        } catch (error) {
          console.error('Error loading assessment data:', error);
          Alert.alert('Error', 'Failed to load your assessment data. Please try again.');
        } finally {
          setIsLoadingData(false);
        }
      }
    };

    loadAssessmentData();
  }, [user, loading]);

  const handleStartQuestionnaire = () => {
    setCurrentScreen('questionnaire');
  };

  const handleQuestionnaireComplete = async (results) => {
    setQuestionnaireResults(results);
    setHasCompletedAssessment(true);
    setCurrentScreen('results');
    
    // Save to Firebase
    if (user) {
      setIsSavingData(true);
      try {
        await saveAssessmentResults(user.uid, results);
        console.log('Assessment results saved to Firebase');
      } catch (error) {
        console.error('Error saving assessment results:', error);
        Alert.alert('Warning', 'Assessment completed but failed to save. Your results are still available.');
      } finally {
        setIsSavingData(false);
      }
    }
  };

  const handleRetakeQuestionnaire = () => {
    setCurrentScreen('questionnaire');
  };

  const handleCloseResults = () => {
    setCurrentScreen('home');
  };

  // Challenge handling functions
  const handleStartChallenge = (challengeIndex, challenge) => {
    console.log('Starting challenge:', challengeIndex, challenge.title);
    setActiveChallenge({ index: challengeIndex, ...challenge });
    setChallengeProgress(prev => ({
      ...prev,
      [challengeIndex]: {
        ...challenge,
        status: 'active',
        startDate: new Date().toISOString(),
        completed: false
      }
    }));
    
    // Show cross-platform alert
    showAlert(
      "Challenge Started!",
      `You've started: ${challenge.title}\n\n${challenge.description}\n\nCheck back daily to track your progress!`,
      [
        { 
          text: "Got it!", 
          onPress: () => console.log('Alert dismissed')
        }
      ]
    );
  };

  const handleCompleteChallenge = (challengeIndex) => {
    setChallengeProgress(prev => ({
      ...prev,
      [challengeIndex]: {
        ...prev[challengeIndex],
        status: 'completed',
        completedDate: new Date().toISOString(),
        completed: true
      }
    }));
    setActiveChallenge(null);
    showAlert(
      "Challenge Completed!",
      "Great job! You've completed this challenge. Keep up the excellent work!",
      [{ text: "Awesome!" }]
    );
  };

  const handleSkipChallenge = (challengeIndex) => {
    setChallengeProgress(prev => ({
      ...prev,
      [challengeIndex]: {
        ...prev[challengeIndex],
        status: 'skipped',
        skippedDate: new Date().toISOString()
      }
    }));
    setActiveChallenge(null);
    showAlert(
      "Challenge Skipped",
      "No worries! You can always come back to this challenge later.",
      [{ text: "OK" }]
    );
  };

  const getChallengeStatus = (challengeIndex) => {
    return challengeProgress[challengeIndex]?.status || 'not_started';
  };

  const getChallengeButtonText = (challengeIndex) => {
    const status = getChallengeStatus(challengeIndex);
    switch (status) {
      case 'active': return 'In Progress';
      case 'completed': return 'Completed ✓';
      case 'skipped': return 'Skipped';
      default: return 'Start Challenge';
    }
  };

  const getChallengeButtonStyle = (challengeIndex) => {
    const status = getChallengeStatus(challengeIndex);
    switch (status) {
      case 'active': return styles.challengeButtonActive;
      case 'completed': return styles.challengeButtonCompleted;
      case 'skipped': return styles.challengeButtonSkipped;
      default: return styles.challengeButton;
    }
  };

  // Show loading screen while checking authentication or loading data
  if (loading || isLoadingData) {
  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498DB" />
          <Text style={styles.loadingText}>Loading your assessment data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginPromptContainer}>
          <Ionicons name="person-circle-outline" size={80} color="#3498DB" />
          <Text style={styles.loginPromptTitle}>Please Login</Text>
          <Text style={styles.loginPromptText}>
            You need to be logged in to access your personalized assessment results.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (currentScreen === 'questionnaire') {
    return (
      <ParentingStyleQuestionnaire onComplete={handleQuestionnaireComplete} />
    );
  }

  if (currentScreen === 'results') {
    return (
      <ParentingStyleResults 
        results={questionnaireResults}
        onRetake={handleRetakeQuestionnaire}
        onClose={handleCloseResults}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
          <Text style={styles.logo}>Kindling</Text>
          <Text style={styles.tagline}>Personalized Parenting Journey</Text>
      </View>

        {hasCompletedAssessment ? (
          // Post-Assessment Content
          <>
            {/* Results Summary */}
            <View style={styles.resultsSummaryBox}>
              <View style={styles.resultsHeader}>
                <Ionicons name="checkmark-circle" size={32} color="#27AE60" />
                <Text style={styles.resultsTitle}>Assessment Complete!</Text>
                {isSavingData && (
                  <View style={styles.savingIndicator}>
                    <ActivityIndicator size="small" color="#27AE60" />
                    <Text style={styles.savingText}>Saving...</Text>
                  </View>
                )}
              </View>
              <Text style={styles.resultsDescription}>
                You are an <Text style={styles.highlightText}>{questionnaireResults?.dominantStyle}</Text> parent. 
                View your detailed results and personalized recommendations below.
        </Text>
              {questionnaireResults?.completedAt && (
                <Text style={styles.completedDate}>
                  Completed on {new Date(questionnaireResults.completedAt).toLocaleDateString()}
                </Text>
              )}
      </View>

            {/* Quick Stats */}
            <View style={styles.statsBox}>
              <Text style={styles.sectionTitle}>Your Parenting Style Breakdown</Text>
              <View style={styles.statsGrid}>
                {Object.entries(questionnaireResults?.counts || {}).map(([style, count]) => (
                  <View key={style} style={styles.statItem}>
                    <Text style={styles.statNumber}>{count}</Text>
                    <Text style={styles.statLabel}>{style}</Text>
        </View>
                ))}
        </View>
        </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsBox}>
              <TouchableOpacity style={styles.viewResultsButton} onPress={() => setCurrentScreen('results')}>
                <Ionicons name="eye" size={24} color="#fff" />
                <Text style={styles.buttonText}>View Detailed Results</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.retakeButton} onPress={handleStartQuestionnaire}>
                <Ionicons name="refresh" size={24} color="#3498DB" />
                <Text style={styles.retakeButtonText}>Retake Assessment</Text>
              </TouchableOpacity>
        </View>

            {/* Personalized Recommendations */}
            <View style={styles.recommendationsBox}>
              <Text style={styles.sectionTitle}>Your Personalized Journey</Text>
              {getPersonalizedSuggestions(questionnaireResults?.dominantStyle).map((suggestion, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Ionicons name={suggestion.icon} size={20} color={suggestion.color} />
                  <View style={styles.recommendationContent}>
                    <Text style={styles.recommendationTitle}>{suggestion.title}</Text>
                    <Text style={styles.recommendationText}>{suggestion.description}</Text>
                  </View>
                </View>
              ))}
      </View>

            {/* Quick Actions for Your Style */}
            <View style={styles.quickActionsBox}>
              <Text style={styles.sectionTitle}>Quick Actions for {questionnaireResults?.dominantStyle} Parents</Text>
              <View style={styles.quickActionsGrid}>
                {getQuickActions(questionnaireResults?.dominantStyle).map((action, index) => (
                  <TouchableOpacity key={index} style={styles.quickActionItem}>
                    <Ionicons name={action.icon} size={24} color={action.color} />
                    <Text style={styles.quickActionText}>{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Test Alert Button */}
              <TouchableOpacity 
                style={styles.testAlertButton}
                onPress={() => {
                  console.log('Test alert button pressed');
                  showAlert("Test Alert", "This is a test alert to verify Alert is working!");
                }}
              >
                <Text style={styles.testAlertButtonText}>Test Alert (Cross-Platform)</Text>
              </TouchableOpacity>
              
              {/* Simple Alert Test */}
              <TouchableOpacity 
                style={[styles.testAlertButton, { backgroundColor: "#3498DB" }]}
                onPress={() => showAlert("Simple", "Hello from web!")}
              >
                <Text style={styles.testAlertButtonText}>Simple Alert</Text>
              </TouchableOpacity>
            </View>

            {/* Detailed Analysis */}
            <View style={styles.analysisBox}>
              <Text style={styles.sectionTitle}>Your Detailed Analysis</Text>
              {getDetailedAnalysis(questionnaireResults?.dominantStyle, questionnaireResults?.counts).map((analysis, index) => (
                <View key={index} style={styles.analysisItem}>
                  <View style={styles.analysisHeader}>
                    <Ionicons name={analysis.icon} size={24} color={analysis.color} />
                    <Text style={styles.analysisTitle}>{analysis.title}</Text>
      </View>
                  <Text style={styles.analysisDescription}>{analysis.description}</Text>
                  {analysis.percentage && (
                    <View style={styles.percentageBar}>
                      <View style={[styles.percentageFill, { width: `${analysis.percentage}%`, backgroundColor: analysis.color }]} />
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Weekly Challenges */}
            <View style={styles.challengesBox}>
              <Text style={styles.sectionTitle}>This Week's Challenges</Text>
              <Text style={styles.challengesSubtitle}>Personalized activities to strengthen your parenting</Text>
              {getWeeklyChallenges(questionnaireResults?.dominantStyle).map((challenge, index) => (
                <View key={index} style={styles.challengeItem}>
                  <View style={styles.challengeHeader}>
                    <Text style={styles.challengeDay}>Day {index + 1}</Text>
                    <View style={[styles.challengeIcon, { backgroundColor: challenge.color }]}>
                      <Ionicons name={challenge.icon} size={20} color="#fff" />
                    </View>
                  </View>
                  <Text style={styles.challengeTitle}>{challenge.title}</Text>
                  <Text style={styles.challengeDescription}>{challenge.description}</Text>
                  <View style={styles.challengeActions}>
                    <TouchableOpacity 
                      style={getChallengeButtonStyle(index)}
                      onPress={() => {
                        console.log('Button pressed for challenge:', index, challenge.title);
                        const status = getChallengeStatus(index);
                        console.log('Current status:', status);
                        
                        if (status === 'active') {
                          showAlert(
                            "Complete Challenge?",
                            "Have you completed this challenge?",
                            [
                              { text: "Not Yet" },
                              { text: "Complete", onPress: () => handleCompleteChallenge(index) }
                            ]
                          );
                        } else if (status === 'not_started') {
                          console.log('Starting challenge...');
                          handleStartChallenge(index, challenge);
                        } else if (status === 'skipped') {
                          console.log('Restarting skipped challenge...');
                          handleStartChallenge(index, challenge);
                        }
                      }}
                    >
                      <Text style={styles.challengeButtonText}>{getChallengeButtonText(index)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.challengeInfoButton}
                      onPress={() => {
                        const buttons = [{ text: "OK" }];
                        if (getChallengeStatus(index) === 'active') {
                          buttons.push({ text: "Skip", onPress: () => handleSkipChallenge(index) });
                        }
                        showAlert(challenge.title, challenge.description, buttons);
                      }}
                    >
                      <Ionicons name="information-circle" size={16} color="#3498DB" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Challenge Progress Summary */}
            {Object.keys(challengeProgress).length > 0 && (
              <View style={styles.progressSummaryBox}>
                <Text style={styles.sectionTitle}>Your Challenge Progress</Text>
                <View style={styles.progressStats}>
                  <View style={styles.progressStatItem}>
                    <Text style={styles.progressStatNumber}>
                      {Object.values(challengeProgress).filter(c => c.status === 'completed').length}
                    </Text>
                    <Text style={styles.progressStatLabel}>Completed</Text>
                  </View>
                  <View style={styles.progressStatItem}>
                    <Text style={styles.progressStatNumber}>
                      {Object.values(challengeProgress).filter(c => c.status === 'active').length}
                    </Text>
                    <Text style={styles.progressStatLabel}>In Progress</Text>
                  </View>
                  <View style={styles.progressStatItem}>
                    <Text style={styles.progressStatNumber}>
                      {Object.values(challengeProgress).filter(c => c.status === 'skipped').length}
                    </Text>
                    <Text style={styles.progressStatLabel}>Skipped</Text>
                  </View>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { 
                          width: `${(Object.values(challengeProgress).filter(c => c.status === 'completed').length / 5) * 100}%` 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressBarText}>
                    {Math.round((Object.values(challengeProgress).filter(c => c.status === 'completed').length / 5) * 100)}% Complete
                  </Text>
                </View>
              </View>
            )}

            {/* Progress Tracking */}
            <View style={styles.progressBox}>
              <Text style={styles.sectionTitle}>Your Progress Journey</Text>
              <View style={styles.progressTimeline}>
                <View style={styles.progressItem}>
                  <View style={[styles.progressDot, styles.progressCompleted]} />
                  <View style={styles.progressContent}>
                    <Text style={styles.progressTitle}>Assessment Completed</Text>
                    <Text style={styles.progressDate}>{new Date(questionnaireResults?.completedAt).toLocaleDateString()}</Text>
                  </View>
                </View>
                <View style={styles.progressItem}>
                  <View style={[styles.progressDot, styles.progressCurrent]} />
                  <View style={styles.progressContent}>
                    <Text style={styles.progressTitle}>Personalized Plan</Text>
                    <Text style={styles.progressDate}>In Progress</Text>
                  </View>
                </View>
                <View style={styles.progressItem}>
                  <View style={[styles.progressDot, styles.progressPending]} />
                  <View style={styles.progressContent}>
                    <Text style={styles.progressTitle}>Weekly Challenges</Text>
                    <Text style={styles.progressDate}>Starting Soon</Text>
                  </View>
                </View>
                <View style={styles.progressItem}>
                  <View style={[styles.progressDot, styles.progressPending]} />
                  <View style={styles.progressContent}>
                    <Text style={styles.progressTitle}>Progress Review</Text>
                    <Text style={styles.progressDate}>In 2 Weeks</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Community Insights */}
            <View style={styles.communityBox}>
              <Text style={styles.sectionTitle}>Community Insights</Text>
              <Text style={styles.communitySubtitle}>What other {questionnaireResults?.dominantStyle} parents are saying</Text>
              {getCommunityInsights(questionnaireResults?.dominantStyle).map((insight, index) => (
                <View key={index} style={styles.insightItem}>
                  <View style={styles.insightHeader}>
                    <View style={styles.insightAvatar}>
                      <Text style={styles.insightInitial}>{insight.initial}</Text>
                    </View>
                    <View style={styles.insightInfo}>
                      <Text style={styles.insightName}>{insight.name}</Text>
                      <Text style={styles.insightRole}>{insight.role}</Text>
                    </View>
                    <View style={styles.insightRating}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons 
                          key={i} 
                          name={i < insight.rating ? "star" : "star-outline"} 
                          size={12} 
                          color="#F1C40F" 
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.insightText}>"{insight.quote}"</Text>
                </View>
              ))}
            </View>

            {/* Resources Library */}
            <View style={styles.resourcesBox}>
              <Text style={styles.sectionTitle}>Recommended Resources</Text>
              <Text style={styles.resourcesSubtitle}>Curated content for {questionnaireResults?.dominantStyle} parents</Text>
              {getRecommendedResources(questionnaireResults?.dominantStyle).map((resource, index) => (
                <TouchableOpacity key={index} style={styles.resourceItem}>
                  <View style={[styles.resourceIcon, { backgroundColor: resource.color }]}>
                    <Ionicons name={resource.icon} size={24} color="#fff" />
                  </View>
                  <View style={styles.resourceContent}>
                    <Text style={styles.resourceTitle}>{resource.title}</Text>
                    <Text style={styles.resourceDescription}>{resource.description}</Text>
                    <View style={styles.resourceMeta}>
                      <Text style={styles.resourceType}>{resource.type}</Text>
                      <Text style={styles.resourceDuration}>{resource.duration}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6C757D" />
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          // Pre-Assessment Content
          <>
            {/* Welcome Section */}
            <View style={styles.welcomeBox}>
              <Text style={styles.sectionTitle}>Welcome to Your Parenting Journey</Text>
              <Text style={styles.welcomeText}>
                Discover your unique parenting style and get personalized insights to help you 
                become the best parent you can be. Our assessment will help you understand 
                your strengths and areas for growth.
        </Text>
      </View>

            {/* Assessment Card */}
            <View style={styles.assessmentCard}>
              <View style={styles.assessmentHeader}>
                <Ionicons name="clipboard-outline" size={32} color="#3498DB" />
                <Text style={styles.assessmentTitle}>Parenting Style Assessment</Text>
        </View>
              
              <Text style={styles.assessmentDescription}>
                Take our 10-question assessment to discover your parenting style and receive 
                personalized recommendations for your parenting journey.
              </Text>

              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
                  <Text style={styles.featureText}>Quick 10-question assessment</Text>
        </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
                  <Text style={styles.featureText}>Detailed personalized results</Text>
        </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
                  <Text style={styles.featureText}>Actionable growth recommendations</Text>
        </View>
      </View>

              <TouchableOpacity style={styles.startButton} onPress={handleStartQuestionnaire}>
                <Ionicons name="play-circle" size={24} color="#fff" />
                <Text style={styles.startButtonText}>Start Assessment</Text>
              </TouchableOpacity>
            </View>

            {/* Benefits Section */}
            <View style={styles.benefitsBox}>
              <Text style={styles.sectionTitle}>Why Take This Assessment?</Text>
              <View style={styles.benefitItem}>
                <Ionicons name="heart" size={24} color="#E74C3C" />
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>Strengthen Your Bond</Text>
                  <Text style={styles.benefitText}>Build a stronger, more meaningful relationship with your child</Text>
                </View>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="bulb" size={24} color="#F39C12" />
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>Gain Insights</Text>
                  <Text style={styles.benefitText}>Understand your parenting patterns and their impact</Text>
                </View>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="trending-up" size={24} color="#27AE60" />
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>Grow Together</Text>
                  <Text style={styles.benefitText}>Get personalized tips to enhance your parenting skills</Text>
                </View>
              </View>
      </View>
          </>
        )}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8F9FA" 
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: { 
    paddingVertical: 30, 
    alignItems: "center" 
  },
  logo: { 
    fontSize: 32, 
    fontWeight: "bold", 
    color: "#2C3E50" 
  },
  tagline: { 
    fontSize: 16, 
    color: "#6C757D", 
    marginTop: 8, 
    textAlign: "center" 
  },
  welcomeBox: { 
    backgroundColor: "#fff", 
    marginVertical: 15, 
    padding: 25, 
    borderRadius: 16, 
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
    fontWeight: "bold", 
    color: "#2C3E50",
    marginBottom: 15,
    textAlign: "center" 
  },
  welcomeText: { 
    fontSize: 16, 
    color: "#6C757D", 
    lineHeight: 24, 
    textAlign: "center" 
  },
  assessmentCard: { 
    backgroundColor: "#fff", 
    marginVertical: 15, 
    padding: 25, 
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  assessmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  assessmentTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#2C3E50",
    marginLeft: 12,
  },
  assessmentDescription: { 
    fontSize: 16, 
    color: "#6C757D", 
    lineHeight: 24, 
    marginBottom: 20 
  },
  featuresList: {
    marginBottom: 25,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#2C3E50",
    marginLeft: 12,
  },
  startButton: { 
    backgroundColor: "#3498DB", 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16, 
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "600" 
  },
  benefitsBox: { 
    backgroundColor: "#fff", 
    marginVertical: 15, 
    padding: 25, 
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  benefitContent: {
    flex: 1,
    marginLeft: 15,
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: "#2C3E50",
    marginBottom: 5,
  },
  benefitText: {
    fontSize: 16,
    color: "#6C757D",
    lineHeight: 22,
  },
  // Post-Assessment Styles
  resultsSummaryBox: {
    backgroundColor: "#E8F5E9",
    marginVertical: 15,
    padding: 25,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#2C3E50",
    marginLeft: 12,
  },
  resultsDescription: {
    fontSize: 16,
    color: "#6C757D",
    lineHeight: 24,
  },
  highlightText: {
    fontWeight: 'bold',
    color: "#27AE60",
  },
  statsBox: {
    backgroundColor: "#fff",
    marginVertical: 15,
    padding: 25,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#3498DB",
  },
  statLabel: {
    fontSize: 12,
    color: "#6C757D",
    textAlign: 'center',
    marginTop: 5,
  },
  actionButtonsBox: {
    marginVertical: 15,
    gap: 12,
  },
  viewResultsButton: {
    backgroundColor: "#3498DB",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  retakeButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#3498DB",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  retakeButtonText: {
    color: "#3498DB",
    fontSize: 18,
    fontWeight: "600",
  },
  recommendationsBox: {
    backgroundColor: "#fff",
    marginVertical: 15,
    padding: 25,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  recommendationContent: {
    flex: 1,
    marginLeft: 12,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: "#2C3E50",
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: "#6C757D",
    lineHeight: 20,
  },
  quickActionsBox: {
    backgroundColor: "#fff",
    marginVertical: 15,
    padding: 25,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: "#2C3E50",
    marginTop: 8,
    textAlign: 'center',
  },
  // Loading and Authentication States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#6C757D",
    marginTop: 15,
    textAlign: 'center',
  },
  loginPromptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loginPromptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#2C3E50",
    marginTop: 20,
    marginBottom: 10,
  },
  loginPromptText: {
    fontSize: 16,
    color: "#6C757D",
    textAlign: 'center',
    lineHeight: 24,
  },
  // Saving indicator
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  savingText: {
    fontSize: 12,
    color: "#27AE60",
    marginLeft: 5,
  },
  completedDate: {
    fontSize: 12,
    color: "#6C757D",
    marginTop: 8,
    fontStyle: 'italic',
  },
  challengeButton: {
    backgroundColor: "#3498DB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  challengeButtonActive: {
    backgroundColor: "#F39C12",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  challengeButtonCompleted: {
    backgroundColor: "#27AE60",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  challengeButtonSkipped: {
    backgroundColor: "#95A5A6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  challengeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  progressSummaryBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  progressStatItem: {
    alignItems: "center",
  },
  progressStatNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3498DB",
  },
  progressStatLabel: {
    fontSize: 12,
    color: "#6C757D",
    marginTop: 4,
  },
  progressBarContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E9ECEF",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#27AE60",
    borderRadius: 4,
  },
  progressBarText: {
    fontSize: 12,
    color: "#6C757D",
    textAlign: "center",
    marginTop: 8,
  },
  testAlertButton: {
    backgroundColor: "#E74C3C",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
    alignSelf: "center",
  },
  testAlertButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
