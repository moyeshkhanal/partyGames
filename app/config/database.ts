// database.ts
import { ref, set, get, update } from 'firebase/database';
import { database } from './firebaseConfig';
import { mainLogger } from './logger';
import { generateRandomId } from './util';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Player } from "../models/Player";
import { Lobby } from "../models/Lobby";
import { encodeLobby, decodeLobby, encodePlayer } from '../models/serializers';

const databaseLogger = mainLogger.extend('Database');

export async function createGame(username: string): Promise<Lobby> {
  databaseLogger.info('Creating game for username:', username);

  var lobbyId = generateRandomId();
  const lobbyRef = ref(database, 'lobbies/' + lobbyId);

  // Ensure unique lobby ID
  let snapshot = await get(lobbyRef);
  while (snapshot.exists()) {
    databaseLogger.warn('Lobby ID already exists:', lobbyId);
    lobbyId = generateRandomId();
    snapshot = await get(ref(database, 'lobbies/' + lobbyId));
  }

  const playerId = uuidv4();
  const now = new Date();
  
  const newPlayer: Player = {
    playerId,
    name: username,
    createdAt: now.toISOString(),
    score: 0
  };

  const newLobby: Lobby = {
    lobbyId,
    name: `${username}'s Game`,
    createdAt: now,
    lobbyHostID: playerId,
    lobbyImposterID: '', // Will be set when game starts
    imposterMessage: '',
    playerMessage: '',
    players: [newPlayer]
  };

  try {
    await set(lobbyRef, encodeLobby(newLobby));
    databaseLogger.info('Game created successfully with Lobby ID:', lobbyId);
    return newLobby;
  } catch (error: any) {
    databaseLogger.error('Error creating game:', error.message);
    throw new Error('Failed to create game. Please try again.');
  }
}

export async function joinGame(lobbyId: string, username: string): Promise<void> {
  const gameRef = ref(database, 'lobbies/' + lobbyId);

  try {
    const snapshot = await get(gameRef);

    if (!snapshot.exists()) {
      throw new Error('Game not found. Please check the lobby code.');
    }

    const lobbyData: Lobby = decodeLobby(snapshot.val());

    if (lobbyData.players.length >= 4) {
      throw new Error('Lobby is full. Cannot join the game.');
    }

    if (lobbyData.players.some(player => player.name === username)) {
      throw new Error('Username already taken in this lobby. Please choose a different name.');
    }

    const newPlayer: Player = {
    
      playerId: uuidv4(),
      name: username,
      createdAt: new Date().toISOString(),
      score: 0
    };

    lobbyData.players.push(newPlayer);

    await update(gameRef, { players: lobbyData.players.map(encodePlayer) });
    databaseLogger.info('Joined game successfully with username:', username, "and lobby ID:", lobbyId);
  } catch (error: any) {
    databaseLogger.error('Error joining game:', error.message);
    throw error; // Re-throw the error to be handled in the UI
  }
}

export async function startGame(lobbyId: string): Promise<void> {
  const gameRef = ref(database, 'lobbies/' + lobbyId);

  try {
    const snapshot = await get(gameRef);

    if (!snapshot.exists()) {
      throw new Error('Game not found.');
    }

    const lobbyData: Lobby = decodeLobby(snapshot.val());

    if (lobbyData.players.length < 2) {
      throw new Error('Not enough players to start the game.');
    }

    // Randomly select an imposter
    const imposterIndex = Math.floor(Math.random() * lobbyData.players.length);
    lobbyData.lobbyImposterID = lobbyData.players[imposterIndex].playerId;

    // Set messages (you can customize these or make them random)
    lobbyData.imposterMessage = "You are the imposter. Try to blend in!";
    lobbyData.playerMessage = "You are a regular player. Find the imposter!";

    await update(gameRef, encodeLobby(lobbyData));

    databaseLogger.info('Game started successfully for lobby:', lobbyId);
  } catch (error: any) {
    databaseLogger.error('Error starting game:', error.message);
    throw error;
  }
}