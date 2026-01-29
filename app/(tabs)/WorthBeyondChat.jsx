import React from 'react';
import ChatScreen from '../../components/ChatScreen';

export default function WorthBeyondChat({ route, navigation }) {
  return (
    <ChatScreen
      route={{
        ...route,
        params: {
          channelId: 'worth-beyond-comparison',
          channelName: 'Worth Beyond Comparison',
          channelDescription: 'Navigating self-worth in the age of peers, cousins, and influencers',
          channelIcon: 'star-outline',
          channelColor: '#FFD93D',
        },
      }}
      navigation={navigation}
    />
  );
}
