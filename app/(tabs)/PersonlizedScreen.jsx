import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { ActivityIndicator, Alert, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AIParentingAnalysis from "../../components/AIParentingAnalysis";
import ParentingStyleQuestionnaire from "../../components/ParentingStyleQuestionnaire";
import ParentingStyleResults from "../../components/ParentingStyleResults";
import { auth } from '../../config/firebase';
import { generateEncouragingQuote } from '../../config/openai';
import { getAssessmentResults, getChallengeProgress, saveAssessmentResults, saveChallengeProgress } from "../../services/assessmentService";

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
        description: `Your responses show a strong balance between structure and warmth. This approach typically leads to confident, well-adjusted children.`,
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
        description: `Your responses indicate strong emphasis on discipline and respect. Your children likely perform well academically.`,
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
        description: `Your responses show high warmth and acceptance. Your children likely feel very loved and supported.`,
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
        description: `Your assessment results indicate an opportunity for positive change and increased involvement. Every step forward matters.`,
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
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'questionnaire', 'results', 'ai-analysis'
  const [questionnaireResults, setQuestionnaireResults] = useState(null);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSavingData, setIsSavingData] = useState(false);
  const [encouragingQuote, setEncouragingQuote] = useState(null);
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [challengeProgress, setChallengeProgress] = useState({});
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

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
            // Load existing quote if available, otherwise generate a new one
            if (existingResults.encouragingQuote) {
              setEncouragingQuote(existingResults.encouragingQuote);
            } else {
              // Generate quote if it doesn't exist
              setIsGeneratingQuote(true);
              try {
                const quote = await generateEncouragingQuote(existingResults);
                setEncouragingQuote(quote);
              } catch (error) {
                console.error('Error generating quote:', error);
                const fallbackQuote = "Your commitment to your child's growth shines through in your thoughtful responses. Every day brings new opportunities to nurture their development with love and understanding.";
                setEncouragingQuote(fallbackQuote);
              } finally {
                setIsGeneratingQuote(false);
              }
            }
          }
          
          // Load challenge progress data
          const challengeData = await getChallengeProgress(user.uid);
          if (challengeData && Object.keys(challengeData).length > 0) {
            setChallengeProgress(challengeData);
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
    
    // Generate encouraging quote
    setIsGeneratingQuote(true);
    try {
      const quote = await generateEncouragingQuote(results);
      setEncouragingQuote(quote);
      // Save quote along with results
      results.encouragingQuote = quote;
    } catch (error) {
      console.error('Error generating quote:', error);
      // Use fallback quote if generation fails
      const fallbackQuote = "Your commitment to your child's growth shines through in your thoughtful responses. Every day brings new opportunities to nurture their development with love and understanding.";
      setEncouragingQuote(fallbackQuote);
      results.encouragingQuote = fallbackQuote;
    } finally {
      setIsGeneratingQuote(false);
    }
    
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

  const handleViewAIAnalysis = () => {
    setCurrentScreen('ai-analysis');
  };

  const handleBackFromAnalysis = () => {
    setCurrentScreen('results');
  };

  const handleRetakeFromAnalysis = () => {
    setCurrentScreen('questionnaire');
  };

  const handleSaveAnalysis = async (analysis) => {
    if (user) {
      try {
        // Save the AI analysis to Firebase
        await saveAssessmentResults(user.uid, {
          ...questionnaireResults,
          aiAnalysis: analysis
        });
        console.log('AI analysis saved to Firebase');
      } catch (error) {
        console.error('Error saving AI analysis:', error);
        Alert.alert('Warning', 'Analysis generated but failed to save. You can still view it.');
      }
    }
  };

  // Helper function to save challenge progress to Firebase
  const saveChallengeProgressToFirebase = async (newChallengeProgress) => {
    if (user) {
      try {
        await saveChallengeProgress(user.uid, newChallengeProgress);
        console.log('Challenge progress saved to Firebase');
      } catch (error) {
        console.error('Error saving challenge progress:', error);
        Alert.alert('Warning', 'Failed to save challenge progress. Your progress is still tracked locally.');
      }
    }
  };

  // Article content mapping for different parenting topics
  const getArticleContent = (resourceTitle, parentingStyle) => {
    const articleContent = {
      // Authoritative parenting articles
      "Advanced Communication Techniques": {
        title: "Advanced Communication Techniques for Authoritative Parents",
        content: `# Mastering Advanced Communication with Your Child

## The Foundation of Authoritative Parenting

As an authoritative parent, you already understand the importance of clear communication. However, mastering advanced communication techniques can elevate your parenting to new heights, creating deeper connections and more effective guidance for your child.

## The Art of Active Listening

### What is Active Listening?
Active listening goes beyond simply hearing your child's words. It involves:
- **Full Attention**: Put down devices, make eye contact, and focus entirely on your child
- **Reflective Responses**: Mirror back what you hear to show understanding
- **Emotional Validation**: Acknowledge your child's feelings without judgment
- **Open-Ended Questions**: Ask questions that encourage deeper sharing

### Practical Techniques
1. **The "I Hear You" Method**
   - "I hear that you're feeling frustrated about your homework"
   - "It sounds like you're worried about the test tomorrow"
   - This validates their emotions while showing you're listening

2. **The "Tell Me More" Approach**
   - Instead of "What happened?", try "Tell me more about what led to this situation"
   - This encourages detailed sharing and shows genuine interest

3. **The "I Wonder" Technique**
   - "I wonder what you were thinking when that happened"
   - "I'm curious about how that made you feel"
   - This invites deeper reflection without pressure

## Advanced Empathy Building

### Understanding Your Child's Perspective
- **Developmental Awareness**: Consider your child's age and developmental stage
- **Personality Recognition**: Understand your child's unique temperament
- **Context Consideration**: Factor in external influences (school, friends, family dynamics)

### Empathy in Action
1. **Emotional Mirroring**
   - Match your child's emotional intensity appropriately
   - Show you understand their feelings through your own expressions

2. **Perspective-Taking Exercises**
   - "If I were in your shoes, I might feel..."
   - "From your perspective, this probably seems..."

3. **Validation Without Agreement**
   - "I understand why you feel that way, even though I see it differently"
   - "Your feelings are completely valid, and I want to help you work through them"

## Conflict Resolution Mastery

### The Collaborative Problem-Solving Model
1. **Define the Problem Together**
   - "Let's figure out what's really going on here"
   - Avoid blame and focus on the issue

2. **Brainstorm Solutions Together**
   - "What are some ways we could handle this?"
   - Encourage creative thinking

3. **Evaluate Options Together**
   - "What do you think would work best?"
   - "What are the pros and cons of each option?"

4. **Implement and Review**
   - Try the chosen solution
   - Check back to see how it's working

## Building Emotional Intelligence

### Teaching Emotional Vocabulary
- Help your child identify and name their emotions
- Use emotion charts and feeling wheels
- Model emotional expression yourself

### Emotional Regulation Techniques
1. **Breathing Exercises**
   - Teach simple breathing techniques
   - Practice together during calm moments

2. **Mindfulness Practices**
   - Introduce age-appropriate mindfulness
   - Make it a family activity

3. **Problem-Solving Skills**
   - Break down problems into manageable steps
   - Teach decision-making frameworks

## Long-term Benefits

### For Your Child
- Enhanced emotional intelligence
- Better conflict resolution skills
- Stronger self-esteem and confidence
- Improved relationships with others

### For Your Family
- Deeper parent-child connection
- Reduced family conflicts
- More harmonious household
- Stronger family bonds

## Daily Practice Tips

1. **Morning Check-ins**: Start each day with a brief emotional check-in
2. **Evening Reflections**: End the day by discussing what went well and what was challenging
3. **Weekly Family Meetings**: Create regular opportunities for open communication
4. **Model the Behavior**: Show your children how to communicate effectively through your own actions

Remember, mastering these techniques takes time and practice. Be patient with yourself and your child as you develop these skills together. The investment in advanced communication will pay dividends throughout your child's life.`,
        author: "Dr. Sarah Johnson, Child Psychologist",
        readTime: "12 min read",
        category: "Communication"
      },
      "Balancing Structure with Flexibility": {
        title: "Balancing Structure with Flexibility: The Authoritative Approach",
        content: `# The Perfect Balance: Structure and Flexibility in Authoritative Parenting

## Understanding the Dynamic Duo

As an authoritative parent, you've mastered the art of providing both structure and flexibility. This delicate balance is what sets authoritative parenting apart and creates the optimal environment for your child's development.

## The Science Behind the Balance

### Why Structure Matters
- **Security and Safety**: Children need predictable routines to feel secure
- **Learning and Development**: Structure provides the framework for growth
- **Self-Discipline**: Consistent expectations help children develop self-control
- **Family Harmony**: Clear rules reduce conflicts and confusion

### Why Flexibility is Essential
- **Individual Needs**: Each child is unique and requires different approaches
- **Growth and Change**: Children's needs evolve as they develop
- **Problem-Solving**: Flexibility teaches adaptability and creative thinking
- **Emotional Well-being**: Rigid rules can stifle emotional expression

## Creating Your Family's Framework

### The 80/20 Rule
- **80% Structure**: Consistent routines, clear expectations, and reliable boundaries
- **20% Flexibility**: Room for exceptions, individual needs, and special circumstances

### Core Non-Negotiable Rules
1. **Safety Rules**: Never negotiable (wearing seatbelts, not touching hot stoves)
2. **Respect Rules**: Always required (treating others with kindness)
3. **Health Rules**: Generally non-negotiable (basic hygiene, eating vegetables)

### Flexible Areas
1. **Bedtime**: Can be adjusted for special occasions
2. **Screen Time**: Can be modified based on circumstances
3. **Activities**: Can be changed based on interests and needs
4. **Chores**: Can be adapted based on individual capabilities

## Practical Implementation Strategies

### The "When-Then" Technique
- "When you finish your homework, then you can play video games"
- "When you clean your room, then we can go to the park"
- This provides structure while allowing for natural consequences

### The "Choice Within Limits" Method
- "You can choose to do your homework now or after dinner, but it must be done before bedtime"
- "You can wear the red shirt or the blue shirt, but you need to wear something appropriate for school"
- This gives children autonomy while maintaining boundaries

### The "Family Meeting" Approach
- Regular discussions about rules and expectations
- Allow children to voice their opinions and concerns
- Make adjustments together when appropriate

## Age-Appropriate Flexibility

### Toddlers (1-3 years)
- **Structure**: Consistent meal times, nap times, and bedtime routines
- **Flexibility**: Allow for natural variations in mood and energy levels
- **Example**: "We always brush our teeth before bed, but sometimes we can read an extra story"

### Preschoolers (3-5 years)
- **Structure**: Clear rules about safety and behavior
- **Flexibility**: Allow for creative expression and individual preferences
- **Example**: "You must wear shoes outside, but you can choose which shoes"

### School Age (6-12 years)
- **Structure**: Homework expectations and household responsibilities
- **Flexibility**: Allow for input on rules and consequences
- **Example**: "You need to complete your homework, but you can choose when and where to do it"

### Teenagers (13+ years)
- **Structure**: Core family values and safety rules
- **Flexibility**: Increased autonomy and decision-making opportunities
- **Example**: "You need to be home by curfew, but we can discuss what that time should be"

## Handling Exceptions and Special Circumstances

### When to Be Flexible
1. **Special Occasions**: Birthdays, holidays, family events
2. **Illness or Stress**: When your child is not feeling well
3. **Learning Opportunities**: When flexibility teaches important lessons
4. **Individual Needs**: When your child has unique requirements

### How to Handle Exceptions
1. **Explain the Exception**: "Normally we don't eat dessert before dinner, but tonight is special because..."
2. **Set Clear Boundaries**: "This is a one-time exception, and here's why"
3. **Maintain Consistency**: Don't let exceptions become the rule
4. **Use as Teaching Moments**: "This is why we usually have rules about this"

## Building Your Family's Unique Balance

### Step 1: Identify Your Core Values
- What matters most to your family?
- What behaviors are absolutely non-negotiable?
- What areas can be more flexible?

### Step 2: Create Your Family Constitution
- Write down your core rules and values
- Include the reasoning behind each rule
- Make it a living document that can evolve

### Step 3: Practice the Balance Daily
- Start with small decisions
- Reflect on what works and what doesn't
- Adjust as needed

### Step 4: Communicate Clearly
- Explain the reasoning behind rules
- Discuss flexibility when appropriate
- Listen to your child's perspective

## Common Challenges and Solutions

### Challenge: Child Pushes Boundaries
**Solution**: Maintain consistency while explaining the reasoning behind rules

### Challenge: Too Much Flexibility
**Solution**: Establish clear non-negotiable rules and stick to them

### Challenge: Too Much Structure
**Solution**: Identify areas where you can be more flexible

### Challenge: Inconsistent Application
**Solution**: Create clear guidelines for when exceptions are allowed

## The Long-term Impact

### Benefits for Your Child
- **Self-Discipline**: Learns to regulate their own behavior
- **Problem-Solving**: Develops creative thinking skills
- **Emotional Intelligence**: Understands the importance of both rules and flexibility
- **Independence**: Learns to make good decisions within appropriate boundaries

### Benefits for Your Family
- **Reduced Conflict**: Clear expectations prevent many arguments
- **Stronger Relationships**: Balance creates trust and respect
- **Family Harmony**: Everyone understands their role and responsibilities
- **Adaptability**: Family can adjust to changing circumstances

## Daily Practice Tips

1. **Morning Routines**: Start with structure, allow for individual preferences
2. **Meal Times**: Consistent timing with flexible food choices
3. **Bedtime**: Regular schedule with some flexibility for special occasions
4. **Weekend Activities**: Mix of planned activities and free time
5. **Chores**: Consistent expectations with flexible timing

Remember, finding the perfect balance is an ongoing process. What works for one child may not work for another, and what works today may need adjustment tomorrow. The key is to stay attuned to your child's needs while maintaining the structure that provides security and guidance.`,
        author: "Dr. Michael Chen, Family Therapist",
        readTime: "15 min read",
        category: "Parenting Style"
      },
      "Mentoring Other Parents": {
        title: "Mentoring Other Parents: Sharing Your Authoritative Wisdom",
        content: `# Becoming a Parenting Mentor: Sharing Your Authoritative Wisdom

## The Gift of Experience

As an authoritative parent, you've developed valuable skills and insights that can benefit other parents on their journey. Mentoring other parents is not just about sharing advice—it's about creating a supportive community and helping families thrive.

## Why Mentoring Matters

### For the Mentor (You)
- **Reinforces Your Own Learning**: Teaching others deepens your understanding
- **Builds Community**: Creates meaningful connections with other parents
- **Personal Growth**: Develops your communication and leadership skills
- **Legacy Building**: Leaves a positive impact on future generations

### For the Mentee
- **Practical Guidance**: Receives tried-and-tested advice
- **Emotional Support**: Gains confidence and reassurance
- **Problem-Solving**: Learns new strategies and approaches
- **Community Connection**: Feels less isolated in their parenting journey

## Qualities of an Effective Parenting Mentor

### Essential Characteristics
1. **Active Listening**: Truly hear what the other parent is saying
2. **Empathy**: Understand their struggles and challenges
3. **Patience**: Recognize that change takes time
4. **Non-Judgment**: Accept different parenting styles and approaches
5. **Experience**: Have practical knowledge to share
6. **Humility**: Acknowledge that you don't have all the answers

## Different Types of Mentoring Relationships

### Formal Mentoring
- **Structured Programs**: Organized through schools, community centers, or parenting groups
- **Regular Meetings**: Scheduled weekly or monthly sessions
- **Specific Goals**: Focus on particular parenting challenges
- **Documentation**: Track progress and outcomes

### Informal Mentoring
- **Casual Conversations**: Spontaneous advice during playdates or social gatherings
- **Online Communities**: Sharing experiences in parenting forums or social media
- **Support Groups**: Participating in parent support groups
- **Neighborhood Networks**: Helping other parents in your community

## Effective Mentoring Strategies

### The Socratic Method
Instead of giving direct advice, ask questions that help parents discover solutions:
- "What do you think might happen if you tried that approach?"
- "How do you think your child would respond to that?"
- "What other options have you considered?"

### The Storytelling Approach
Share your own experiences to illustrate points:
- "When my daughter was going through a similar phase..."
- "I remember feeling exactly the same way when..."
- "Here's what I learned from that experience..."

## Common Parenting Challenges to Address

### Discipline and Behavior Management
- **Consistent Consequences**: Helping parents establish clear boundaries
- **Positive Reinforcement**: Teaching effective praise and reward systems
- **Time-Outs and Natural Consequences**: Explaining appropriate use
- **Age-Appropriate Expectations**: Setting realistic behavioral goals

### Communication and Connection
- **Active Listening**: Teaching parents to truly hear their children
- **Emotional Validation**: Helping children feel understood
- **Conflict Resolution**: Managing disagreements constructively
- **Building Trust**: Creating secure parent-child relationships

## Setting Boundaries in Mentoring

### What to Share
- **Personal Experiences**: Your own parenting journey
- **Practical Strategies**: What has worked for your family
- **Resources**: Books, articles, and tools you've found helpful
- **Emotional Support**: Encouragement and understanding

### What to Avoid
- **Medical Advice**: Refer to healthcare professionals
- **Therapeutic Interventions**: Suggest professional counseling when needed
- **Judgment**: Avoid criticizing other parents' choices
- **Overstepping**: Respect boundaries and privacy

## Building Your Mentoring Skills

### Continuous Learning
- **Stay Updated**: Read current parenting research and resources
- **Attend Workshops**: Participate in parenting education programs
- **Join Communities**: Connect with other experienced parents
- **Reflect on Experience**: Regularly evaluate your own parenting

### Self-Care for Mentors
- **Set Limits**: Don't overextend yourself
- **Take Breaks**: Rest and recharge regularly
- **Seek Support**: Have your own mentors and support systems
- **Maintain Balance**: Keep your own family as the priority

Remember, mentoring is a two-way street. While you're helping other parents, you're also learning and growing. The most effective mentors are those who remain humble, curious, and committed to their own continuous learning.`,
        author: "Dr. Lisa Rodriguez, Parenting Educator",
        readTime: "18 min read",
        category: "Community"
      },
      // Authoritarian parenting articles
      "Building Emotional Connection": {
        title: "Building Emotional Connection: A Guide for Authoritarian Parents",
        content: `# Building Emotional Connection: A Guide for Authoritarian Parents

## Understanding the Challenge

As an authoritarian parent, you excel at providing structure and discipline. However, building emotional connection can sometimes feel challenging when you're focused on maintaining order and respect. This guide will help you strengthen your emotional bond with your child while preserving your structured approach.

## Why Emotional Connection Matters

### The Foundation of Trust
- **Security**: Children feel safe when they know their parents care about their feelings
- **Communication**: Emotional connection opens doors to better communication
- **Behavior**: Connected children are more likely to follow rules willingly
- **Development**: Strong emotional bonds support healthy psychological development

### The Authoritarian Advantage
- **Consistency**: Your structured approach provides a stable foundation
- **Clear Expectations**: Children know what to expect from you
- **Respect**: Your authority, when combined with warmth, creates deep respect
- **Values**: You can effectively pass on important values and principles

## Building Emotional Connection: Step by Step

### 1. Express Warmth Through Actions
**Daily Affection**
- Start each day with a warm greeting
- End each day with a loving goodnight
- Use physical touch appropriately (hugs, pats on the back)
- Make eye contact when speaking

**Small Gestures**
- Leave encouraging notes in lunchboxes
- Celebrate small achievements
- Remember important dates and events
- Show interest in their hobbies and interests

### 2. Validate Emotions While Maintaining Boundaries
**The "I Understand, But..." Approach**
- "I understand you're frustrated, but we still need to follow the rules"
- "I can see you're upset, and that's okay, but hitting is not acceptable"
- "I hear that you're angry, and I want to help you work through it"

**Emotional Coaching**
- Help your child identify and name their emotions
- Teach appropriate ways to express feelings
- Model emotional regulation yourself
- Create a safe space for emotional expression

### 3. Explain Your Reasoning
**The "Why" Behind Rules**
- "We have this rule because I care about your safety"
- "I'm asking you to do this because it will help you succeed"
- "This is important because it teaches you responsibility"

**Share Your Values**
- Explain why certain behaviors matter to you
- Share stories from your own childhood
- Connect rules to family values
- Help your child understand the bigger picture

### 4. Create Special Moments
**One-on-One Time**
- Schedule regular individual time with each child
- Let them choose the activity sometimes
- Focus entirely on them during this time
- Make it a consistent part of your routine

**Family Traditions**
- Create meaningful family rituals
- Celebrate achievements together
- Establish special family traditions
- Make memories that last a lifetime

## Age-Appropriate Connection Strategies

### Toddlers (1-3 years)
- **Physical Affection**: Lots of hugs, cuddles, and gentle touch
- **Play Together**: Get down on their level and play
- **Routine Comfort**: Use consistent routines to provide security
- **Simple Explanations**: Use simple words to explain rules

### Preschoolers (3-5 years)
- **Story Time**: Read together and discuss the stories
- **Imaginative Play**: Join in their pretend games
- **Art Projects**: Create together and display their work
- **Simple Choices**: Give them small choices within your rules

### School Age (6-12 years)
- **Interest-Based Activities**: Engage in activities they enjoy
- **Homework Support**: Help with schoolwork while showing interest
- **Sports and Hobbies**: Attend their games and performances
- **Problem-Solving**: Work together to solve challenges

### Teenagers (13+ years)
- **Respectful Conversations**: Treat them as young adults
- **Shared Interests**: Find common ground and interests
- **Independence Support**: Help them become more independent
- **Future Planning**: Discuss their goals and dreams

## Overcoming Common Challenges

### Challenge: "I Don't Want to Seem Weak"
**Solution**: Emotional connection actually strengthens your authority. Children respect parents who show they care.

### Challenge: "My Child Doesn't Respond to Affection"
**Solution**: Start small and be patient. Some children need time to warm up to emotional expression.

### Challenge: "I Don't Know How to Express Emotions"
**Solution**: Practice with small gestures first. You don't need to be overly emotional—just genuine.

### Challenge: "It Feels Unnatural"
**Solution**: Start with one small change at a time. Practice makes it feel more natural.

## Daily Practices for Emotional Connection

### Morning Routine
- Greet your child warmly
- Ask about their day ahead
- Offer encouragement for challenges they might face
- Give a hug or pat on the back

### During the Day
- Check in periodically
- Show interest in their activities
- Offer help when needed
- Celebrate small wins

### Evening Routine
- Ask about their day
- Listen to their stories
- Share something about your day
- End with a loving goodnight

## Long-term Benefits

### For Your Child
- **Emotional Intelligence**: Better understanding and management of emotions
- **Self-Esteem**: Higher confidence and self-worth
- **Trust**: Stronger trust in you and others
- **Resilience**: Better ability to handle challenges

### For Your Family
- **Stronger Relationships**: Deeper bonds between family members
- **Better Communication**: More open and honest conversations
- **Reduced Conflict**: Less resistance to rules and expectations
- **Family Harmony**: More peaceful and loving home environment

## Remember: Balance is Key

You don't have to choose between being authoritative and being emotionally connected. In fact, the most effective authoritarian parents are those who combine their structured approach with genuine warmth and emotional support. Your child needs both the security of clear boundaries and the comfort of knowing they are deeply loved and valued.

Start with small changes, be patient with yourself and your child, and remember that building emotional connection is a journey, not a destination. Every small step you take toward greater emotional connection will strengthen your relationship and make your parenting more effective.`,
        author: "Dr. Maria Santos, Child Psychologist",
        readTime: "14 min read",
        category: "Emotional Development"
      },
      "Open Communication Skills": {
        title: "Open Communication Skills for Authoritarian Parents",
        content: `# Open Communication Skills for Authoritarian Parents

## The Communication Challenge

As an authoritarian parent, you excel at setting clear expectations and maintaining order. However, open communication can sometimes feel challenging when you're used to being the authority figure. This guide will help you develop communication skills that maintain your leadership role while encouraging your child to share their thoughts and feelings.

## Why Open Communication Matters

### Benefits for Your Child
- **Emotional Intelligence**: Better understanding and expression of emotions
- **Problem-Solving Skills**: Ability to work through challenges constructively
- **Self-Advocacy**: Confidence to express needs and concerns
- **Trust Building**: Stronger relationship with you and others

### Benefits for Your Family
- **Reduced Conflict**: Fewer misunderstandings and arguments
- **Better Problem-Solving**: Collaborative approach to challenges
- **Stronger Relationships**: Deeper understanding between family members
- **Peaceful Home**: More harmonious family environment

## The Authoritarian Communication Style

### Your Natural Strengths
- **Clear Expectations**: You communicate rules and boundaries effectively
- **Consistency**: Your messages are reliable and predictable
- **Directness**: You say what you mean without confusion
- **Respect**: You expect and model respectful communication

### Areas for Growth
- **Listening Skills**: Learning to truly hear your child's perspective
- **Emotional Validation**: Acknowledging feelings before addressing behavior
- **Collaborative Problem-Solving**: Working together to find solutions
- **Two-Way Dialogue**: Encouraging your child to share their thoughts

## Building Open Communication: Step by Step

### 1. Master the Art of Active Listening
**What is Active Listening?**
- Giving your full attention to your child
- Hearing not just words, but emotions and underlying messages
- Reflecting back what you've heard
- Asking clarifying questions

**Practical Techniques**
- **The "I Hear You" Method**: "I hear that you're feeling frustrated about your homework"
- **The "Tell Me More" Approach**: "Tell me more about what happened at school today"
- **The "I Wonder" Technique**: "I wonder what you were thinking when that happened"

### 2. Validate Emotions Before Addressing Behavior
**The Validation Formula**
1. **Acknowledge the Emotion**: "I can see you're really upset"
2. **Validate the Feeling**: "It makes sense that you'd feel that way"
3. **Address the Behavior**: "But we still need to handle this appropriately"
4. **Problem-Solve Together**: "Let's figure out a better way to express this"

**Example Conversations**
- "I understand you're angry about not being able to go to the party. That's a valid feeling. However, we still need to discuss this respectfully."
- "I can see you're disappointed about your grade. That's completely understandable. Let's talk about what we can do to improve next time."

### 3. Explain Your Reasoning
**The "Why" Behind Rules**
- Help your child understand the purpose of rules
- Connect rules to values and safety
- Share your thought process
- Invite questions and discussion

**Effective Explanations**
- "We have this rule because I care about your safety"
- "This is important because it teaches you responsibility"
- "I'm asking you to do this because it will help you succeed in life"
- "This rule exists because it shows respect for others"

### 4. Encourage Questions and Discussion
**Creating a Safe Space**
- "I want to hear your thoughts on this"
- "What questions do you have about this rule?"
- "How do you feel about this situation?"
- "What would you do differently?"

**Responding to Questions**
- Take questions seriously, even if they seem challenging
- Answer honestly and age-appropriately
- Admit when you don't know something
- Use questions as teaching moments

## Age-Appropriate Communication Strategies

### Toddlers (1-3 years)
- **Simple Language**: Use clear, simple words
- **Visual Cues**: Use gestures and facial expressions
- **Repetition**: Repeat important messages
- **Patience**: Give them time to process and respond

### Preschoolers (3-5 years)
- **Story Examples**: Use stories to explain concepts
- **Role-Playing**: Practice communication through play
- **Choice Questions**: "Do you want to talk about this now or after dinner?"
- **Emotion Coaching**: Help them identify and express feelings

### School Age (6-12 years)
- **Regular Check-ins**: Schedule time for conversations
- **Problem-Solving**: Work together to solve challenges
- **Respectful Debate**: Allow them to express different opinions
- **Teaching Moments**: Use conflicts as learning opportunities

### Teenagers (13+ years)
- **Adult Conversations**: Treat them as young adults
- **Privacy Respect**: Give them space when needed
- **Future Focus**: Discuss their goals and dreams
- **Independence Support**: Help them make their own decisions

## Overcoming Communication Barriers

### Barrier: "My Child Won't Talk to Me"
**Solutions**:
- Start with non-threatening topics
- Use activities as conversation starters
- Be patient and don't pressure
- Show genuine interest in their world

### Barrier: "I Don't Know What to Say"
**Solutions**:
- Use open-ended questions
- Share your own experiences
- Ask for their opinion
- Practice active listening

### Barrier: "They Only Talk When They Want Something"
**Solutions**:
- Create regular conversation times
- Show interest in their daily life
- Ask about their feelings and experiences
- Make conversation a normal part of your relationship

### Barrier: "I Get Frustrated When They Don't Listen"
**Solutions**:
- Check your own communication style
- Make sure you're being clear and direct
- Use consequences consistently
- Model the behavior you want to see

## Daily Communication Practices

### Morning Check-ins
- "How are you feeling about today?"
- "What are you looking forward to?"
- "Is there anything you're worried about?"
- "How can I help you have a great day?"

### Evening Reflections
- "What was the best part of your day?"
- "What was challenging today?"
- "What did you learn today?"
- "How can we make tomorrow better?"

### Weekly Family Meetings
- Discuss family issues together
- Plan upcoming events
- Address concerns and conflicts
- Celebrate achievements and progress

## Long-term Benefits

### For Your Child
- **Better Relationships**: Improved communication with others
- **Emotional Intelligence**: Better understanding of emotions
- **Problem-Solving**: Ability to work through challenges
- **Self-Confidence**: Comfort expressing thoughts and feelings

### For Your Family
- **Stronger Bonds**: Deeper understanding and connection
- **Reduced Conflict**: Fewer misunderstandings and arguments
- **Better Problem-Solving**: Collaborative approach to challenges
- **Family Harmony**: More peaceful and loving home

## Remember: Communication is a Skill

Open communication doesn't mean giving up your authority or letting your child run the show. It means creating a relationship where your child feels safe to share their thoughts and feelings, knowing that you'll listen with respect and respond with wisdom and love.

Your structured approach provides the foundation, and open communication builds the bridge that connects you to your child's heart and mind. Start with small changes, be patient with the process, and remember that every conversation is an opportunity to strengthen your relationship and guide your child toward becoming the person they're meant to be.`,
        author: "Dr. James Wilson, Family Communication Specialist",
        readTime: "16 min read",
        category: "Communication"
      },
      "Flexible Discipline Strategies": {
        title: "Flexible Discipline Strategies for Authoritarian Parents",
        content: `# Flexible Discipline Strategies for Authoritarian Parents

## The Discipline Evolution

As an authoritarian parent, you understand the importance of structure and consequences. However, incorporating flexibility into your discipline approach can make your parenting more effective while maintaining the respect and order that are important to you. This guide will help you develop flexible discipline strategies that work with your natural parenting style.

## Why Flexibility in Discipline Matters

### The Benefits of Flexible Discipline
- **Better Compliance**: Children are more likely to follow rules they understand and help create
- **Reduced Power Struggles**: Collaborative approach reduces resistance
- **Skill Development**: Children learn problem-solving and decision-making
- **Stronger Relationships**: Respectful discipline builds trust and connection

### Maintaining Your Core Values
- **Structure**: Clear expectations and consistent consequences
- **Respect**: Mutual respect between parent and child
- **Responsibility**: Teaching children to be accountable for their actions
- **Values**: Passing on important principles and beliefs

## The Flexible Discipline Framework

### 1. The "Choice Within Limits" Method
**How It Works**
- Provide clear boundaries and expectations
- Offer choices within those boundaries
- Let children experience natural consequences
- Maintain your authority while giving autonomy

**Examples**
- "You need to do your homework, but you can choose to do it now or after dinner"
- "You must wear appropriate clothes for school, but you can choose which shirt"
- "You need to clean your room, but you can decide whether to do it before or after your snack"

### 2. The "When-Then" Technique
**How It Works**
- Set clear expectations for behavior
- Connect desired behavior to desired privileges
- Use natural consequences when possible
- Maintain consistency in application

**Examples**
- "When you finish your chores, then you can play video games"
- "When you speak respectfully, then I'll listen to your concerns"
- "When you complete your homework, then you can have screen time"

### 3. The "Problem-Solving Together" Approach
**How It Works**
- Identify the problem together
- Brainstorm solutions collaboratively
- Choose a solution that works for both of you
- Follow up to see how it's working

**Example Process**
1. "I notice you're having trouble getting ready for school on time. What do you think is causing this?"
2. "What are some ways we could solve this problem?"
3. "Which of these solutions do you think would work best?"
4. "Let's try this for a week and see how it goes"

## Age-Appropriate Flexible Strategies

### Toddlers (1-3 years)
**Simple Choices**
- "Do you want to wear the red shirt or the blue shirt?"
- "Should we read this book or that one?"
- "Do you want to brush your teeth before or after your bath?"

**Natural Consequences**
- If they don't eat, they'll be hungry
- If they don't wear a coat, they'll be cold
- If they don't clean up, toys get put away

### Preschoolers (3-5 years)
**Limited Choices**
- "You can choose to do your homework now or in 10 minutes"
- "Would you like to clean your room before or after lunch?"
- "Do you want to talk about this now or after you calm down?"

**Logical Consequences**
- If they don't put toys away, they can't play with them tomorrow
- If they don't follow directions, they lose a privilege
- If they're mean to siblings, they need to do something nice for them

### School Age (6-12 years)
**Collaborative Problem-Solving**
- Work together to solve behavior issues
- Let them suggest consequences for their actions
- Give them input on family rules
- Help them understand the reasoning behind rules

**Increased Autonomy**
- Let them choose their own consequences (within reason)
- Give them more responsibility for their choices
- Allow them to negotiate certain rules
- Help them develop their own problem-solving skills

### Teenagers (13+ years)
**Adult-Level Discussions**
- Treat them as young adults in conversations
- Let them have significant input on rules and consequences
- Help them understand the long-term impact of their choices
- Support their growing independence while maintaining boundaries

## Implementing Flexible Discipline

### Step 1: Identify Your Non-Negotiable Rules
**Safety Rules** (Never negotiable)
- Wearing seatbelts
- Not touching dangerous objects
- Following safety guidelines

**Respect Rules** (Always required)
- Treating others with kindness
- Using respectful language
- Following basic manners

**Health Rules** (Generally non-negotiable)
- Basic hygiene
- Eating nutritious foods
- Getting enough sleep

### Step 2: Identify Areas for Flexibility
**Timing**
- When homework gets done
- When chores are completed
- When bedtime occurs (within reason)

**Methods**
- How they complete tasks
- How they express their feelings
- How they solve problems

**Preferences**
- What they wear (within dress codes)
- What they eat (within healthy options)
- What activities they choose

### Step 3: Communicate Clearly
**Explain the System**
- "These are the rules that are never negotiable"
- "These are areas where you have some choice"
- "Here's how we'll work together to solve problems"

**Set Clear Expectations**
- "You need to do your homework, but you can choose when"
- "You must be respectful, but you can express your feelings"
- "You need to follow the rules, but we can discuss why they exist"

## Common Challenges and Solutions

### Challenge: "My Child Takes Advantage of Flexibility"
**Solution**: Be clear about boundaries and follow through consistently. Flexibility doesn't mean permissiveness.

### Challenge: "I Feel Like I'm Losing Control"
**Solution**: Remember that you're still the parent. Flexibility is a tool, not a loss of authority.

### Challenge: "My Child Doesn't Make Good Choices"
**Solution**: Start with small choices and guide them. Learning to make good decisions takes practice.

### Challenge: "It Takes Too Much Time"
**Solution**: Start with one area at a time. The investment in teaching decision-making pays off in the long run.

## Daily Implementation Tips

### Morning Routines
- Give choices about what to wear (within appropriate options)
- Let them choose the order of morning tasks
- Offer options for breakfast
- Allow some flexibility in timing

### Homework Time
- Let them choose when to do homework (within reasonable limits)
- Allow them to choose their study environment
- Give them input on how to organize their work
- Help them understand the consequences of their choices

### Bedtime Routines
- Let them choose the order of bedtime activities
- Allow some flexibility in timing (within reason)
- Give them choices about bedtime stories or activities
- Help them understand why sleep is important

## Long-term Benefits

### For Your Child
- **Decision-Making Skills**: Better ability to make good choices
- **Problem-Solving**: Improved ability to work through challenges
- **Self-Discipline**: Better internal motivation and control
- **Independence**: Growing ability to handle responsibilities

### For Your Family
- **Reduced Power Struggles**: Less resistance to rules and expectations
- **Better Communication**: More open and honest discussions
- **Stronger Relationships**: Mutual respect and understanding
- **Family Harmony**: More peaceful and cooperative home environment

## Remember: Flexibility Strengthens Authority

Flexible discipline doesn't mean giving up your authority or letting your child run the show. It means using your authority wisely to teach your child how to make good decisions and take responsibility for their actions.

Your structured approach provides the foundation, and flexibility provides the tools for your child to learn and grow. Start with small changes, be patient with the process, and remember that every choice you give your child is an opportunity to teach them responsibility and decision-making skills.

The goal is to raise a child who not only follows rules but understands why they exist and can make good decisions even when you're not there to guide them.`,
        author: "Dr. Patricia Martinez, Child Development Specialist",
        readTime: "17 min read",
        category: "Discipline"
      },
      // Permissive parenting articles
      "Setting Healthy Boundaries": {
        title: "Setting Healthy Boundaries: A Guide for Permissive Parents",
        content: `# Setting Healthy Boundaries: A Guide for Permissive Parents

## The Boundary Challenge

As a permissive parent, you excel at showing love, warmth, and understanding. However, setting healthy boundaries can sometimes feel challenging when you want to avoid conflict and keep your child happy. This guide will help you establish clear, loving boundaries that protect your child while maintaining your warm, supportive approach.

## Why Boundaries Matter

### The Foundation of Security
- **Safety**: Boundaries protect children from harm and dangerous situations
- **Security**: Clear limits help children feel safe and secure
- **Learning**: Boundaries teach children about appropriate behavior and social norms
- **Development**: Healthy boundaries support emotional and social development

### The Permissive Advantage
- **Warmth**: Your loving approach makes boundaries feel supportive rather than punitive
- **Understanding**: You can explain boundaries with empathy and compassion
- **Flexibility**: You can adapt boundaries to your child's individual needs
- **Connection**: Your strong relationship makes boundary-setting easier

## Understanding Healthy Boundaries

### What Are Healthy Boundaries?
- **Clear Limits**: Specific, understandable rules and expectations
- **Consistent Application**: Boundaries that are enforced reliably
- **Age-Appropriate**: Limits that match your child's developmental stage
- **Loving Enforcement**: Consequences that are firm but not harsh

### Types of Boundaries
1. **Safety Boundaries**: Never negotiable (wearing seatbelts, not touching hot stoves)
2. **Respect Boundaries**: Always required (treating others kindly, using respectful language)
3. **Responsibility Boundaries**: Important for development (completing homework, doing chores)
4. **Social Boundaries**: Help with relationships (sharing, taking turns, being honest)

## Setting Boundaries: Step by Step

### 1. Start with Your Values
**Identify What Matters Most**
- What values do you want to pass on to your child?
- What behaviors are absolutely non-negotiable?
- What skills do you want your child to develop?
- What kind of person do you want them to become?

**Examples of Core Values**
- Kindness and respect for others
- Honesty and integrity
- Responsibility and accountability
- Safety and self-care

### 2. Choose Your Battles Wisely
**Focus on What's Important**
- Don't try to set boundaries for everything at once
- Start with the most important issues
- Let go of minor things that don't really matter
- Build success with small wins

**Priority Areas to Start With**
- Safety rules (most important)
- Respect for others
- Basic responsibilities
- One or two specific behaviors you want to change

### 3. Communicate with Love and Clarity
**The "I Love You, But..." Approach**
- "I love you, but we need to follow this rule because it keeps you safe"
- "I care about you, but hitting is not okay because it hurts others"
- "I understand you're upset, but we still need to handle this appropriately"

**Explain the "Why" Behind Boundaries**
- "We have this rule because I care about your safety"
- "This is important because it teaches you responsibility"
- "This helps you learn how to get along with others"

### 4. Be Consistent but Flexible
**Consistency in Important Areas**
- Safety rules are never negotiable
- Respect boundaries are always enforced
- Core values are consistently reinforced

**Flexibility in Less Important Areas**
- Allow choices when possible
- Adjust timing when appropriate
- Consider your child's individual needs
- Be willing to compromise on non-essential issues

## Age-Appropriate Boundary Setting

### Toddlers (1-3 years)
**Simple, Clear Rules**
- "We don't hit" (with gentle redirection)
- "We hold hands when crossing the street"
- "We use gentle hands with the baby"
- "We don't touch the hot stove"

**Consistent Responses**
- Use the same words each time
- Redirect to appropriate behavior
- Stay calm and patient
- Offer alternatives when possible

### Preschoolers (3-5 years)
**More Complex Rules**
- "We use our words, not our hands"
- "We clean up our toys when we're done"
- "We tell the truth, even when it's hard"
- "We take turns and share"

**Teaching Problem-Solving**
- Help them understand why rules exist
- Teach them how to handle difficult situations
- Encourage them to express their feelings appropriately
- Guide them toward better choices

### School Age (6-12 years)
**Responsibility and Independence**
- "You need to complete your homework before screen time"
- "You must be respectful to teachers and classmates"
- "You need to do your chores to earn privileges"
- "You must tell me where you're going and when you'll be back"

**Collaborative Problem-Solving**
- Work together to solve behavior issues
- Let them have input on some rules
- Help them understand the consequences of their choices
- Teach them how to make good decisions

### Teenagers (13+ years)
**Increasing Independence**
- "You need to be home by curfew, but we can discuss what that time should be"
- "You must be respectful, but you can express your opinions"
- "You need to follow family rules, but we can talk about why they exist"
- "You must be honest, even when it's difficult"

**Adult-Level Discussions**
- Treat them as young adults in conversations
- Help them understand the long-term impact of their choices
- Support their growing independence while maintaining safety
- Guide them toward responsible decision-making

## Implementing Boundaries with Love

### The "Firm but Kind" Approach
**Firm on the Rule**
- Be clear about what's expected
- Follow through consistently
- Don't negotiate on important issues
- Stay calm and confident

**Kind in the Delivery**
- Use a warm, loving tone
- Show empathy for their feelings
- Offer comfort and support
- Help them work through difficult emotions

### The "Natural Consequences" Method
**Let Consequences Teach**
- If they don't do homework, they get a lower grade
- If they're mean to siblings, they need to do something nice for them
- If they don't clean their room, they can't find their things
- If they don't follow safety rules, they lose privileges

**Support Through Consequences**
- Help them understand why the consequence happened
- Guide them toward better choices next time
- Offer comfort and encouragement
- Focus on learning and growth

## Overcoming Common Challenges

### Challenge: "I Feel Guilty Setting Boundaries"
**Solution**: Remember that boundaries are an act of love. They protect and guide your child toward becoming a responsible, caring person.

### Challenge: "My Child Gets Upset When I Set Limits"
**Solution**: This is normal and expected. Stay calm, offer comfort, and help them work through their feelings while maintaining the boundary.

### Challenge: "I Don't Want to Damage Our Relationship"
**Solution**: Healthy boundaries actually strengthen relationships. Your child will respect you more when they know you care enough to guide them.

### Challenge: "It's Easier to Give In"
**Solution**: While it might be easier in the short term, giving in teaches your child that boundaries don't matter and can lead to bigger problems later.

## Daily Boundary-Setting Practices

### Morning Routines
- Set clear expectations for getting ready
- Be consistent about what needs to be done
- Offer choices when appropriate
- Stay calm and supportive

### Mealtime Boundaries
- Establish rules about table manners
- Set expectations about trying new foods
- Be consistent about meal times
- Make mealtimes pleasant and positive

### Bedtime Routines
- Set clear bedtime expectations
- Be consistent about the routine
- Allow some flexibility in activities
- Make bedtime a positive, loving time

### Screen Time Limits
- Set clear rules about when and how long
- Be consistent about enforcement
- Offer alternative activities
- Use screen time as a privilege, not a right

## Long-term Benefits

### For Your Child
- **Self-Discipline**: Better ability to control their own behavior
- **Respect for Others**: Understanding of how their actions affect others
- **Problem-Solving**: Ability to work through challenges constructively
- **Independence**: Growing ability to make good decisions

### For Your Family
- **Reduced Conflict**: Clear expectations prevent many arguments
- **Stronger Relationships**: Boundaries create trust and respect
- **Family Harmony**: Everyone knows what to expect
- **Peaceful Home**: More calm and organized environment

## Remember: Boundaries Are Love

Setting boundaries doesn't mean you love your child any less. In fact, it's one of the most loving things you can do. Healthy boundaries show your child that you care enough to guide them, protect them, and help them become the best person they can be.

Your warm, loving approach makes boundary-setting feel supportive rather than punitive. You can be both loving and firm, understanding and consistent, flexible and reliable. These qualities aren't opposites—they work together to create the perfect balance for raising a happy, healthy, responsible child.

Start with small changes, be patient with yourself and your child, and remember that every boundary you set is an expression of your love and commitment to their well-being.`,
        author: "Dr. Sarah Thompson, Child Psychologist",
        readTime: "19 min read",
        category: "Boundaries"
      },
      "Consistent Follow-Through": {
        title: "Consistent Follow-Through: A Guide for Permissive Parents",
        content: `# Consistent Follow-Through: A Guide for Permissive Parents

## The Follow-Through Challenge

As a permissive parent, you excel at understanding your child's feelings and maintaining a warm, loving relationship. However, following through on consequences can sometimes feel challenging when you want to avoid conflict and keep your child happy. This guide will help you develop consistent follow-through skills while maintaining your compassionate approach.

## Why Follow-Through Matters

### The Foundation of Trust
- **Reliability**: Children need to know they can count on what you say
- **Learning**: Consequences help children understand the impact of their choices
- **Security**: Consistent responses create a predictable, safe environment
- **Development**: Follow-through teaches responsibility and accountability

### The Permissive Advantage
- **Empathy**: Your understanding approach makes consequences feel fair rather than harsh
- **Communication**: You can explain consequences with compassion and clarity
- **Relationship**: Your strong bond makes it easier to enforce consequences lovingly
- **Flexibility**: You can adapt consequences to your child's individual needs

## Understanding Effective Follow-Through

### What Is Follow-Through?
- **Consistency**: Doing what you say you'll do, every time
- **Timeliness**: Following through soon after the behavior occurs
- **Appropriateness**: Consequences that match the behavior and the child's age
- **Love**: Enforcing consequences with warmth and understanding

### Types of Consequences
1. **Natural Consequences**: What happens naturally as a result of the behavior
2. **Logical Consequences**: Related to the behavior and designed to teach
3. **Loss of Privileges**: Removing something the child enjoys
4. **Making Amends**: Doing something to fix the situation

## Building Follow-Through Skills: Step by Step

### 1. Start Small and Build Success
**Choose One Behavior to Focus On**
- Pick something that happens frequently
- Choose something that's important but not too difficult
- Make sure it's something you can consistently follow through on
- Start with something that has a clear, simple consequence

**Examples to Start With**
- "If you don't put your toys away, they go in the closet for the rest of the day"
- "If you don't finish your homework, no screen time until it's done"
- "If you're mean to your sibling, you need to do something nice for them"

### 2. Set Clear Expectations
**Be Specific About What You Expect**
- "I expect you to put your toys away before dinner"
- "I expect you to speak respectfully to everyone in the family"
- "I expect you to complete your homework before playing"

**Explain the Consequence Clearly**
- "If you don't put your toys away, they go in the closet"
- "If you speak disrespectfully, you lose screen time for the rest of the day"
- "If you don't finish your homework, no video games until it's done"

### 3. Follow Through Immediately
**Don't Wait or Negotiate**
- Follow through as soon as the behavior occurs
- Don't give multiple warnings or chances
- Don't negotiate or change your mind
- Stay calm and matter-of-fact

**Example of Immediate Follow-Through**
- Child doesn't put toys away
- You calmly say, "I see the toys aren't put away. They go in the closet now."
- You follow through immediately
- You don't argue or negotiate

### 4. Stay Calm and Loving
**Use a Warm, Firm Tone**
- "I love you, but the toys still go in the closet"
- "I understand you're upset, but we still need to follow the rule"
- "I care about you, but this is what happens when we don't follow through"

**Offer Comfort and Support**
- Acknowledge their feelings
- Offer hugs and comfort
- Help them work through their emotions
- Reassure them of your love

## Age-Appropriate Follow-Through

### Toddlers (1-3 years)
**Simple, Immediate Consequences**
- If they hit, they sit in a quiet spot for one minute
- If they don't come when called, you pick them up and bring them
- If they throw food, mealtime is over
- If they don't clean up, toys get put away

**Consistent Responses**
- Use the same consequence every time
- Follow through immediately
- Stay calm and patient
- Offer comfort after the consequence

### Preschoolers (3-5 years)
**Logical Consequences**
- If they don't put toys away, they can't play with them tomorrow
- If they're mean to siblings, they need to do something nice for them
- If they don't follow directions, they lose a privilege
- If they don't tell the truth, they need to make it right

**Teaching Moments**
- Help them understand why the consequence happened
- Guide them toward better choices
- Use consequences as learning opportunities
- Focus on growth and improvement

### School Age (6-12 years)
**More Complex Consequences**
- If they don't do homework, no screen time until it's done
- If they're disrespectful, they lose privileges
- If they don't do chores, they don't earn their allowance
- If they break something, they need to help fix or replace it

**Collaborative Problem-Solving**
- Work together to solve behavior issues
- Let them suggest consequences for their actions
- Help them understand the impact of their choices
- Guide them toward better decision-making

### Teenagers (13+ years)
**Adult-Level Consequences**
- If they break curfew, they lose driving privileges
- If they're disrespectful, they lose social privileges
- If they don't follow rules, they lose independence
- If they make poor choices, they face the natural consequences

**Supporting Independence**
- Help them understand the long-term impact of their choices
- Guide them toward responsible decision-making
- Support their growing independence while maintaining safety
- Use consequences as teaching tools for adulthood

## Overcoming Common Challenges

### Challenge: "I Feel Bad When My Child Is Upset"
**Solution**: Remember that being upset is a normal part of learning. Your child needs to experience the consequences of their choices to grow and learn.

### Challenge: "It's Easier to Give In"
**Solution**: While it might be easier in the short term, giving in teaches your child that consequences don't matter and can lead to bigger problems later.

### Challenge: "My Child Gets Really Angry"
**Solution**: This is normal and expected. Stay calm, offer comfort, and help them work through their anger while maintaining the consequence.

### Challenge: "I Don't Want to Damage Our Relationship"
**Solution**: Consistent follow-through actually strengthens relationships. Your child will respect you more when they know you care enough to guide them.

## Daily Follow-Through Practices

### Morning Routines
- Set clear expectations for getting ready
- Follow through immediately if expectations aren't met
- Stay calm and supportive
- Help them get back on track

### Mealtime Follow-Through
- Set clear rules about table manners
- Follow through immediately if rules are broken
- Stay calm and matter-of-fact
- Help them understand why the rules exist

### Bedtime Follow-Through
- Set clear expectations for bedtime routine
- Follow through immediately if expectations aren't met
- Stay calm and loving
- Help them get back on track

### Screen Time Follow-Through
- Set clear rules about when and how long
- Follow through immediately if rules are broken
- Stay calm and firm
- Help them find alternative activities

## Long-term Benefits

### For Your Child
- **Self-Discipline**: Better ability to control their own behavior
- **Responsibility**: Understanding that their choices have consequences
- **Problem-Solving**: Ability to work through challenges constructively
- **Independence**: Growing ability to make good decisions

### For Your Family
- **Reduced Conflict**: Clear expectations and consistent consequences prevent many arguments
- **Stronger Relationships**: Follow-through creates trust and respect
- **Family Harmony**: Everyone knows what to expect
- **Peaceful Home**: More calm and organized environment

## Remember: Follow-Through Is Love

Following through on consequences doesn't mean you love your child any less. In fact, it's one of the most loving things you can do. Consistent follow-through shows your child that you care enough to guide them, protect them, and help them become the best person they can be.

Your warm, understanding approach makes follow-through feel supportive rather than punitive. You can be both loving and firm, understanding and consistent, flexible and reliable. These qualities work together to create the perfect balance for raising a happy, healthy, responsible child.

Start with small changes, be patient with yourself and your child, and remember that every time you follow through, you're teaching your child important life skills and showing them how much you care.`,
        author: "Dr. Jennifer Lee, Family Therapist",
        readTime: "18 min read",
        category: "Discipline"
      },
      "Teaching Responsibility": {
        title: "Teaching Responsibility: A Guide for Permissive Parents",
        content: `# Teaching Responsibility: A Guide for Permissive Parents

## The Responsibility Challenge

As a permissive parent, you excel at showing love, understanding, and support. However, teaching responsibility can sometimes feel challenging when you want to protect your child from difficulties and keep them happy. This guide will help you teach responsibility while maintaining your warm, supportive approach.

## Why Teaching Responsibility Matters

### The Foundation of Success
- **Independence**: Responsible children can take care of themselves and make good decisions
- **Self-Esteem**: Children feel proud when they can handle responsibilities
- **Relationships**: Responsible children are better friends, siblings, and family members
- **Future Success**: Responsibility is essential for success in school, work, and life

### The Permissive Advantage
- **Patience**: Your understanding approach makes teaching responsibility feel supportive
- **Encouragement**: You can celebrate small steps and progress
- **Individual Attention**: You can adapt teaching methods to your child's unique needs
- **Emotional Support**: Your child feels safe to try new things and make mistakes

## Understanding Responsibility Development

### What Is Responsibility?
- **Accountability**: Taking ownership of one's actions and choices
- **Reliability**: Following through on commitments and promises
- **Self-Care**: Taking care of one's own needs and well-being
- **Consideration**: Thinking about how one's actions affect others

### Age-Appropriate Responsibilities
**Toddlers (1-3 years)**
- Putting toys away (with help)
- Helping with simple tasks
- Following basic safety rules
- Using manners (please, thank you)

**Preschoolers (3-5 years)**
- Dressing themselves (with some help)
- Cleaning up their messes
- Following family rules
- Being kind to others

**School Age (6-12 years)**
- Completing homework independently
- Doing age-appropriate chores
- Taking care of their belongings
- Being honest and trustworthy

**Teenagers (13+ years)**
- Managing their own schedule
- Taking care of their health and safety
- Contributing to family responsibilities
- Making good decisions about friends and activities

## Teaching Responsibility: Step by Step

### 1. Start Small and Build Success
**Choose Age-Appropriate Tasks**
- Pick something your child can realistically handle
- Start with tasks that are important but not too difficult
- Make sure the task is something they can succeed at
- Build confidence with small wins

**Examples to Start With**
- Toddlers: "Let's put the blocks in the box together"
- Preschoolers: "You can help me set the table"
- School Age: "You're responsible for feeding the pet"
- Teenagers: "You're responsible for managing your homework schedule"

### 2. Provide Clear Instructions
**Be Specific About What You Expect**
- "I need you to put all the toys in the toy box"
- "You need to complete your homework before dinner"
- "You're responsible for making your bed every morning"
- "You need to be home by 6 PM for dinner"

**Show Them How to Do It**
- Demonstrate the task first
- Break it down into simple steps
- Let them practice with your guidance
- Give them feedback and encouragement

### 3. Give Them Ownership
**Let Them Take the Lead**
- "This is your responsibility now"
- "You're in charge of this task"
- "I trust you to handle this"
- "This is your job to manage"

**Avoid Taking Over**
- Don't do it for them when they struggle
- Don't micromanage their approach
- Don't step in unless they ask for help
- Let them learn from their mistakes

### 4. Provide Support and Encouragement
**Celebrate Progress**
- "I'm proud of how you handled that"
- "You're getting better at this every day"
- "I can see you're really trying"
- "You should be proud of yourself"

**Offer Help When Needed**
- "I'm here if you need help"
- "What part would you like me to help with?"
- "Let me know if you get stuck"
- "I can show you a different way to do it"

## Age-Appropriate Teaching Strategies

### Toddlers (1-3 years)
**Make It Fun and Interactive**
- Turn cleanup into a game
- Sing songs while doing tasks
- Use timers and countdowns
- Celebrate every small success

**Provide Lots of Support**
- Do tasks together at first
- Give lots of encouragement
- Be patient with mistakes
- Focus on effort, not perfection

### Preschoolers (3-5 years)
**Use Visual Cues and Routines**
- Create charts with pictures
- Establish consistent routines
- Use timers and reminders
- Make tasks part of daily life

**Teach Problem-Solving**
- "What do you think we should do?"
- "How can we solve this problem?"
- "What would happen if we did this?"
- "What's a better way to handle this?"

### School Age (6-12 years)
**Give Them More Independence**
- Let them choose how to complete tasks
- Give them more complex responsibilities
- Help them understand consequences
- Teach them to ask for help when needed

**Focus on Long-term Goals**
- "Why is it important to do your homework?"
- "How does this help you in the future?"
- "What happens when you're responsible?"
- "How does this help our family?"

### Teenagers (13+ years)
**Treat Them as Young Adults**
- Give them significant responsibilities
- Let them make their own decisions
- Help them understand long-term consequences
- Support their growing independence

**Focus on Life Skills**
- "How will this help you when you're on your own?"
- "What skills do you need to develop?"
- "How can you prepare for the future?"
- "What responsibilities come with independence?"

## Overcoming Common Challenges

### Challenge: "My Child Doesn't Want to Do It"
**Solution**: Make it clear that some things are non-negotiable, but offer choices about how to do them. Focus on the positive aspects and celebrate progress.

### Challenge: "It's Easier to Do It Myself"
**Solution**: While it might be easier in the short term, doing things for your child prevents them from learning important skills. The investment in teaching pays off in the long run.

### Challenge: "My Child Gets Frustrated"
**Solution**: This is normal and expected. Stay calm, offer support, and help them work through their frustration while maintaining your expectations.

### Challenge: "I Don't Want to Pressure Them"
**Solution**: Teaching responsibility isn't about pressure—it's about helping your child develop important life skills. You can be supportive while still having expectations.

## Daily Teaching Practices

### Morning Routines
- Let them take responsibility for getting ready
- Offer choices about how to complete tasks
- Provide support when needed
- Celebrate their independence

### Homework Time
- Let them manage their own homework
- Help them understand the importance
- Offer support when they struggle
- Celebrate their efforts and progress

### Chores and Responsibilities
- Give them age-appropriate chores
- Let them choose how to complete them
- Provide guidance and support
- Celebrate their contributions

### Problem-Solving
- Let them work through challenges
- Ask questions to guide their thinking
- Offer support when they need it
- Celebrate their problem-solving skills

## Long-term Benefits

### For Your Child
- **Independence**: Better ability to take care of themselves
- **Self-Confidence**: Higher self-esteem from handling responsibilities
- **Problem-Solving**: Improved ability to work through challenges
- **Future Success**: Better prepared for school, work, and life

### For Your Family
- **Reduced Stress**: Children who can handle responsibilities reduce family stress
- **Stronger Relationships**: Responsible children are better family members
- **Family Harmony**: Everyone contributes to the family's well-being
- **Peaceful Home**: More organized and cooperative environment

## Remember: Teaching Responsibility Is Love

Teaching responsibility doesn't mean you love your child any less. In fact, it's one of the most loving things you can do. By teaching responsibility, you're preparing your child for success in life and showing them that you believe in their abilities.

Your warm, supportive approach makes learning responsibility feel encouraging rather than overwhelming. You can be both loving and firm, understanding and consistent, flexible and reliable. These qualities work together to create the perfect environment for teaching responsibility.

Start with small steps, be patient with the process, and remember that every responsibility you teach your child is a gift that will serve them throughout their life.`,
        author: "Dr. Michael Rodriguez, Child Development Specialist",
        readTime: "20 min read",
        category: "Development"
      },
      // Neglectful parenting articles
      "Creating Quality Time": {
        title: "Creating Quality Time: A Guide for Neglectful Parents",
        content: `# Creating Quality Time: A Guide for Neglectful Parents

## The Connection Challenge

As a parent who may have been less involved in your child's daily life, you might feel overwhelmed by the idea of creating meaningful connections. However, it's never too late to start building a stronger relationship with your child. This guide will help you take small, manageable steps toward creating quality time and meaningful connections.

## Why Quality Time Matters

### The Foundation of Healing
- **Trust Building**: Consistent time together helps rebuild trust and security
- **Emotional Connection**: Quality time creates opportunities for emotional bonding
- **Learning**: You can learn about your child's interests, fears, and dreams
- **Healing**: Both you and your child can heal from past disconnection

### The Power of Small Steps
- **Every Moment Counts**: Even 10 minutes of focused attention can make a difference
- **Consistency Over Duration**: Regular short interactions are better than occasional long ones
- **Quality Over Quantity**: Being fully present for 15 minutes is better than being distracted for an hour
- **Progress Over Perfection**: Small improvements add up over time

## Understanding Quality Time

### What Is Quality Time?
- **Focused Attention**: Being fully present and engaged with your child
- **Child-Centered**: Activities that your child enjoys and chooses
- **Emotionally Available**: Being open to your child's feelings and experiences
- **Consistent**: Regular, predictable time together

### Types of Quality Time
1. **One-on-One Time**: Individual attention without distractions
2. **Activity-Based Time**: Doing something together (playing, cooking, walking)
3. **Conversation Time**: Talking and listening to each other
4. **Routine Time**: Making everyday activities special (bedtime, meals)

## Building Quality Time: Step by Step

### 1. Start Small and Be Realistic
**Begin with 10-15 Minutes**
- Choose a time when you're both relaxed
- Pick an activity that's simple and enjoyable
- Don't try to do too much at once
- Focus on being present, not on achieving something

**Examples to Start With**
- Reading a book together
- Taking a short walk
- Playing a simple game
- Cooking something together
- Looking at photos

### 2. Let Your Child Lead
**Follow Their Interests**
- Ask what they'd like to do
- Pay attention to what makes them light up
- Be open to their suggestions
- Don't judge their interests

**Examples of Child-Led Activities**
- "What would you like to do together today?"
- "I noticed you like drawing. Can you show me how?"
- "You seem to enjoy music. What's your favorite song?"
- "I'd love to learn about your favorite video game"

### 3. Be Fully Present
**Eliminate Distractions**
- Put away your phone
- Turn off the TV
- Close your laptop
- Focus entirely on your child

**Show You're Listening**
- Make eye contact
- Ask follow-up questions
- Reflect back what you hear
- Show genuine interest

### 4. Create Simple Routines
**Establish Regular Times**
- Choose a consistent time each day
- Make it part of your daily routine
- Start with just a few minutes
- Gradually increase the time

**Examples of Simple Routines**
- 10 minutes before bedtime
- 15 minutes after dinner
- A short walk on weekends
- Reading together before school

## Age-Appropriate Quality Time

### Toddlers (1-3 years)
**Simple, Interactive Activities**
- Playing with blocks or toys
- Reading picture books
- Singing songs together
- Going for short walks

**Focus on Physical Connection**
- Lots of hugs and cuddles
- Gentle physical play
- Comforting when they're upset
- Celebrating small achievements

### Preschoolers (3-5 years)
**Imaginative and Creative Activities**
- Pretend play and dress-up
- Art projects and crafts
- Storytelling and make-believe
- Simple games and puzzles

**Encourage Expression**
- Ask about their day
- Listen to their stories
- Encourage their creativity
- Celebrate their imagination

### School Age (6-12 years)
**Interest-Based Activities**
- Learn about their hobbies
- Help with homework
- Play their favorite games
- Explore their interests together

**Support Their Development**
- Ask about school and friends
- Help them with challenges
- Celebrate their achievements
- Be there for their struggles

### Teenagers (13+ years)
**Respectful, Adult-Like Interactions**
- Have real conversations
- Respect their privacy
- Support their independence
- Be available when they need you

**Build Trust and Understanding**
- Listen without judgment
- Share your own experiences
- Be honest about your feelings
- Show interest in their world

## Overcoming Common Challenges

### Challenge: "I Don't Know What to Do"
**Solution**: Start with simple activities and let your child guide you. Ask them what they'd like to do together.

### Challenge: "My Child Doesn't Want to Spend Time with Me"
**Solution**: This is normal and expected. Be patient, start small, and don't take it personally. Keep trying gently.

### Challenge: "I Feel Awkward and Uncomfortable"
**Solution**: This is also normal. Start with activities that feel natural to you, and remember that practice makes it easier.

### Challenge: "I Don't Have Time"
**Solution**: Even 10 minutes can make a difference. Look for small opportunities throughout the day.

### Challenge: "I'm Afraid I'll Mess Up"
**Solution**: Your child needs you to try more than they need you to be perfect. Small efforts show you care.

## Daily Quality Time Practices

### Morning Connections
- Greet your child warmly
- Ask about their day ahead
- Share a simple breakfast
- Give them a hug or pat on the back

### Evening Reflections
- Ask about their day
- Listen to their stories
- Share something about your day
- End with a loving goodnight

### Weekend Activities
- Plan one special activity together
- Let them choose what to do
- Be fully present during the activity
- Focus on having fun together

### Special Moments
- Celebrate their achievements
- Comfort them when they're upset
- Be there for important events
- Show interest in their interests

## Building Trust and Connection

### Be Consistent
- Show up when you say you will
- Keep your promises
- Be reliable and predictable
- Don't make commitments you can't keep

### Be Patient
- Building trust takes time
- Don't expect immediate results
- Be patient with setbacks
- Celebrate small progress

### Be Honest
- Admit when you've made mistakes
- Be honest about your feelings
- Don't make promises you can't keep
- Show your child that you're human

### Be Supportive
- Encourage their interests
- Support their goals
- Be there when they need you
- Celebrate their successes

## Long-term Benefits

### For Your Child
- **Security**: Feeling loved and valued
- **Self-Esteem**: Knowing they matter to you
- **Trust**: Learning to trust others
- **Resilience**: Better ability to handle challenges

### For Your Family
- **Stronger Relationships**: Deeper understanding and connection
- **Better Communication**: More open and honest conversations
- **Family Harmony**: More peaceful and loving home
- **Healing**: Opportunity to heal from past disconnection

## Remember: It's Never Too Late

No matter what has happened in the past, it's never too late to start building a stronger relationship with your child. Every small step you take toward creating quality time shows your child that you care and that they matter to you.

Your child needs you to try more than they need you to be perfect. Start with small, manageable steps, be patient with yourself and your child, and remember that every moment of connection is a gift that will benefit both of you for years to come.

The most important thing is to start. Even 10 minutes of focused attention can begin to heal wounds and build the foundation for a stronger, more connected relationship.`,
        author: "Dr. Amanda Foster, Family Therapist",
        readTime: "16 min read",
        category: "Connection"
      },
      "Seeking Support": {
        title: "Seeking Support: A Guide for Neglectful Parents",
        content: `# Seeking Support: A Guide for Neglectful Parents

## The Support Journey

As a parent who may have been less involved in your child's life, you might feel isolated, overwhelmed, or unsure about where to turn for help. However, seeking support is one of the most important steps you can take toward becoming a better parent and building a stronger relationship with your child. This guide will help you find the right support and resources for your family.

## Why Seeking Support Matters

### The Foundation of Change
- **Learning**: Support helps you learn new parenting skills and strategies
- **Accountability**: Having others to check in with keeps you motivated
- **Emotional Support**: You don't have to face challenges alone
- **Resources**: Support connects you with helpful tools and information

### Breaking the Isolation
- **Connection**: Support groups help you connect with other parents
- **Understanding**: Others who have been through similar experiences can relate
- **Encouragement**: Support provides motivation and encouragement
- **Hope**: Seeing others succeed gives you hope for your own family

## Types of Support Available

### Professional Support
**Family Therapists**
- Help with family dynamics and communication
- Provide individual and family counseling
- Teach parenting skills and strategies
- Address underlying issues that affect parenting

**Parenting Coaches**
- Focus specifically on parenting skills
- Provide practical guidance and support
- Help you develop specific strategies
- Offer ongoing accountability and encouragement

**Child Psychologists**
- Help understand your child's needs
- Address behavioral and emotional issues
- Provide guidance on child development
- Support your child's mental health

### Community Support
**Parenting Groups**
- Connect with other parents facing similar challenges
- Share experiences and learn from others
- Provide mutual support and encouragement
- Often led by professionals or experienced parents

**Support Groups**
- Specific groups for different parenting challenges
- Safe space to share struggles and successes
- Peer support and understanding
- Often free or low-cost

**Community Centers**
- Offer parenting classes and workshops
- Provide family activities and programs
- Connect families with resources
- Often have sliding scale fees

### Online Support
**Parenting Forums**
- Connect with parents from around the world
- Share experiences and ask questions
- Access information and resources
- Available 24/7 for support

**Online Courses**
- Learn parenting skills at your own pace
- Access expert knowledge and strategies
- Often more affordable than in-person support
- Can be done from home

**Social Media Groups**
- Connect with like-minded parents
- Share daily struggles and successes
- Access quick advice and support
- Build ongoing relationships

## Finding the Right Support

### Assess Your Needs
**What Do You Need Help With?**
- Learning basic parenting skills
- Understanding your child's behavior
- Managing your own emotions and stress
- Building better communication with your child
- Addressing specific challenges or issues

**What Type of Support Works Best for You?**
- Individual or group support
- In-person or online
- Professional or peer support
- Short-term or ongoing support

### Research Your Options
**Ask for Recommendations**
- Talk to your child's doctor or teacher
- Ask other parents you know
- Contact local community centers
- Search online for local resources

**Check Credentials and Reviews**
- Look for licensed professionals
- Read reviews and testimonials
- Ask about their experience with your specific needs
- Make sure they're a good fit for your family

### Start Small
**Begin with One Type of Support**
- Don't try to do everything at once
- Start with what feels most comfortable
- Build confidence with small successes
- Gradually add more support as needed

**Examples to Start With**
- Join an online parenting group
- Attend a free parenting workshop
- Schedule one session with a family therapist
- Find a local support group

## Overcoming Barriers to Seeking Support

### Barrier: "I'm Embarrassed to Ask for Help"
**Solution**: Remember that seeking help is a sign of strength, not weakness. Every parent needs support, and asking for help shows you care about your child.

### Barrier: "I Can't Afford Professional Help"
**Solution**: Many resources are free or low-cost. Look for community centers, support groups, online resources, and sliding scale services.

### Barrier: "I Don't Have Time"
**Solution**: Even small amounts of support can make a big difference. Look for online resources, short workshops, or support that fits your schedule.

### Barrier: "I Don't Know Where to Start"
**Solution**: Start with your child's doctor or teacher. They can often point you toward appropriate resources and support.

### Barrier: "I'm Afraid of Being Judged"
**Solution**: Look for supportive, non-judgmental resources. Many support groups and professionals specialize in helping parents without judgment.

## Building Your Support Network

### Start with One Person
- Choose someone you trust and feel comfortable with
- Share your struggles and ask for their support
- Be specific about what kind of help you need
- Don't be afraid to ask for what you need

### Expand Gradually
- Add one new support person or resource at a time
- Don't overwhelm yourself with too many commitments
- Focus on quality over quantity
- Build relationships slowly and authentically

### Give and Receive
- Offer support to others when you can
- Share your experiences and insights
- Be open to learning from others
- Remember that support is a two-way street

## Making the Most of Support

### Be Open and Honest
- Share your real struggles and challenges
- Don't try to appear perfect or have it all together
- Ask for specific help and guidance
- Be willing to try new approaches

### Take Action
- Don't just attend support groups or therapy
- Actually try the strategies and suggestions you learn
- Practice new skills regularly
- Be patient with yourself as you learn

### Stay Committed
- Change takes time and consistent effort
- Don't give up if you don't see immediate results
- Keep showing up and trying
- Celebrate small progress and improvements

## Long-term Benefits

### For You
- **Confidence**: Better parenting skills and knowledge
- **Support**: Network of people who understand and care
- **Growth**: Personal development and self-improvement
- **Peace**: Less stress and more enjoyment in parenting

### For Your Child
- **Better Parenting**: More effective and loving care
- **Stability**: More consistent and reliable parenting
- **Growth**: Better development and well-being
- **Connection**: Stronger relationship with you

### For Your Family
- **Harmony**: More peaceful and loving home
- **Communication**: Better understanding and connection
- **Support**: Network of resources and help
- **Hope**: Brighter future for everyone

## Remember: You're Not Alone

Every parent faces challenges, and seeking support is a sign of strength and love for your child. You don't have to figure everything out on your own, and you don't have to be perfect to be a good parent.

Start with one small step toward getting support. Whether it's joining an online group, attending a workshop, or scheduling a therapy session, every step you take toward getting help is a step toward becoming the parent you want to be.

Your child deserves your best effort, and you deserve the support you need to give them that. Don't be afraid to reach out and ask for help. The right support can make all the difference in your parenting journey.`,
        author: "Dr. Robert Kim, Family Support Specialist",
        readTime: "17 min read",
        category: "Support"
      }
    };
    
    return articleContent[resourceTitle] || {
      title: "Parenting Resource",
      content: "This article is coming soon. Please check back later for comprehensive content on this topic.",
      author: "Kindling Team",
      readTime: "5 min read",
      category: "General"
    };
  };

  // Handle resource navigation
  const handleResourcePress = (resource) => {
    console.log('Resource pressed:', resource.title);
    
    const articleContent = getArticleContent(resource.title, questionnaireResults?.dominantStyle);
    setSelectedArticle(articleContent);
    setShowArticleModal(true);
  };

  // Challenge handling functions
  const handleStartChallenge = (challengeIndex, challenge) => {
    console.log('Starting challenge:', challengeIndex, challenge.title);
    setActiveChallenge({ index: challengeIndex, ...challenge });
    
    const newChallengeProgress = {
      ...challengeProgress,
      [challengeIndex]: {
        ...challenge,
        status: 'active',
        startDate: new Date().toISOString(),
        completed: false
      }
    };
    
    setChallengeProgress(newChallengeProgress);
    
    // Save to Firebase
    saveChallengeProgressToFirebase(newChallengeProgress);
    
    // Show modal instead of alert
    setSelectedChallenge({ index: challengeIndex, ...challenge });
    setShowChallengeModal(true);
  };

  const handleCompleteChallenge = (challengeIndex) => {
    const newChallengeProgress = {
      ...challengeProgress,
      [challengeIndex]: {
        ...challengeProgress[challengeIndex],
        status: 'completed',
        completedDate: new Date().toISOString(),
        completed: true
      }
    };
    
    setChallengeProgress(newChallengeProgress);
    setActiveChallenge(null);
    
    // Save to Firebase
    saveChallengeProgressToFirebase(newChallengeProgress);
    
    setShowCompleteModal(true);
  };

  const handleSkipChallenge = (challengeIndex) => {
    const newChallengeProgress = {
      ...challengeProgress,
      [challengeIndex]: {
        ...challengeProgress[challengeIndex],
        status: 'skipped',
        skippedDate: new Date().toISOString()
      }
    };
    
    setChallengeProgress(newChallengeProgress);
    setActiveChallenge(null);
    
    // Save to Firebase
    saveChallengeProgressToFirebase(newChallengeProgress);
    
    setShowChallengeModal(false);
  };

  const getChallengeStatus = (challengeIndex) => {
    return challengeProgress[challengeIndex]?.status || 'not_started';
  };

  // Check if a challenge can be started (previous day must be completed)
  const canStartChallenge = (challengeIndex) => {
    // Day 1 (index 0) can always be started
    if (challengeIndex === 0) {
      return true;
    }
    
    // For other days, check if previous day is completed
    const previousDayStatus = getChallengeStatus(challengeIndex - 1);
    return previousDayStatus === 'completed';
  };

  // Check if a challenge is locked (previous day not completed)
  const isChallengeLocked = (challengeIndex) => {
    return !canStartChallenge(challengeIndex);
  };

  const getChallengeButtonText = (challengeIndex) => {
    const status = getChallengeStatus(challengeIndex);
    
    if (isChallengeLocked(challengeIndex)) {
      return 'Locked';
    }
    
    switch (status) {
      case 'active': return 'In Progress';
      case 'completed': return 'Completed ✓';
      case 'skipped': return 'Skipped';
      default: return 'Start Challenge';
    }
  };

  const getChallengeButtonStyle = (challengeIndex) => {
    if (isChallengeLocked(challengeIndex)) {
      return styles.challengeButtonLocked;
    }
    
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
        onViewAIAnalysis={handleViewAIAnalysis}
      />
    );
  }

  if (currentScreen === 'ai-analysis') {
    return (
      <AIParentingAnalysis
        questionnaireResults={questionnaireResults}
        onBack={handleBackFromAnalysis}
        onRetake={handleRetakeFromAnalysis}
        onSave={handleSaveAnalysis}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="heart-outline" size={42} color="#FF99C8" />
        <Text style={styles.logo}>Kindling</Text>
        <Text style={styles.subtitle}>Personalized Parenting Journey</Text>
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
                {isGeneratingQuote ? (
                  "Generating your personalized message..."
                ) : encouragingQuote ? (
                  <Text style={styles.quoteText}>{encouragingQuote}</Text>
                ) : (
                  "View your detailed results and personalized recommendations below."
                )}
        </Text>
              {questionnaireResults?.completedAt && (
                <Text style={styles.completedDate}>
                  Completed on {new Date(questionnaireResults.completedAt).toLocaleDateString()}
                </Text>
              )}
      </View>


            {/* Action Buttons */}
            <View style={styles.actionButtonsBox}>
              <TouchableOpacity style={styles.viewResultsButton} onPress={() => setCurrentScreen('results')}>
                <Ionicons name="eye" size={24} color="#fff" />
                <Text style={styles.buttonText}>View Detailed Results</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.aiAnalysisMainButton} onPress={handleViewAIAnalysis}>
                <Ionicons name="analytics" size={24} color="#fff" />
                <Text style={styles.buttonText}>Get AI Analysis</Text>
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
              <Text style={styles.sectionTitle}>Quick Actions for You</Text>
              <View style={styles.quickActionsGrid}>
                {getQuickActions(questionnaireResults?.dominantStyle).map((action, index) => (
                  <TouchableOpacity key={index} style={styles.quickActionItem}>
                    <Ionicons name={action.icon} size={24} color={action.color} />
                    <Text style={styles.quickActionText}>{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
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
                <View key={index} style={[styles.challengeItem, isChallengeLocked(index) && styles.challengeItemLocked]}>
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
                        
                        // Don't allow interaction with locked challenges
                        if (isChallengeLocked(index)) {
                          return;
                        }
                        
                        if (status === 'active') {
                          setSelectedChallenge({ index, ...challenge });
                          setShowCompleteModal(true);
                        } else if (status === 'not_started') {
                          console.log('Starting challenge...');
                          handleStartChallenge(index, challenge);
                        } else if (status === 'skipped') {
                          console.log('Restarting skipped challenge...');
                          handleStartChallenge(index, challenge);
                        }
                      }}
                    >
                      <Text style={isChallengeLocked(index) ? styles.challengeButtonLockedText : styles.challengeButtonText}>
                        {getChallengeButtonText(index)}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.challengeInfoButton, isChallengeLocked(index) && styles.challengeInfoButtonLocked]}
                      onPress={() => {
                        if (isChallengeLocked(index)) {
                          return;
                        }
                        setSelectedChallenge({ index, ...challenge });
                        setShowChallengeModal(true);
                      }}
                    >
                      <Ionicons 
                        name="information-circle" 
                        size={16} 
                        color={isChallengeLocked(index) ? "#95A5A6" : "#3498DB"} 
                      />
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
              <Text style={styles.communitySubtitle}>What other parents are saying</Text>
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
              <Text style={styles.resourcesSubtitle}>Curated content for you</Text>
              {getRecommendedResources(questionnaireResults?.dominantStyle).map((resource, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.resourceItem}
                  onPress={() => handleResourcePress(resource)}
                >
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

    {/* Challenge Info Modal */}
    <Modal
      visible={showChallengeModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowChallengeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={[styles.modalIcon, { backgroundColor: selectedChallenge?.color || '#3498DB' }]}>
              <Ionicons name={selectedChallenge?.icon || 'bulb'} size={24} color="#fff" />
            </View>
            <Text style={styles.modalTitle}>{selectedChallenge?.title || 'Challenge'}</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowChallengeModal(false)}
            >
              <Ionicons name="close" size={24} color="#6C757D" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalDescription}>
            {selectedChallenge?.description || 'No description available.'}
          </Text>
          
          <View style={styles.modalActions}>
            {getChallengeStatus(selectedChallenge?.index) === 'active' && (
              <TouchableOpacity 
                style={styles.modalSkipButton}
                onPress={() => {
                  handleSkipChallenge(selectedChallenge?.index);
                  setShowChallengeModal(false);
                }}
              >
                <Text style={styles.modalSkipButtonText}>Skip Challenge</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.modalCloseActionButton}
              onPress={() => setShowChallengeModal(false)}
            >
              <Text style={styles.modalCloseActionButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

    {/* Challenge Complete Modal */}
    <Modal
      visible={showCompleteModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCompleteModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={[styles.modalIcon, { backgroundColor: '#27AE60' }]}>
              <Ionicons name="checkmark" size={24} color="#fff" />
            </View>
            <Text style={styles.modalTitle}>Challenge Completed!</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowCompleteModal(false)}
            >
              <Ionicons name="close" size={24} color="#6C757D" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalDescription}>
            Great job! You've completed this challenge. Keep up the excellent work!
          </Text>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.modalCloseActionButton}
              onPress={() => {
                if (selectedChallenge?.index !== undefined) {
                  handleCompleteChallenge(selectedChallenge.index);
                }
                setShowCompleteModal(false);
              }}
            >
              <Text style={styles.modalCloseActionButtonText}>Awesome!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

    {/* Beautiful Article Modal */}
    <Modal
      visible={showArticleModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowArticleModal(false)}
    >
      <View style={styles.articleModalOverlay}>
        <View style={styles.articleModalContainer}>
          {/* Header Section */}
          <View style={styles.articleModalHeader}>
            <View style={styles.articleModalHeaderTop}>
              <View style={styles.articleModalIconContainer}>
                <View style={styles.articleModalIcon}>
                  <Ionicons name="book-open" size={28} color="#fff" />
                </View>
                <View style={styles.articleModalCategory}>
                  <Text style={styles.articleModalCategoryText}>{selectedArticle?.category || 'General'}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.articleModalCloseButton}
                onPress={() => setShowArticleModal(false)}
              >
                <Ionicons name="close-circle" size={32} color="#6C757D" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.articleModalTitleSection}>
              <Text style={styles.articleModalTitle}>{selectedArticle?.title || 'Article'}</Text>
              <View style={styles.articleModalMetaContainer}>
                <View style={styles.articleModalAuthorContainer}>
                  <Ionicons name="person-circle" size={16} color="#6C757D" />
                  <Text style={styles.articleModalAuthor}>{selectedArticle?.author || 'Author'}</Text>
                </View>
                <View style={styles.articleModalReadTimeContainer}>
                  <Ionicons name="time" size={16} color="#3498DB" />
                  <Text style={styles.articleModalReadTime}>{selectedArticle?.readTime || '5 min read'}</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Content Section */}
          <ScrollView 
            style={styles.articleModalBody} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.articleModalContentContainer}
          >
            <View style={styles.articleModalContentWrapper}>
              {selectedArticle?.content ? (
                selectedArticle.content.split('\n').map((line, index) => {
                  // Handle headers
                  if (line.match(/^#{1,6}\s+/)) {
                    const level = line.match(/^#+/)[0].length;
                    const text = line.replace(/^#+\s+/, '');
                    return (
                      <Text key={index} style={[
                        styles.articleModalContent,
                        level === 1 && styles.articleModalH1,
                        level === 2 && styles.articleModalH2,
                        level === 3 && styles.articleModalH3,
                        { marginTop: index > 0 ? 20 : 0, marginBottom: 10 }
                      ]}>
                        {text}
                      </Text>
                    );
                  }
                  
                  // Handle bold text
                  if (line.match(/\*\*.*\*\*/)) {
                    const parts = line.split(/(\*\*.*?\*\*)/);
                    return (
                      <Text key={index} style={[styles.articleModalContent, { marginBottom: 8 }]}>
                        {parts.map((part, partIndex) => {
                          if (part.match(/\*\*.*\*\*/)) {
                            return (
                              <Text key={partIndex} style={styles.articleModalBold}>
                                {part.replace(/\*\*/g, '')}
                              </Text>
                            );
                          }
                          return part;
                        })}
                      </Text>
                    );
                  }
                  
                  // Handle bullet points
                  if (line.match(/^\s*[-*+]\s+/)) {
                    const text = line.replace(/^\s*[-*+]\s+/, '');
                    return (
                      <View key={index} style={styles.articleModalBulletPoint}>
                        <Text style={styles.articleModalBullet}>•</Text>
                        <Text style={[styles.articleModalContent, styles.articleModalBulletText]}>
                          {text}
                        </Text>
                      </View>
                    );
                  }
                  
                  // Handle numbered lists
                  if (line.match(/^\s*\d+\.\s+/)) {
                    const match = line.match(/^\s*(\d+)\.\s+(.*)/);
                    if (match) {
                      return (
                        <View key={index} style={styles.articleModalNumberedPoint}>
                          <Text style={styles.articleModalNumber}>{match[1]}.</Text>
                          <Text style={[styles.articleModalContent, styles.articleModalNumberedText]}>
                            {match[2]}
                          </Text>
                        </View>
                      );
                    }
                  }
                  
                  // Handle regular paragraphs
                  if (line.trim()) {
                    return (
                      <Text key={index} style={[styles.articleModalContent, { marginBottom: 12 }]}>
                        {line}
                      </Text>
                    );
                  }
                  
                  // Handle empty lines
                  return <View key={index} style={{ height: 8 }} />;
                })
              ) : (
                <Text style={styles.articleModalContent}>Content not available.</Text>
              )}
            </View>
          </ScrollView>
          
          {/* Footer Section */}
          <View style={styles.articleModalFooter}>
            <View style={styles.articleModalFooterContent}>
              <View style={styles.articleModalFooterLeft}>
                <Ionicons name="heart" size={20} color="#E74C3C" />
                <Text style={styles.articleModalFooterText}>Helpful Article</Text>
              </View>
              <TouchableOpacity 
                style={styles.articleModalCloseActionButton}
                onPress={() => setShowArticleModal(false)}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.articleModalCloseActionButtonText}>Got it!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F9FAFB" 
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    alignItems: "center",
    paddingBottom: 50,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: "#0B132B",
    width: "100%",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logo: {
    fontSize: 34,
    fontWeight: "800",
    color: "#FF99C8",
    marginTop: 2,
  },
  subtitle: {
    fontSize: 15,
    color: "#EAEAEA",
    textAlign: "center",
    marginTop: 6,
  },
  welcomeBox: { 
    width: "90%",
    backgroundColor: "#fff", 
    marginVertical: 15, 
    padding: 25, 
    borderRadius: 18, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: "#1C2541",
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
    width: "90%",
    backgroundColor: "#fff", 
    marginVertical: 15, 
    padding: 25, 
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
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
    width: "90%",
    backgroundColor: "#fff", 
    marginVertical: 15, 
    padding: 25, 
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
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
    width: "90%",
    backgroundColor: "#E8F5E9",
    marginVertical: 15,
    padding: 25,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
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
  quoteText: {
    fontSize: 16,
    color: "#2C3E50",
    lineHeight: 24,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  actionButtonsBox: {
    width: "90%",
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
  aiAnalysisMainButton: {
    backgroundColor: "#9B59B6",
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
    width: "90%",
    backgroundColor: "#fff",
    marginVertical: 15,
    padding: 25,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
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
    width: "90%",
    backgroundColor: "#fff",
    marginVertical: 15,
    padding: 25,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
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
  challengeButtonLocked: {
    backgroundColor: "#E9ECEF",
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
  challengeButtonLockedText: {
    color: "#6C757D",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  progressSummaryBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 25,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
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
  // Missing style definitions
  analysisBox: {
    width: "90%",
    backgroundColor: "#fff",
    marginVertical: 15,
    padding: 25,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },
  analysisItem: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: "#2C3E50",
    marginLeft: 12,
  },
  analysisDescription: {
    fontSize: 16,
    color: "#6C757D",
    lineHeight: 22,
    marginBottom: 10,
  },
  percentageBar: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  percentageFill: {
    height: '100%',
    borderRadius: 3,
  },
  challengesBox: {
    width: "90%",
    backgroundColor: "#fff",
    marginVertical: 15,
    padding: 25,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },
  challengesSubtitle: {
    fontSize: 14,
    color: "#6C757D",
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
  },
  challengeItem: {
    backgroundColor: '#F8F9FA',
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  challengeDay: {
    fontSize: 12,
    fontWeight: '600',
    color: "#6C757D",
    backgroundColor: '#E9ECEF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  challengeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: "#2C3E50",
    marginBottom: 6,
  },
  challengeDescription: {
    fontSize: 14,
    color: "#6C757D",
    lineHeight: 20,
    marginBottom: 12,
  },
  challengeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeInfoButton: {
    padding: 8,
    marginLeft: 8,
  },
  challengeInfoButtonLocked: {
    opacity: 0.5,
  },
  challengeItemLocked: {
    opacity: 0.6,
    backgroundColor: '#F8F9FA',
  },
  progressBox: {
    width: "90%",
    backgroundColor: "#fff",
    marginVertical: 15,
    padding: 25,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },
  progressTimeline: {
    marginTop: 15,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 15,
    marginTop: 6,
  },
  progressCompleted: {
    backgroundColor: '#27AE60',
  },
  progressCurrent: {
    backgroundColor: '#3498DB',
  },
  progressPending: {
    backgroundColor: '#E9ECEF',
  },
  progressContent: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: "#2C3E50",
    marginBottom: 4,
  },
  progressDate: {
    fontSize: 14,
    color: "#6C757D",
  },
  communityBox: {
    width: "90%",
    backgroundColor: "#fff",
    marginVertical: 15,
    padding: 25,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },
  communitySubtitle: {
    fontSize: 14,
    color: "#6C757D",
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
  },
  insightItem: {
    backgroundColor: '#F8F9FA',
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  insightAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3498DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightInitial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  insightInfo: {
    flex: 1,
  },
  insightName: {
    fontSize: 16,
    fontWeight: '600',
    color: "#2C3E50",
    marginBottom: 2,
  },
  insightRole: {
    fontSize: 12,
    color: "#6C757D",
  },
  insightRating: {
    flexDirection: 'row',
  },
  insightText: {
    fontSize: 14,
    color: "#3A506B",
    lineHeight: 20,
    fontStyle: 'italic',
  },
  resourcesBox: {
    width: "90%",
    backgroundColor: "#fff",
    marginVertical: 15,
    padding: 25,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },
  resourcesSubtitle: {
    fontSize: 14,
    color: "#6C757D",
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    marginBottom: 12,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: "#2C3E50",
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: "#6C757D",
    lineHeight: 18,
    marginBottom: 6,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceType: {
    fontSize: 12,
    color: "#3498DB",
    fontWeight: '500',
    marginRight: 10,
  },
  resourceDuration: {
    fontSize: 12,
    color: "#6C757D",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  modalTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#1C2541',
  },
  modalCloseButton: {
    padding: 5,
  },
  modalDescription: {
    fontSize: 16,
    color: '#6C757D',
    lineHeight: 24,
    marginBottom: 25,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalSkipButton: {
    backgroundColor: '#E9ECEF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalSkipButtonText: {
    color: '#6C757D',
    fontSize: 16,
    fontWeight: '600',
  },
  modalCloseActionButton: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalCloseActionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Beautiful Article Modal Styles
  articleModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  articleModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 600,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  articleModalHeader: {
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  articleModalHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  articleModalIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  articleModalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3498DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#3498DB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  articleModalCategory: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  articleModalCategoryText: {
    fontSize: 12,
    color: '#3498DB',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  articleModalCloseButton: {
    padding: 4,
  },
  articleModalTitleSection: {
    flex: 1,
  },
  articleModalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1C2541',
    lineHeight: 32,
    marginBottom: 12,
  },
  articleModalMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  articleModalAuthorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  articleModalAuthor: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  articleModalReadTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  articleModalReadTime: {
    fontSize: 14,
    color: '#3498DB',
    fontWeight: '600',
  },
  articleModalBody: {
    flex: 1,
    backgroundColor: '#fff',
  },
  articleModalContentContainer: {
    paddingBottom: 20,
  },
  articleModalContentWrapper: {
    padding: 24,
  },
  articleModalContent: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 28,
    textAlign: 'left',
  },
  articleModalH1: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C2541',
    lineHeight: 30,
    marginBottom: 16,
    marginTop: 24,
  },
  articleModalH2: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C2541',
    lineHeight: 28,
    marginBottom: 12,
    marginTop: 20,
  },
  articleModalH3: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C2541',
    lineHeight: 26,
    marginBottom: 10,
    marginTop: 16,
  },
  articleModalBold: {
    fontWeight: '700',
    color: '#1C2541',
  },
  articleModalBulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 8,
  },
  articleModalBullet: {
    fontSize: 18,
    color: '#3498DB',
    fontWeight: 'bold',
    marginRight: 12,
    marginTop: 2,
  },
  articleModalBulletText: {
    flex: 1,
    marginTop: 0,
  },
  articleModalNumberedPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 8,
  },
  articleModalNumber: {
    fontSize: 16,
    color: '#3498DB',
    fontWeight: '700',
    marginRight: 12,
    marginTop: 2,
    minWidth: 20,
  },
  articleModalNumberedText: {
    flex: 1,
    marginTop: 0,
  },
  articleModalFooter: {
    backgroundColor: '#F8F9FA',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  articleModalFooterContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleModalFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  articleModalFooterText: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  articleModalCloseActionButton: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#3498DB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  articleModalCloseActionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
