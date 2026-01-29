import React from 'react';
import ChatScreen from '../../components/ChatScreen';

export default function GuidanceGroundRulesChat({ route, navigation }) {
  return (
    <ChatScreen
      route={{
        ...route,
        params: {
          channelId: 'guidance-over-ground-rules',
          channelName: 'Guidance Over Ground Rules',
          channelDescription: 'Setting boundaries without pushing teens away',
          channelIcon: 'lock-closed-outline',
          channelColor: '#4ECDC4',
        },
      }}
      navigation={navigation}
    />
  );
}
