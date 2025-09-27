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
    >
      <View style={[styles.content, isTablet && styles.tabletContent]}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/images/Logo.png')} style={styles.logo} />
          </View>
          
          <Text style={[styles.title, isWeb && styles.webTitle]}>
            Welcome to Kindling
          </Text>
          
          <Text style={[styles.subtitle, isWeb && styles.webSubtitle]}>
            Your personalized parenting companion. Discover your unique parenting style, 
            get expert insights, and connect with a community of parents on the same journey.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>🎯</Text>
            </View>
            <Text style={styles.featureTitle}>Personalized Assessment</Text>
            <Text style={styles.featureDescription}>
              Take our comprehensive parenting style assessment to discover your unique approach.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>📚</Text>
            </View>
            <Text style={styles.featureTitle}>Expert Insights</Text>
            <Text style={styles.featureDescription}>
              Access evidence-based parenting strategies tailored to your family's needs.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>👥</Text>
            </View>
            <Text style={styles.featureTitle}>Community Support</Text>
            <Text style={styles.featureDescription}>
              Connect with other parents and share experiences in a supportive environment.
            </Text>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <TouchableOpacity 
            style={[styles.primaryButton, isWeb && styles.webPrimaryButton]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={[styles.primaryButtonText, isWeb && styles.webPrimaryButtonText]}>
              Get Started
            </Text>
          </TouchableOpacity>

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
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  webScrollContent: {
    minHeight: '100vh',
    paddingVertical: 60,
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
    marginBottom: 60,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 50,
  },
  webTitle: {
    fontSize: 48,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: 18,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 600,
  },
  webSubtitle: {
    fontSize: 20,
    color: '#2d3748',
  },
  featuresSection: {
    width: '100%',
    marginBottom: 60,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
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
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f7fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureEmoji: {
    fontSize: 28,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
  },
  ctaSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#667eea',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 20,
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
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  webPrimaryButtonText: {
    fontSize: 20,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
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
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  webSecondaryButtonText: {
    fontSize: 18,
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

