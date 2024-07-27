import { Player } from "./Player";

interface Lobby {
    lobbyId: string;
    name: string;
    createdAt: Date;
    lobbyHostID: string;
    lobbyImposterID: string;
    imposterMessage: string;
    playerMessage: string;
    players: Player[];
  }
  
  export {Lobby};