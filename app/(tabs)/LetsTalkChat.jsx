import React from 'react';
import ChatScreen from '../../components/ChatScreen';

export default function LetsTalkChat({ route, navigation }) {
  return (
    <ChatScreen
      route={{
        ...route,
        params: {
          channelId: 'lets-talk-no-panic-mode',
          channelName: "Let's Talk (No Panic Mode)",
          channelDescription: 'How to start conversations about dating',
          channelIcon: 'chatbubbles-outline',
          channelColor: '#95E1D3',
        },
      }}
      navigation={navigation}
    />
  );
}
