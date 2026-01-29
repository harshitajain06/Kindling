import React from 'react';
import ChatScreen from '../../components/ChatScreen';

export default function TwoHomesChat({ route, navigation }) {
  return (
    <ChatScreen
      route={{
        ...route,
        params: {
          channelId: 'two-homes-one-teen',
          channelName: 'Two Homes, One Teen',
          channelDescription: 'Co-parenting and dual-household dynamics',
          channelIcon: 'home-outline',
          channelColor: '#A8D8EA',
        },
      }}
      navigation={navigation}
    />
  );
}
