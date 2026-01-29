import React from 'react';
import ChatScreen from '../../components/ChatScreen';

export default function MilesApartChat({ route, navigation }) {
  return (
    <ChatScreen
      route={{
        ...route,
        params: {
          channelId: 'miles-apart-hearts-connected',
          channelName: 'Miles Apart, Hearts Connected',
          channelDescription: 'Parenting when children live away from home, or parents are frequently traveling or away from home',
          channelIcon: 'airplane-outline',
          channelColor: '#FCBAD3',
        },
      }}
      navigation={navigation}
    />
  );
}
