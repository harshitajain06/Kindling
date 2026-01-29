import React from 'react';
import ChatScreen from '../../components/ChatScreen';

export default function DigitalFootprintsChat({ route, navigation }) {
  return (
    <ChatScreen
      route={{
        ...route,
        params: {
          channelId: 'digital-footprints',
          channelName: 'Digital Footprints',
          channelDescription: 'Online safety, privacy, and boundaries',
          channelIcon: 'shield-checkmark-outline',
          channelColor: '#AA96DA',
        },
      }}
      navigation={navigation}
    />
  );
}
