import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { auth } from '../../config/firebase';

const Login = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { width } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  const isTablet = width > 768;

  useEffect(() => {
    if (user) {
      navigation.replace('Drawer');
    }
  }, [user]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fix the errors below',
        position: 'top',
      });
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: 'You have successfully logged in',
        position: 'top',
        visibilityTime: 3000,
      });

      // Navigate to the home screen or dashboard
      navigation.navigate('Drawer');
    } catch (error) {
      let errorMessage;
      let fieldError = null;
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'The email address is not valid.';
          fieldError = 'email';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This user account has been disabled.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'There is no user record corresponding to this email.';
          fieldError = 'email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'The password is incorrect.';
          fieldError = 'password';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = 'An unknown error occurred. Please try again later.';
      }

      // Set field-specific error
      if (fieldError) {
        setErrors(prev => ({ ...prev, [fieldError]: errorMessage }));
      }

      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, isWeb && styles.webContainer]} 
      contentContainerStyle={[styles.scrollContent, isWeb && styles.webScrollContent]}
    >
      <View style={[styles.formContainer, isTablet && styles.tabletFormContainer]}>
      {/* Logo */}
        <View style={styles.logoContainer}>
      <Image source={require('../../assets/images/Logo.png')} style={styles.logo} />
        </View>

      {/* Title */}
        <Text style={[styles.title, isWeb && styles.webTitle]}>Welcome Back</Text>
        <Text style={[styles.subtitle, isWeb && styles.webSubtitle]}>Sign in to your account</Text>

      {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Address</Text>
      <TextInput
        style={[
          styles.input,
              errors.email && styles.inputError,
              isFocused === 'email' && styles.inputFocused,
              isWeb && styles.webInput
        ]}
            placeholder="Enter your email"
            placeholderTextColor="#999"
        value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) {
                setErrors(prev => ({ ...prev, email: null }));
              }
            }}
        onFocus={() => setIsFocused('email')}
        onBlur={() => setIsFocused(null)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
      />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

      {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordContainer}>
      <TextInput
        style={[
          styles.input,
                styles.passwordInput,
                errors.password && styles.inputError,
                isFocused === 'password' && styles.inputFocused,
                isWeb && styles.webInput
              ]}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
        value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors(prev => ({ ...prev, password: null }));
                }
              }}
        onFocus={() => setIsFocused('password')}
        onBlur={() => setIsFocused(null)}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIconText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

      {/* Login Button */}
      <View style={styles.buttonContainer}>
          <TouchableOpacity 
            onPress={handleLogin} 
            style={[
              styles.button, 
              isLoading && styles.buttonDisabled,
              isWeb && styles.webButton
            ]}
            disabled={isLoading}
          >
            <Text style={[styles.buttonText, isLoading && styles.buttonTextDisabled]}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
        </TouchableOpacity>

        {/* Register Link */}
        <View style={styles.registerContainer}>
            <Text style={[styles.registerText, isWeb && styles.webRegisterText]}>
              Don't have an account?{' '}
            </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.registerLink, isWeb && styles.webRegisterLink]}>
                Create Account
              </Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>
      <Toast />
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
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  tabletFormContainer: {
    maxWidth: 500,
    padding: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 8,
  },
  webTitle: {
    fontSize: 36,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 30,
  },
  webSubtitle: {
    fontSize: 18,
    color: '#4a5568',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    color: '#1a202c',
    borderRadius: 12,
    fontSize: 16,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        transition: 'all 0.2s ease-in-out',
      },
    }),
  },
  webInput: {
    borderColor: '#cbd5e0',
    ':focus': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    },
  },
  inputFocused: {
    borderColor: '#667eea',
    ...Platform.select({
      web: {
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
      },
    }),
  },
  inputError: {
    borderColor: '#e53e3e',
    ...Platform.select({
      web: {
        boxShadow: '0 0 0 3px rgba(229, 62, 62, 0.1)',
      },
    }),
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  eyeIconText: {
    fontSize: 20,
  },
  errorText: {
    color: '#e53e3e',
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        ':hover': {
          backgroundColor: '#5a67d8',
          transform: 'translateY(-1px)',
          boxShadow: '0 6px 12px rgba(102, 126, 234, 0.4)',
        },
      },
    }),
  },
  webButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    ':hover': {
      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
    },
  },
  buttonDisabled: {
    backgroundColor: '#a0aec0',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#e2e8f0',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: '#718096',
    fontSize: 14,
  },
  webRegisterText: {
    fontSize: 15,
  },
  registerLink: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        textDecoration: 'none',
        ':hover': {
          textDecoration: 'underline',
        },
      },
    }),
  },
  webRegisterLink: {
    fontSize: 15,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
});

export default Login;
