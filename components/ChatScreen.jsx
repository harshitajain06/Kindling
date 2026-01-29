import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { db, auth } from '../config/firebase';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function ChatScreen({ route, navigation }) {
  const { channelId, channelName, channelDescription, channelIcon, channelColor } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Set up navigation header
    navigation.setOptions({
      headerShown: true,
      headerTitle: channelName,
      headerStyle: {
        backgroundColor: Colors[colorScheme ?? 'light'].background,
      },
      headerTintColor: Colors[colorScheme ?? 'light'].text,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16 }}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={Colors[colorScheme ?? 'light'].text}
          />
        </TouchableOpacity>
      ),
    });

    // Subscribe to messages
    const messagesRef = collection(db, 'channels', channelId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
        setLoading(false);
        
        // Scroll to bottom when new messages arrive
        setTimeout(() => {
          if (flatListRef.current && messagesData.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }, 100);
      },
      (error) => {
        console.error('Error fetching messages:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [channelId, navigation, colorScheme]);

  const sendMessage = async () => {
    if (!messageText.trim() || !auth.currentUser) return;

    try {
      const messagesRef = collection(db, 'channels', channelId, 'messages');
      await addDoc(messagesRef, {
        text: messageText.trim(),
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Anonymous',
        userEmail: auth.currentUser.email || '',
        timestamp: serverTimestamp(),
      });
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.userId === auth.currentUser?.uid;
    
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        {!isCurrentUser && (
          <View style={styles.messageHeader}>
            <Text style={[styles.userName, { color: Colors[colorScheme ?? 'light'].text }]}>
              {item.userName}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isCurrentUser
                ? channelColor || Colors[colorScheme ?? 'light'].tint
                : colorScheme === 'dark'
                ? '#2A2A2A'
                : '#E9ECEF',
            },
          ]}
        >
          <Text
            style={[
              styles.messageText,
              {
                color: isCurrentUser
                  ? '#fff'
                  : Colors[colorScheme ?? 'light'].text,
              },
            ]}
          >
            {item.text}
          </Text>
        </View>
        {item.timestamp && (
          <Text
            style={[
              styles.timestamp,
              { color: Colors[colorScheme ?? 'light'].icon },
            ]}
          >
            {item.timestamp?.toDate
              ? new Date(item.timestamp.toDate()).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : item.timestamp?.seconds
              ? new Date(item.timestamp.seconds * 1000).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Just now'}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? 'light'].background },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Channel Info Banner */}
        <View
          style={[
            styles.channelBanner,
            {
              backgroundColor: `${channelColor}20`,
              borderBottomColor: channelColor || Colors[colorScheme ?? 'light'].tint,
            },
          ]}
        >
          <Ionicons
            name={channelIcon || 'chatbubbles'}
            size={24}
            color={channelColor || Colors[colorScheme ?? 'light'].tint}
          />
          <Text
            style={[
              styles.channelDescription,
              { color: Colors[colorScheme ?? 'light'].text },
            ]}
          >
            {channelDescription}
          </Text>
        </View>

        {/* Messages List */}
        {loading && messages.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={{ color: Colors[colorScheme ?? 'light'].icon }}>
              Loading messages...
            </Text>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="chatbubbles-outline"
              size={64}
              color={Colors[colorScheme ?? 'light'].icon}
            />
            <Text
              style={[
                styles.emptyText,
                { color: Colors[colorScheme ?? 'light'].icon },
              ]}
            >
              No messages yet. Start the conversation!
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => {
              if (flatListRef.current) {
                flatListRef.current.scrollToEnd({ animated: false });
              }
            }}
          />
        )}

        {/* Input Area */}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              borderTopColor: colorScheme === 'dark' ? '#333' : '#E9ECEF',
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F8F9FA',
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: colorScheme === 'dark' ? '#333' : '#E9ECEF',
              },
            ]}
            placeholder="Type a message..."
            placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor:
                  messageText.trim()
                    ? channelColor || Colors[colorScheme ?? 'light'].tint
                    : Colors[colorScheme ?? 'light'].icon,
              },
            ]}
            onPress={sendMessage}
            disabled={!messageText.trim()}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  channelBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 2,
    gap: 12,
  },
  channelDescription: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageHeader: {
    marginBottom: 4,
  },
  userName: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    marginHorizontal: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});
