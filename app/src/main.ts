import { GameManager } from "./game/GameManager";


const ROOM_CONFIG = {
    roomName: "👉👉👉 Battle Royal 👈👈👈",
    maxPlayers: 10,
    noPlayer: true,
    public: true,
};


const room = window.HBInit({
	...ROOM_CONFIG,
    token: (window as any).HAXBALL_TOKEN,
});

console.log('created', room);
const gameManager = new GameManager(room);
