import { PlayerObject } from "../model/GameObject/PlayerObject";
import { TeamID } from "../model/GameObject/TeamID";
import { Room } from "../model/RoomObject/RoomObject";
import { MapManager } from "./MapManager";



export interface GameState {
    playing: boolean;
    players: PlayerObject[];
}


export class GameManager {

    /**
     * Minimum number of players to start
     */
    public static readonly MIN_PLAYERS: number = 2;

    private readonly room: Room;
    private readonly state: GameState;

    constructor(room: Room) {
        this.room = room;

        this.state = {
            playing: false,
            players: [],
        };

        this.bind();
        this.init();
    }

    private bind() {
        this.room.onPlayerJoin = this.onPlayerJoin.bind(this);
        this.room.onPlayerLeave = this.onPlayerLeave.bind(this);
        this.room.onPlayerBallKick = this.onPlayerBallKick.bind(this);
        this.room.onTeamGoal = this.onTeamGoal.bind(this);
    }

    private updateAdmin() { 
        const players = this.room.getPlayerList();
        if (players.length == 0) {
            return;
        }
        if (players.find((player: any) => player.admin)) {
            return;
        }
        this.room.setPlayerAdmin(players[0].id, true);
        this.room.sendChat(`${players[0].id} is now admin`);
    }

    private onPlayerJoin(player: PlayerObject) {
        this.updateAdmin();

        // If game is not playing but enough players to start, start
        if (! this.state.playing && this.room.getPlayerList().length >= GameManager.MIN_PLAYERS) {
            this.start();
        }
    }

    private onPlayerLeave(player: PlayerObject) {
        this.updateAdmin();
    }

    private onPlayerBallKick(player: PlayerObject) {
        console.log(`Nice kick, ${player.id}`);
    }

    private onTeamGoal(teamId: TeamID) {
        console.log(`${teamId} marked a goal`);
    }

    private updateMap() {
        // If not playing, do nothing
        if (! this.state.playing) {
            return;
        }

        const map = MapManager.getMap(this.state.players.length);
        if (map) {
            this.room.setCustomStadium(map);
        }
    }

    private updatePlayerTeams() {
        // Put everyone spectator
        this.room
            .getPlayerList()
            .map(player => this.room.setPlayerTeam(player.id, 0));
        // If playing, put all players in first team
        if (this.state.playing) {
            this.room.getPlayerList()
                .map(player => this.room.setPlayerTeam(player.id, 1));
        }
    }

    private init() {
        this.room.setDefaultStadium("Big");
        this.room.setScoreLimit(100);
        this.room.setTimeLimit(0);
    }

    /**
     * Start a game
     */
    private start() {

        // Init room
        this.room.setTeamsLock(true);

        // Init game state
        this.state.playing = true;
        this.state.players = this.room.getPlayerList();

        // Start the game
        this.updateMap();
        this.updatePlayerTeams();
        this.room.startGame();
    }
}
