import React from 'react';
import ChatScreen from '../../components/ChatScreen';

export default function MoodSwingChat({ route, navigation }) {
  return (
    <ChatScreen
      route={{
        ...route,
        params: {
          channelId: 'mood-swing-central',
          channelName: 'Mood Swing Central',
          channelDescription: 'Understanding teen emotional volatility, silence, and outbursts',
          channelIcon: 'heart-outline',
          channelColor: '#FF6FB5',
        },
      }}
      navigation={navigation}
    />
  );
}
