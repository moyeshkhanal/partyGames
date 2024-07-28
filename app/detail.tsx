import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { createGame, joinGame, deleteLobbyById } from './config/database';
import { mainLogger } from './config/logger';
import { Lobby } from './models/Lobby';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const detailLogger = mainLogger.extend('Detail');

const DetailScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [lobbyCode, setLobbyCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLobby, setCurrentLobby] = useState<Lobby | null>(null);

  detailLogger.info('Detail screen loaded');

  const navigation = useNavigation();
  const router = useRouter();

  const handleCreateGame = useCallback(async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    setIsLoading(true);
    try {
      const newLobby: Lobby = { name: username, lobbyId: '', players: [], createdAt: new Date().toISOString(), lobbyHostID: '' };
      const lobbyId = await createGame(newLobby);
      setCurrentLobby(newLobby);
      setLobbyCode(lobbyId);
      detailLogger.info('Game created with lobby ID:', lobbyId);
      Alert.alert('Game Lobby Created', `Lobby Code: ${lobbyId}`, [
        {
          text: 'Join Game',
          onPress: async () => {
            await joinGame(lobbyId, username, true);
            const data = [{ code: lobbyId, user: username, isHost: true }];
            router.push({
              pathname: '/gameScreen',
              params: { data: JSON.stringify(data) },
            });
          },
        },
        {
          text: 'Delete Lobby',
          onPress: () => deleteLobbyById(lobbyId),
          style: 'cancel',
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create game');
      detailLogger.error('Error creating game:', error);
    } finally {
      setIsLoading(false);
    }
  }, [username, lobbyCode, router]);

  const handleJoinGame = useCallback(async () => {
    if (!username.trim() || !lobbyCode.trim()) {
      Alert.alert('Error', 'Please enter both username and lobby code');
      return;
    }

    setIsLoading(true);
    try {
      await joinGame(lobbyCode, username);
      const data = [{ code: lobbyCode, user: username, isHost: false }];
      router.push({
        pathname: '/gameScreen',
        params: { data: JSON.stringify(data) },
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to join game');
      detailLogger.error('Error joining game:', error);
    } finally {
      setIsLoading(false);
    }
  }, [username, lobbyCode, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Lobby</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Lobby Code (for joining)"
        value={lobbyCode}
        onChangeText={setLobbyCode}
        editable={!isLoading}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateGame} disabled={isLoading}>
        <Text style={styles.buttonText}>Create Game</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleJoinGame} disabled={isLoading}>
        <Text style={styles.buttonText}>Join Game</Text>
      </TouchableOpacity>
     
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

export default DetailScreen;
