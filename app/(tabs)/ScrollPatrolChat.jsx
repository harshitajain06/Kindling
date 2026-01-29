import React from 'react';
import ChatScreen from '../../components/ChatScreen';

export default function ScrollPatrolChat({ route, navigation }) {
  return (
    <ChatScreen
      route={{
        ...route,
        params: {
          channelId: 'scroll-patrol',
          channelName: 'Scroll Patrol',
          channelDescription: 'Screen time, phone addiction, and daily tech conflicts',
          channelIcon: 'phone-portrait-outline',
          channelColor: '#95E1D3',
        },
      }}
      navigation={navigation}
    />
  );
}
