import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../config/firebase';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

// Import actual screens from the project
import GeneralScreen from './GeneralScreen';
import Login from './index';
import PersonlizedScreen from './PersonlizedScreen';
import Register from './Register';
import WelcomePage from './WelcomePage';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// General Stack Navigator
const GeneralStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="GeneralScreen" component={GeneralScreen} options={{ title: 'General' }} />
    </Stack.Navigator>
  );
};

// Personalized Stack Navigator
const PersonalizedStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PersonlizedScreen" component={PersonlizedScreen} options={{ title: 'Personalized' }} />
    </Stack.Navigator>
  );
};

// Bottom Tab Navigator Component
const BottomTabs = () => {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'General') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Personalized') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="General" component={GeneralStack} />
      <Tab.Screen name="Personalized" component={PersonalizedStack} />
    </Tab.Navigator>
  );
};

// Drawer Navigator Component
const DrawerNavigator = () => {
  const navigation = useNavigation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    signOut(auth)
      .then(() => {
        navigation.replace('Login'); // Navigate to Login screen
      })
      .catch((err) => {
        console.error('Logout Error:', err);
        Alert.alert('Error', 'Failed to logout. Please try again.');
      });
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <Drawer.Navigator initialRouteName="MainTabs">
        <Drawer.Screen name="MainTabs" component={BottomTabs} options={{ title: 'Home' }} />
        {/* Additional screens can be added here if needed */}

        {/* Logout option */}
        <Drawer.Screen
          name="Logout"
          component={BottomTabs}
          options={{
            title: 'Logout',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="log-out-outline" size={size} color={color} />
            ),
          }}
          listeners={{
            drawerItemPress: (e) => {
              e.preventDefault();
              handleLogout();
            },
          }}
        />
      </Drawer.Navigator>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelLogout}
      >
        <View style={styles.logoutModalOverlay}>
          <View style={styles.logoutModalContainer}>
            <View style={styles.logoutModalHeader}>
              <View style={styles.logoutModalIconContainer}>
                <View style={styles.logoutModalIcon}>
                  <Ionicons name="log-out" size={32} color="#fff" />
                </View>
              </View>
              <Text style={styles.logoutModalTitle}>Confirm Logout</Text>
              <Text style={styles.logoutModalMessage}>
                Are you sure you want to logout? You'll need to sign in again to access your personalized content.
              </Text>
            </View>
            
            <View style={styles.logoutModalActions}>
              <TouchableOpacity 
                style={styles.logoutModalCancelButton}
                onPress={cancelLogout}
              >
                <Ionicons name="close-circle" size={20} color="#6C757D" />
                <Text style={styles.logoutModalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.logoutModalConfirmButton}
                onPress={confirmLogout}
              >
                <Ionicons name="log-out" size={20} color="#fff" />
                <Text style={styles.logoutModalConfirmButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

// Stack Navigator Component
export default function StackLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
      }}
    >
      {/* Welcome Screen */}
      <Stack.Screen name="Welcome" component={WelcomePage} />

      {/* Authentication Screens */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />

      {/* Main App with Drawer */}
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
    </Stack.Navigator>
  );
}

// Logout Modal Styles
const styles = StyleSheet.create({
  logoutModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoutModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  logoutModalHeader: {
    padding: 32,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  logoutModalIconContainer: {
    marginBottom: 20,
  },
  logoutModalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E74C3C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E74C3C',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  logoutModalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1C2541',
    marginBottom: 12,
    textAlign: 'center',
  },
  logoutModalMessage: {
    fontSize: 16,
    color: '#6C757D',
    lineHeight: 24,
    textAlign: 'center',
  },
  logoutModalActions: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
  logoutModalCancelButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  logoutModalCancelButtonText: {
    color: '#6C757D',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutModalConfirmButton: {
    flex: 1,
    backgroundColor: '#E74C3C',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#E74C3C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutModalConfirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
