import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { createGame, joinGame, startGame } from './config/database';
import { mainLogger } from './config/logger';
import { Lobby } from './models/Lobby';

const detailLogger = mainLogger.extend('Detail');

const DetailScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [lobbyCode, setLobbyCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLobby, setCurrentLobby] = useState<Lobby | null>(null);

  detailLogger.info('Detail screen loaded');

  const handleCreateGame = useCallback(async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    setIsLoading(true);
    try {
      const newLobby = await createGame(username);
      setCurrentLobby(newLobby);
      setLobbyCode(newLobby.lobbyId);
      Alert.alert('Success', `Game created successfully. Lobby code: ${newLobby.lobbyId}`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create game');
      detailLogger.error('Error creating game:', error);
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  const handleJoinGame = useCallback(async () => {
    if (!username.trim() || !lobbyCode.trim()) {
      Alert.alert('Error', 'Please enter both username and lobby code');
      return;
    }

    setIsLoading(true);
    try {
      await joinGame(lobbyCode, username);
      Alert.alert('Success', 'Joined game successfully');
      // You might want to fetch the updated lobby data here and set it to currentLobby
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to join game');
      detailLogger.error('Error joining game:', error);
    } finally {
      setIsLoading(false);
    }
  }, [username, lobbyCode]);

  const handleStartGame = useCallback(async () => {
    if (!currentLobby) {
      Alert.alert('Error', 'No active lobby');
      return;
    }

    setIsLoading(true);
    try {
      await startGame(currentLobby.lobbyId);
      Alert.alert('Success', 'Game started successfully');
      // You might want to navigate to a game screen or update the UI here
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start game');
      detailLogger.error('Error starting game:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentLobby]);

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
      {currentLobby && (
        <TouchableOpacity style={styles.button} onPress={handleStartGame} disabled={isLoading}>
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
      )}
      {isLoading && <ActivityIndicator size="large" color="#007bff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5', // Light background color for better visibility
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Darker color for the title
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
    color: 'black', // Darker color for the input text
  },
  button: {
    backgroundColor: '#007bff', // Primary color for the button
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    width: '80%', // Make buttons wider
  },
  buttonText: {
    fontSize: 18,
    color: '#fff', // White color for the button text
    fontWeight: 'bold',
  },
});

export default DetailScreen;
