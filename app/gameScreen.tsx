import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { mainLogger } from './config/logger';
import { getPlayersByLobbyId } from './config/database';
import { Player } from './models/Player';

const gameLogger = mainLogger.extend('Game');

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
      <View style={styles.topContainer}>
        <Text style={styles.title}>Game Screen</Text>
        <Text>Lobby ID: {parsedData[0].code}</Text>
        <Text>Username: {parsedData[0].user}</Text>
        {parsedData[0].isHost && <Text>You are the host</Text>}
      </View>

      {players.length > 0 ? (
        <View style={styles.listContainer}>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingTop: 40, // Add some padding to the top
  },
  topContainer: {
    alignItems: 'center',
    marginBottom: 20, // Add some margin to separate from the list
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    width: '80%',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: 'black',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default GameScreen;
