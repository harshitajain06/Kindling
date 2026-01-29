import React from 'react';
import ChatScreen from '../../components/ChatScreen';

export default function BackInOurDayChat({ route, navigation }) {
  return (
    <ChatScreen
      route={{
        ...route,
        params: {
          channelId: 'back-in-our-day',
          channelName: 'Back in Our Day…',
          channelDescription: 'Generational disconnects and evolving norms, plus the social pressure shaping parenting choices',
          channelIcon: 'time-outline',
          channelColor: '#FFD93D',
        },
      }}
      navigation={navigation}
    />
  );
}
