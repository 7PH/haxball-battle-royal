import { GameManager } from "./game/GameManager";


const TOKEN = "thr1.AAAAAGDnip40M40o03oqpA.LPL9yAAUo-s";

const ROOM_CONFIG = {
    roomName: "SkyChat",
    maxPlayers: 16,
    noPlayer: true,
    public: true,
};


const room = window.HBInit({
	...ROOM_CONFIG,
    token: TOKEN,
});

console.log('created', room);
const gameManager = new GameManager(room);
