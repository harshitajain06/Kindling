import React from 'react';
import ChatScreen from '../../components/ChatScreen';

export default function FriendsFomoChat({ route, navigation }) {
  return (
    <ChatScreen
      route={{
        ...route,
        params: {
          channelId: 'friends-fallouts-fomo',
          channelName: 'Friends, Fallouts & FOMO',
          channelDescription: 'Navigating shifting social circles, Fear of missing out and comparison culture',
          channelIcon: 'people-circle-outline',
          channelColor: '#FF6FB5',
        },
      }}
      navigation={navigation}
    />
  );
}
