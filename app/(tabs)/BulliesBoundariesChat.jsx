import React from 'react';
import ChatScreen from '../../components/ChatScreen';

export default function BulliesBoundariesChat({ route, navigation }) {
  return (
    <ChatScreen
      route={{
        ...route,
        params: {
          channelId: 'bullies-banter-boundaries',
          channelName: 'Bullies, Banter & Boundaries',
          channelDescription: 'Understanding social harm and assertiveness',
          channelIcon: 'hand-left-outline',
          channelColor: '#FF6B35',
        },
      }}
      navigation={navigation}
    />
  );
}
