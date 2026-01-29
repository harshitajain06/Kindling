import React from 'react';
import ChatScreen from '../../components/ChatScreen';

export default function BurnoutBoardsChat({ route, navigation }) {
  return (
    <ChatScreen
      route={{
        ...route,
        params: {
          channelId: 'burnout-before-boards',
          channelName: 'Burnout Before Boards',
          channelDescription: 'Emotional exhaustion in high-achieving teens',
          channelIcon: 'flame-outline',
          channelColor: '#FF6B35',
        },
      }}
      navigation={navigation}
    />
  );
}
