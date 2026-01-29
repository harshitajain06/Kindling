import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  ScrollView,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

const CHANNELS = [
  {
    id: 'mood-swing',
    name: 'Mood Swing Central',
    description: 'Understanding teen emotional volatility, silence, and outbursts',
    icon: 'heart-outline',
    color: '#FF6FB5',
    screenName: 'MoodSwingChat',
  },
  {
    id: 'worth-beyond',
    name: 'Worth Beyond Comparison',
    description: 'Navigating self-worth in the age of peers, cousins, and influencers',
    icon: 'star-outline',
    color: '#FFD93D',
    screenName: 'WorthBeyondChat',
  },
  {
    id: 'burnout-boards',
    name: 'Burnout Before Boards',
    description: 'Emotional exhaustion in high-achieving teens',
    icon: 'flame-outline',
    color: '#FF6B35',
    screenName: 'BurnoutBoardsChat',
  },
  {
    id: 'career-maze',
    name: 'Career Maze',
    description: 'Stream selection, career confusion, and "what next?" conversations',
    icon: 'map-outline',
    color: '#4ECDC4',
    screenName: 'CareerMazeChat',
  },
  {
    id: 'scroll-patrol',
    name: 'Scroll Patrol',
    description: 'Screen time, phone addiction, and daily tech conflicts',
    icon: 'phone-portrait-outline',
    color: '#95E1D3',
    screenName: 'ScrollPatrolChat',
  },
  {
    id: 'online-not-alone',
    name: 'Online, Not Alone?',
    description: 'Social media, validation, and teen self-esteem',
    icon: 'share-social-outline',
    color: '#F38181',
    screenName: 'OnlineNotAloneChat',
  },
  {
    id: 'digital-footprints',
    name: 'Digital Footprints',
    description: 'Online safety, privacy, and boundaries',
    icon: 'shield-checkmark-outline',
    color: '#AA96DA',
    screenName: 'DigitalFootprintsChat',
  },
  {
    id: 'miles-apart',
    name: 'Miles Apart, Hearts Connected',
    description: 'Parenting when children live away from home, or parents are frequently traveling or away from home',
    icon: 'airplane-outline',
    color: '#FCBAD3',
    screenName: 'MilesApartChat',
  },
  {
    id: 'two-homes',
    name: 'Two Homes, One Teen',
    description: 'Co-parenting and dual-household dynamics',
    icon: 'home-outline',
    color: '#A8D8EA',
    screenName: 'TwoHomesChat',
  },
  {
    id: 'back-in-our-day',
    name: 'Back in Our Day…',
    description: 'Generational disconnects and evolving norms, plus the social pressure shaping parenting choices',
    icon: 'time-outline',
    color: '#FFD93D',
    screenName: 'BackInOurDayChat',
  },
  {
    id: 'no-village',
    name: 'Raising Kids Without a Village',
    description: 'Parenting without extended family support',
    icon: 'people-outline',
    color: '#C7CEEA',
    screenName: 'NoVillageChat',
  },
  {
    id: 'friends-fomo',
    name: 'Friends, Fallouts & FOMO',
    description: 'Navigating shifting social circles, Fear of missing out and comparison culture',
    icon: 'people-circle-outline',
    color: '#FF6FB5',
    screenName: 'FriendsFomoChat',
  },
  {
    id: 'bullies-boundaries',
    name: 'Bullies, Banter & Boundaries',
    description: 'Understanding social harm and assertiveness',
    icon: 'hand-left-outline',
    color: '#FF6B35',
    screenName: 'BulliesBoundariesChat',
  },
  {
    id: 'lets-talk',
    name: "Let's Talk (No Panic Mode)",
    description: 'How to start conversations about dating',
    icon: 'chatbubbles-outline',
    color: '#95E1D3',
    screenName: 'LetsTalkChat',
  },
  {
    id: 'guidance-ground-rules',
    name: 'Guidance Over Ground Rules',
    description: 'Setting boundaries without pushing teens away',
    icon: 'lock-closed-outline',
    color: '#4ECDC4',
    screenName: 'GuidanceGroundRulesChat',
  },
];

export default function FloatingChatIcon() {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const colorScheme = useColorScheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleChatPress = () => {
    setIsModalVisible(true);
    // Pulse animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    setIsModalVisible(false);
    
    // Navigate to the appropriate chat screen
    // Try to navigate using parent navigator if available
    if (channel.screenName) {
      const parent = navigation.getParent();
      if (parent) {
        parent.navigate(channel.screenName);
      } else {
        navigation.navigate(channel.screenName);
      }
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedChannel(null);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <TouchableOpacity
        style={[
          styles.floatingButton,
          { backgroundColor: Colors[colorScheme ?? 'light'].tint },
        ]}
        onPress={handleChatPress}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Ionicons name="chatbubbles" size={28} color="#fff" />
        </Animated.View>
      </TouchableOpacity>

      {/* Channel Selection Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              {
                backgroundColor: Colors[colorScheme ?? 'light'].background,
              },
            ]}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  { color: Colors[colorScheme ?? 'light'].text },
                ]}
              >
                Choose a Channel
              </Text>
              <Text
                style={[
                  styles.modalSubtitle,
                  { color: Colors[colorScheme ?? 'light'].icon },
                ]}
              >
                Select a channel to start communicating
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModal}
              >
                <Ionicons
                  name="close-circle"
                  size={28}
                  color={Colors[colorScheme ?? 'light'].icon}
                />
              </TouchableOpacity>
            </View>

            {/* Channel List */}
            <ScrollView 
              style={styles.channelList}
              contentContainerStyle={styles.channelListContent}
              showsVerticalScrollIndicator={true}
            >
              {CHANNELS.map((channel) => (
                <TouchableOpacity
                  key={channel.id}
                  style={[
                    styles.channelCard,
                    {
                      backgroundColor:
                        colorScheme === 'dark' ? '#1E1E1E' : '#F8F9FA',
                      borderColor:
                        colorScheme === 'dark' ? '#333' : '#E9ECEF',
                    },
                  ]}
                  onPress={() => handleChannelSelect(channel)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.channelIconContainer,
                      { backgroundColor: `${channel.color}20` },
                    ]}
                  >
                    <Ionicons
                      name={channel.icon}
                      size={32}
                      color={channel.color}
                    />
                  </View>
                  <View style={styles.channelContent}>
                    <Text
                      style={[
                        styles.channelName,
                        { color: Colors[colorScheme ?? 'light'].text },
                      ]}
                    >
                      {channel.name}
                    </Text>
                    <Text
                      style={[
                        styles.channelDescription,
                        { color: Colors[colorScheme ?? 'light'].icon },
                      ]}
                    >
                      {channel.description}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={Colors[colorScheme ?? 'light'].icon}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 90, // Positioned above the tab bar
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
    flexDirection: 'column',
  },
  modalHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    position: 'relative',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 24,
    padding: 4,
  },
  channelList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  channelListContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  channelIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  channelContent: {
    flex: 1,
  },
  channelName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  channelDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
