import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
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
  Easing,
} from 'react-native-reanimated';

const AnimatedCard = ({ children, delay = 0, index, cardWidth, isFirst, isLast }) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(30);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      })
    );
    translateX.value = withDelay(
      delay,
      withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      })
    );
  }, [delay, opacity, translateX]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <Animated.View
      style={[
        animatedStyle,
        styles.featureCard,
        { 
          width: cardWidth,
          marginLeft: isFirst ? 0 : 6,
          marginRight: isLast ? 0 : 6,
        },
      ]}
    >
      {children}
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

  // Calculate card width to fit all 5 cards on one screen
  const horizontalPadding = Platform.OS === 'web' ? 40 : 20;
  const gridPadding = Platform.OS === 'web' ? 20 : 10;
  const totalSpacing = 12 * 4; // 4 gaps between 5 cards (6px margin on each side = 12px between cards)
  const availableWidth = width - (horizontalPadding * 2) - (gridPadding * 2);
  const cardWidth = Math.floor((availableWidth - totalSpacing) / 5);
  const cardSpacing = 12;

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

        {/* Features Section - All cards visible */}
        <View style={styles.featuresContainer}>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <AnimatedCard 
                key={index} 
                delay={index * 100} 
                index={index}
                cardWidth={cardWidth}
                isFirst={index === 0}
                isLast={index === features.length - 1}
              >
                <View style={styles.featureIcon}>
                  <Text style={styles.featureEmoji}>{feature.emoji}</Text>
                </View>
                <Text style={styles.featureTitle} numberOfLines={2}>{feature.title}</Text>
                <Text style={styles.featureDescription} numberOfLines={3}>
                  {feature.description}
                </Text>
              </AnimatedCard>
            ))}
          </View>
        </View>

        {/* Footer Section */}
        <View style={styles.footerSection}>
          <TouchableOpacity 
            style={[styles.secondaryButton, isWeb && styles.webSecondaryButton]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.secondaryButtonText, isWeb && styles.webSecondaryButtonText]}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
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
    paddingVertical: Platform.OS === 'web' ? 20 : 30,
    paddingHorizontal: 20,
    maxWidth: Platform.OS === 'web' ? 1200 : '100%',
    gap: Platform.OS === 'web' ? 20 : 15,
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
    marginBottom: 20,
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
    marginBottom: 12,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  subtitle: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 550,
    paddingHorizontal: 10,
  },
  webSubtitle: {
    fontSize: 16,
    color: '#000000',
  },
  featuresContainer: {
    width: '100%',
    marginVertical: 15,
    flexShrink: 1,
    alignSelf: 'center',
    ...Platform.select({
      web: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    }),
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '100%',
    flexWrap: 'nowrap',
    paddingHorizontal: Platform.OS === 'web' ? 20 : 10,
    ...Platform.select({
      web: {
        display: 'flex',
        margin: '0 auto',
      },
    }),
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    ...Platform.select({
      web: {
        transition: 'all 0.3s ease-in-out',
        ':hover': {
          transform: 'translateY(-4px) scale(1.03)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.18)',
        },
      },
    }),
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f7fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureEmoji: {
    fontSize: 20,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 16,
  },
  featureDescription: {
    fontSize: 11,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 15,
  },
  footerSection: {
    width: '100%',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 10,
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
    paddingVertical: Platform.OS === 'web' ? 14 : 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginBottom: 10,
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
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  webPrimaryButtonText: {
    fontSize: 18,
  },
  secondaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
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
    fontSize: 13,
    color: '#000000',
    textAlign: 'center',
    marginTop: 12,
  },
  webFooterText: {
    fontSize: 14,
    color: '#000000',
  },
});

export default WelcomePage;

