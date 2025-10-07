import { useNavigation } from '@react-navigation/native';
import React from 'react';
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

const WelcomePage = () => {
  const navigation = useNavigation();
  
  const { width } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  const isTablet = width > 768;

  return (
    <ScrollView 
      style={[styles.container, isWeb && styles.webContainer]} 
      contentContainerStyle={[styles.scrollContent, isWeb && styles.webScrollContent]}
      showsVerticalScrollIndicator={true}
      bounces={false}
    >
      <View style={[styles.content, isTablet && styles.tabletContent]}>
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
              Get Started
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.title, isWeb && styles.webTitle]}>
            Welcome to Kindling
          </Text>
          
          <Text style={[styles.subtitle, isWeb && styles.webSubtitle]}>
            Your personalized parenting companion. Discover your unique parenting style, 
            get expert insights, and connect with a community of parents on the same journey.
          </Text>
        </View>

        {/* Features Section */}
        <View style={[styles.featuresSection, isWeb && styles.webFeaturesSection]}>
          <View style={[styles.featureCard, isWeb && styles.webFeatureCard]}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>🎯</Text>
            </View>
            <Text style={styles.featureTitle}>Personalized Assessment</Text>
            <Text style={styles.featureDescription}>
              Take our comprehensive parenting style assessment to discover your unique approach.
            </Text>
          </View>

          <View style={[styles.featureCard, isWeb && styles.webFeatureCard]}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>📚</Text>
            </View>
            <Text style={styles.featureTitle}>Expert Insights</Text>
            <Text style={styles.featureDescription}>
              Access evidence-based parenting strategies tailored to your family's needs.
            </Text>
          </View>

          <View style={[styles.featureCard, isWeb && styles.webFeatureCard]}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>👥</Text>
            </View>
            <Text style={styles.featureTitle}>Community Support</Text>
            <Text style={styles.featureDescription}>
              Connect with other parents and share experiences in a supportive environment.
            </Text>
          </View>

          <View style={[styles.featureCard, isWeb && styles.webFeatureCard]}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>📊</Text>
            </View>
            <Text style={styles.featureTitle}>Progress Tracking</Text>
            <Text style={styles.featureDescription}>
              Monitor your parenting journey with detailed insights and progress reports.
            </Text>
          </View>

          <View style={[styles.featureCard, isWeb && styles.webFeatureCard]}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>🎨</Text>
            </View>
            <Text style={styles.featureTitle}>Personalized Content</Text>
            <Text style={styles.featureDescription}>
              Get customized recommendations and content based on your family's unique needs.
            </Text>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <TouchableOpacity 
            style={[styles.secondaryButton, isWeb && styles.webSecondaryButton]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.secondaryButtonText, isWeb && styles.webSecondaryButtonText]}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, isWeb && styles.webFooterText]}>
            Start your parenting journey today
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  webContainer: {
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    overflow: 'auto',
    ...Platform.select({
      web: {
        '::-webkit-scrollbar': {
          width: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
        },
        '::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '4px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(255, 255, 255, 0.5)',
        },
      },
    }),
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  webScrollContent: {
    paddingVertical: 20,
    minHeight: '100vh',
    justifyContent: 'center',
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    width: '100%',
    maxWidth: 800,
    alignItems: 'center',
  },
  tabletContent: {
    maxWidth: 1000,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 38,
  },
  webTitle: {
    fontSize: 36,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 600,
  },
  webSubtitle: {
    fontSize: 18,
    color: '#2d3748',
  },
  featuresSection: {
    width: '100%',
    marginBottom: 30,
  },
  webFeaturesSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    ...Platform.select({
      web: {
        transition: 'all 0.2s ease-in-out',
        ':hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        },
      },
    }),
  },
  webFeatureCard: {
    marginBottom: 0,
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
    fontSize: 16,
    fontWeight: '700',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 20,
  },
  ctaSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
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
        transition: 'all 0.2s ease-in-out',
        ':hover': {
          transform: 'translateY(-1px)',
        },
      },
    }),
  },
  webSecondaryButton: {
    ':hover': {
      textDecoration: 'underline',
    },
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
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#a0aec0',
    textAlign: 'center',
  },
  webFooterText: {
    fontSize: 16,
    color: '#718096',
  },
});

export default WelcomePage;

