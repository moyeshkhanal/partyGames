// database.ts
import { ref, set, get, update, remove } from 'firebase/database';
import { database } from './firebaseConfig';
import { mainLogger } from './logger';
import { generateRandomId } from './util';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Player } from "../models/Player";
import { Lobby } from "../models/Lobby";
import { encodeLobby, decodeLobby, encodePlayer } from '../models/serializers';
import { MAX_NUMBER_OF_PLAYERS } from '@/constants/Variable';
const databaseLogger = mainLogger.extend('Database');

export async function createLobby(lobbyData: Lobby): Promise<string> {
    return new Promise(async (resolve, reject) => {
      databaseLogger.info('Creating game with data:', lobbyData);
  
      let lobbyID = generateRandomId(); // Generate a random lobby ID
  
      // Check if the generated lobby ID already exists
      const lobbyRef = ref(database, 'lobbies/' + lobbyID);
      let snapshot = await get(lobbyRef);
  
      while (snapshot.exists()) {
        databaseLogger.warn('Lobby ID already exists:', lobbyID);
        lobbyID = generateRandomId();
        snapshot = await get(lobbyRef);
      }
  
      lobbyData.lobbyId = lobbyID; // Set the unique lobby ID to the game data
  
      try {
        await set(lobbyRef, lobbyData);
        databaseLogger.info('Game created successfully with Lobby ID:', lobbyID);
        resolve(lobbyData.lobbyId); // Resolve the promise with the lobby ID
      } catch (error: any) {
        databaseLogger.error('Error creating game:', error.message);
        reject(error); // Reject the promise with the error
      }
    });
  }

export async function joinGame(lobbyId: string, username: string, isHost: boolean = false): Promise<void> {
    const gameRef = ref(database, 'lobbies/' + lobbyId);
    databaseLogger.info('Joining game with username:', username, "and lobby ID:", lobbyId);
    try {
        const snapshot = await get(gameRef);

        if (!snapshot.exists()) {
            databaseLogger.error('Game not found. Please check the lobby code. lobbyId:', lobbyId);
            throw new Error('Game not found. Please check the lobby code.');
        }
        databaseLogger.info('Game found. lobbyId:', lobbyId, "decoding lobby data...");
        const lobbyData: Lobby = decodeLobby(snapshot.val());
        databaseLogger.info('Lobby data decoded. lobbyId:', lobbyData.lobbyId);

        if (lobbyData.players.length >= MAX_NUMBER_OF_PLAYERS) {
            databaseLogger.error('Lobby is full. Cannot join the game. lobbyId:', lobbyId);
            throw new Error('Lobby is full. Cannot join the game.');
        }

        // TODO: Uncomment this code to prevent duplicate usernames in the lobby (MAYBE???)
        // if (lobbyData.players.some(player => player.name === username) && !isHost) {
        //     throw new Error('Username already taken in this lobby. Please choose a different name.');
        // }

        const newPlayer: Player = {
            playerId: uuidv4(),
            name: username,
            createdAt: new Date().toISOString(),
            score: 0
        };

        if (isHost) {
            databaseLogger.info('Setting lobby host ID:', newPlayer.playerId);
            lobbyData.lobbyHostID = newPlayer.playerId;
        }

        lobbyData.players.push(newPlayer);

        await update(gameRef, { 
          players: lobbyData.players.map(encodePlayer),
          lobbyHostID: lobbyData.lobbyHostID
        });
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

export async function deleteLobbyById(lobbyId: string): Promise<void> {
    databaseLogger.info('Deleting lobby for lobby ID:', lobbyId);
    const gameRef = ref(database, 'lobbies/' + lobbyId);
    try {
        const snapshot = await get(gameRef);

        if (!snapshot.exists()) {
            throw new Error('Game not found.');
        }

        const lobbyData: Lobby = decodeLobby(snapshot.val());
        await remove(gameRef);
        databaseLogger.info('Lobby deleted successfully for lobby:', lobbyId);
    } catch (error: any) {
        databaseLogger.error('Error deleting lobby:', error.message);
        throw error;
    }finally{
        databaseLogger.info('Lobby deleted successfully for lobby:', lobbyId);
    }
}


export async function getPlayersByLobbyId(lobbyId: string): Promise<Player[] | null> {
    try {
      const lobbyRef = ref(database, `lobbies/${lobbyId}/players`);
      const snapshot = await get(lobbyRef);
  
      if (snapshot.exists()) {
        const playersData = snapshot.val();
        const players: Player[] = Object.values(playersData);
        databaseLogger.info('Players retrieved for lobby ID:', lobbyId, "Players: ", players.length);
        return players;
      } else {
        console.warn(`No players found for lobby ID: ${lobbyId}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching players for lobby ID: ${lobbyId}`, error);
      return null;
    }
  }