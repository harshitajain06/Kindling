import React from 'react';
import ChatScreen from '../../components/ChatScreen';

export default function CareerMazeChat({ route, navigation }) {
  return (
    <ChatScreen
      route={{
        ...route,
        params: {
          channelId: 'career-maze',
          channelName: 'Career Maze',
          channelDescription: 'Stream selection, career confusion, and "what next?" conversations',
          channelIcon: 'map-outline',
          channelColor: '#4ECDC4',
        },
      }}
      navigation={navigation}
    />
  );
}
