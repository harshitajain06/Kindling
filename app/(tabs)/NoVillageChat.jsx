import React from 'react';
import ChatScreen from '../../components/ChatScreen';

export default function NoVillageChat({ route, navigation }) {
  return (
    <ChatScreen
      route={{
        ...route,
        params: {
          channelId: 'raising-kids-without-village',
          channelName: 'Raising Kids Without a Village',
          channelDescription: 'Parenting without extended family support',
          channelIcon: 'people-outline',
          channelColor: '#C7CEEA',
        },
      }}
      navigation={navigation}
    />
  );
}
