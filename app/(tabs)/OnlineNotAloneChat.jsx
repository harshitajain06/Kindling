import React from 'react';
import ChatScreen from '../../components/ChatScreen';

export default function OnlineNotAloneChat({ route, navigation }) {
  return (
    <ChatScreen
      route={{
        ...route,
        params: {
          channelId: 'online-not-alone',
          channelName: 'Online, Not Alone?',
          channelDescription: 'Social media, validation, and teen self-esteem',
          channelIcon: 'share-social-outline',
          channelColor: '#F38181',
        },
      }}
      navigation={navigation}
    />
  );
}
