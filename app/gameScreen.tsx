import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { mainLogger } from './config/logger';
import { getPlayersByLobbyId } from './config/database';
import { Player } from './models/Player';

const gameLogger = mainLogger.extend('Game');

const GameScreen: React.FC = () => {
  const { data } = useLocalSearchParams();
  const parsedData = JSON.parse(data as string);
  const lobbyId = parsedData[0].code;
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      gameLogger.info('Getting players for lobby:', lobbyId);
      try {
        const playersList = await getPlayersByLobbyId(lobbyId);
        if (playersList !== null) {
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
      <Text style={styles.playerName}>{item.name} {parsedData[0].isHost && <Text style={styles.hostBadge}>Host</Text>}</Text>
      <Text style={styles.playerScore}>{item.score}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Game Room</Text>
        <Text style={styles.subtitle}>Lobby ID: {parsedData[0].code}</Text>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.username}>{parsedData[0].user}</Text>
        {parsedData[0].isHost && <Text style={styles.hostBadge}>Host</Text>}
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Players</Text>
        {players.length > 0 ? (
          <FlatList
            data={players}
            renderItem={renderItem}
            keyExtractor={(item) => item.playerId}
            contentContainerStyle={styles.list}
          />
        ) : (
          <Text style={styles.noPlayersText}>No players found.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#4a90e2',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  hostBadge: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#4caf50',
    color: '#ffffff',
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    padding: 20,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  list: {
    flexGrow: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  playerScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a90e2',
  },
  noPlayersText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default GameScreen;