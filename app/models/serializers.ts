import { Player } from "./Player";
import { Lobby } from "./Lobby";

export function encodePlayer(player: Player): any {
  return {
    ...player,
    // No need to convert createdAt as it's already a string
  };
}

export function decodePlayer(data: any): Player {
  return {
    ...data,
    // No need to convert createdAt as it should remain a string
  };
}

export function encodeLobby(lobby: Lobby): any {
  return {
    ...lobby,
    createdAt: lobby.createdAt.toISOString(),
    players: lobby.players.map(encodePlayer),
  };
}

export function decodeLobby(data: any): Lobby {
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    players: data.players.map(decodePlayer),
  };
}