import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';

interface GameScreenProps {
  route: RouteProp<{ params: { code: string; user: string } }, 'params'>;
}

const GameScreen: React.FC<GameScreenProps> = ({ route }) => {
  const { code, user } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Screen</Text>
      <Text>Lobby ID: {code}</Text>
      <Text>Username: {user}</Text>
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
