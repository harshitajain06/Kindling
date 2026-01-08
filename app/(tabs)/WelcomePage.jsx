import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';

const StackedCard = ({ children, isVisible, index, totalCards, cardWidth }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const translateY = useSharedValue(50);
  const zIndex = useSharedValue(totalCards - index);

  useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.ease),
      });
      scale.value = withSequence(
        withTiming(1.05, { duration: 300, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 300, easing: Easing.in(Easing.ease) })
      );
      translateY.value = withTiming(0, {
        duration: 600,
        easing: Easing.out(Easing.ease),
      });
      zIndex.value = withTiming(100, { duration: 0 });
    } else {
      opacity.value = withTiming(0.3, {
        duration: 400,
        easing: Easing.in(Easing.ease),
      });
      scale.value = withTiming(0.95, {
        duration: 400,
        easing: Easing.in(Easing.ease),
      });
      zIndex.value = withTiming(totalCards - index, { duration: 0 });
    }
  }, [isVisible, index, totalCards, opacity, scale, translateY, zIndex]);

  const animatedStyle = useAnimatedStyle(() => {
    const offset = (totalCards - index - 1) * 8;
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value - offset },
        { scale: scale.value },
      ],
      zIndex: zIndex.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        animatedStyle,
        styles.featureCard,
        {
          width: cardWidth,
          position: 'absolute',
        },
      ]}
    >
      <View style={styles.cardContent}>
        {children}
      </View>
    </Animated.View>
  );
};

const WelcomePage = () => {
  const navigation = useNavigation();
  
  const { width } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  const isTablet = width > 768;

  const features = [
    {
      emoji: '🎯',
      title: 'Personalized Assessment',
      description: 'Take our comprehensive parenting style assessment to discover your unique approach.',
    },
    {
      emoji: '📚',
      title: 'Expert Insights',
      description: 'Access evidence-based parenting strategies tailored to your family\'s needs.',
    },
    {
      emoji: '👥',
      title: 'Community Support',
      description: 'Connect with other parents and share experiences in a supportive environment.',
    },
    {
      emoji: '📊',
      title: 'Progress Tracking',
      description: 'Monitor your parenting journey with detailed insights and progress reports.',
    },
    {
      emoji: '🎨',
      title: 'Personalized Content',
      description: 'Get customized recommendations and content based on your family\'s unique needs.',
    },
  ];

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const cardWidth = Math.min(width * 0.85, 320);

  // Auto-advance cards every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <View style={[styles.container, isWeb && styles.webContainer]}>
      <View style={[styles.content, isTablet && styles.tabletContent, isWeb && styles.webContent]}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/images/Logo.png')} style={styles.logo} />
          </View>
          
          <TouchableOpacity 
            style={[styles.primaryButton, isWeb && styles.webPrimaryButton]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.primaryButtonText, isWeb && styles.webPrimaryButtonText]}>
              Get Started with Kindling
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.subtitle, isWeb && styles.webSubtitle]}>
            Your personalized parenting companion. Discover your unique parenting style, 
            get expert insights, and connect with a community of parents on the same journey.
          </Text>
        </View>

        {/* Features Section - Stacked Cards */}
        <View style={styles.featuresContainer}>
          <View style={[styles.cardStack, { width: cardWidth, height: 180 }]}>
            {features.map((feature, index) => (
              <StackedCard
                key={index}
                isVisible={index === currentCardIndex}
                index={index}
                totalCards={features.length}
                cardWidth={cardWidth}
              >
                <View style={styles.featureIcon}>
                  <Text style={styles.featureEmoji}>{feature.emoji}</Text>
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </StackedCard>
            ))}
          </View>
          
          {/* Card Indicators */}
          <View style={styles.indicators}>
            {features.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentCardIndex(index)}
                style={[
                  styles.indicator,
                  index === currentCardIndex && styles.indicatorActive,
                  index < features.length - 1 && styles.indicatorSpacing,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Footer Section */}
        <View style={styles.footerSection}>
          <Text style={[styles.footerText, isWeb && styles.webFooterText]}>
            Start your parenting journey today
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webContainer: {
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        display: 'flex',
        minHeight: '100vh',
      },
    }),
  },
  content: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'web' ? 10 : 15,
    paddingHorizontal: 20,
    maxWidth: Platform.OS === 'web' ? 1200 : '100%',
    gap: Platform.OS === 'web' ? 8 : 5,
    ...Platform.select({
      web: {
        margin: '0 auto',
        display: 'flex',
        position: 'relative',
      },
    }),
  },
  tabletContent: {
    maxWidth: 1400,
  },
  webContent: {
    ...Platform.select({
      web: {
        alignSelf: 'center',
        margin: '0 auto',
      },
    }),
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 8,
    flexShrink: 0,
    width: '100%',
    alignSelf: 'center',
    ...Platform.select({
      web: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    }),
  },
  logoContainer: {
    marginBottom: 6,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  subtitle: {
    fontSize: Platform.OS === 'web' ? 14 : 12,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 550,
    paddingHorizontal: 10,
  },
  webSubtitle: {
    fontSize: 16,
    color: '#000000',
  },
  featuresContainer: {
    width: '100%',
    marginVertical: 8,
    flexShrink: 1,
    alignSelf: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        display: 'flex',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    }),
  },
  cardStack: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  cardContent: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      },
    }),
  },
  indicatorSpacing: {
    marginRight: 8,
  },
  indicatorActive: {
    width: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f7fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureEmoji: {
    fontSize: 18,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 18,
  },
  featureDescription: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 15,
  },
  footerSection: {
    width: '100%',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 4,
    alignSelf: 'center',
    ...Platform.select({
      web: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    }),
  },
  primaryButton: {
    backgroundColor: '#667eea',
    paddingVertical: Platform.OS === 'web' ? 10 : 10,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginBottom: 6,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        ':hover': {
          backgroundColor: '#5a67d8',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
        },
      },
    }),
  },
  webPrimaryButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    ':hover': {
      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
    },
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  webPrimaryButtonText: {
    fontSize: 15,
  },
  secondaryButton: {
    paddingVertical: 4,
    paddingHorizontal: 20,
    marginBottom: 4,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  webSecondaryButton: {
    // Web-specific hover styles should be handled via onMouseEnter/onMouseLeave if needed
  },
  secondaryButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  webSecondaryButtonText: {
    fontSize: 16,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  footerText: {
    fontSize: 12,
    color: '#000000',
    textAlign: 'center',
    marginTop: 4,
  },
  webFooterText: {
    fontSize: 13,
    color: '#000000',
  },
});

export default WelcomePage;

