// GameScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';

type GameScreenRouteProp = RouteProp<{
  GameScreen: { lobbyId: string; username: string };
}, 'GameScreen'>;

type Props = {
  route: GameScreenRouteProp;
};

const GameScreen: React.FC<Props> = ({ route }) => {
  const { lobbyId, username } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Screen</Text>
      <Text>Lobby ID: {lobbyId}</Text>
      <Text>Username: {username}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
});

export default GameScreen;