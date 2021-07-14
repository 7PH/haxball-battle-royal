import { GameManager } from "./game/GameManager";


const TOKEN = "thr1.AAAAAGDvacg7x0zPABvaUg.LzGt2N61sRo";

const ROOM_CONFIG = {
    roomName: "👉👉👉 Battle Royal 👈👈👈",
    maxPlayers: 10,
    noPlayer: true,
    public: true,
};


const room = window.HBInit({
	...ROOM_CONFIG,
    token: TOKEN,
});

console.log('created', room);
const gameManager = new GameManager(room);
