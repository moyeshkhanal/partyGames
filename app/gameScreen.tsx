import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { mainLogger } from './config/logger';
import { getPlayersByLobbyId } from './config/database';

const gameLogger = mainLogger.extend('Game');

interface Player {
  player_id: string;
  name: string;
  score: number;
}

const GameScreen: React.FC = () => {
  const { data } = useLocalSearchParams();
  const parsedData = JSON.parse(data as string);
  gameLogger.info(
    'Game screen loaded for player:',
    parsedData[0].user,
    'lobby ID:',
    parsedData[0].code,
    'isHost:',
    parsedData[0].isHost
  );
  const lobbyId = parsedData[0].code;
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      gameLogger.info('Getting players for lobby:', lobbyId);
      try {
        const playersList = await getPlayersByLobbyId(lobbyId);
        if (playersList.length > 0) {
          setPlayers(playersList);
          gameLogger.info('Players retrieved:', playersList);
        } else {
          setPlayers([]);
          gameLogger.warn('No players found for lobby:', lobbyId);
        }
      } catch (error) {
        setPlayers([]);
        gameLogger.error('Error getting players for lobby:', lobbyId, error);
      }
    };

    fetchPlayers();
  }, [lobbyId]);

  const renderItem = ({ item }: { item: Player }) => (
    <View style={styles.item}>
      <Text>{item.name}: {item.score}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Screen</Text>
      <Text>Lobby ID: {parsedData[0].code}</Text>
      <Text>Username: {parsedData[0].user}</Text>
      {parsedData[0].isHost && <Text>You are the host</Text>}

      {players.length > 0 ? (
        <View>
          <Text>Players in the lobby:</Text>
          <FlatList
            data={players}
            renderItem={renderItem}
            keyExtractor={(item) => item.player_id}
          />
        </View>
      ) : (
        <Text>No players found.</Text>
      )}
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
  item: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default GameScreen;
