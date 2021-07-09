import { PlayerObject } from "../model/GameObject/PlayerObject";
import { TeamID } from "../model/GameObject/TeamID";
import { Room } from "../model/RoomObject/RoomObject";
import { Stadium, StadiumManager } from "./StadiumManager";



export interface GameState {

    playing: boolean;

    players: {
        gameObject: PlayerObject,
        lives: number,
        position: [number, number],
    }[];

    lastLoser: PlayerObject | null;

    stadium: Stadium | null;
}


export class GameManager {

    /**
     * Minimum number of players to start
     */
    public static readonly MIN_PLAYERS: number = 2;
    public static readonly DEFAULT_LIVES: number = 1;
    public static readonly PLAYER_JOIN_START_DELAY: number = 10 * 1000;

    private readonly room: Room;
    private state: GameState;
    
    private startTimeout: any;

    constructor(room: Room) {
        this.room = room;

        this.state = {
            playing: false,
            players: [],
            lastLoser: null,
            stadium: null,
        };

        this.bind();
        this.init();
    }

    private bind() {
        this.room.onPlayerJoin = this.onPlayerJoin.bind(this);
        this.room.onPlayerLeave = this.onPlayerLeave.bind(this);
        this.room.onPlayerBallKick = this.onPlayerBallKick.bind(this);
        this.room.onTeamGoal = this.onTeamGoal.bind(this);
        this.room.onPositionsReset = this.onPositionsReset.bind(this);
    }

    private onPlayerJoin(player: PlayerObject) {
        if (this.state.playing) {
            this.room.setPlayerTeam(player.id, 0);
        } else {
            this.armStart();
        }
    }

    private armStart() {
        // If game is not playing but enough players to start, start
        if (this.room.getPlayerList().length >= GameManager.MIN_PLAYERS) {
            clearTimeout(this.startTimeout);
            this.startTimeout = setTimeout(() => this.start(), GameManager.PLAYER_JOIN_START_DELAY);
            this.room.sendAnnouncement(
                `Will start in ${GameManager.PLAYER_JOIN_START_DELAY / 1000} seconds if no more player joins`
            );
        }
    }

    private onPlayerLeave(gameObject: PlayerObject) {
        this.state.players = this.state.players.filter(p => p.gameObject !== gameObject);
    }

    private onPlayerBallKick(player: PlayerObject) {

    }

    private onTeamGoal(teamId: TeamID) {
        const ballPosition = this.room.getBallPosition();
        const goal = StadiumManager.findNearestGoal(this.state.stadium, ballPosition);
        const player = this.state.players.find(player => player.position[0] === goal[0] && player.position[1] === goal[1]);
        this.state.lastLoser = player.gameObject;
        if (! player) {
            throw new Error('Unable to find who lost this round');
        }
        // If player has no more lives (remove one live from him)
        if (-- player.lives < 1) {
            // Remove him from the list of active players & update map
            this.state.players = this.state.players.filter(p => p !== player);
        }
    }

    private onPositionsReset() {

        // If not enough players
        if (this.state.players.length < 2) {
            this.stop();
            return;
        }

        // Otherwise, go next round
        this.resetStadium();
        this.startRound();
    }

    /**
     * Set the correct stadium
     * @returns 
     */
    private resetStadium() {
        // If not playing, do nothing
        if (! this.state.playing) {
            return;
        }

        this.state.stadium = StadiumManager.getStadium(this.state.players.length);
        if (this.state.stadium) {
            // Get stadium player positions
            const positions = StadiumManager.getStadiumPlayerPositions(this.state.stadium);
            // Update player positions
            for (const i in positions) {
                this.state.players[i].position = positions[i];
            }
            // Set stadium and player positions
            this.room.setCustomStadium(JSON.stringify(this.state.stadium));
        }
    }

    /**
     * Set the players to their goals
     */
    private resetPlayerStates() {
        for (const player of this.state.players) {
            // If this player was the last one to loose
            let pos: [number, number] = player.position;
            if (player.gameObject === this.state.lastLoser) {
                pos = [- 40, 0];
            } 
            this.room.setPlayerDiscProperties(
                player.gameObject.id,
                {
                    x: pos[0],
                    y: pos[1],
                    xspeed: 0,
                    yspeed: 0,
                }
            );
            this.room.setPlayerAvatar(player.gameObject.id, player.lives.toString());
        }
    }

    private resetPlayerTeams() {
        this.room.setTeamsLock(false);
        // Put everyone spectator
        this.room
            .getPlayerList()
            .map(player => this.room.setPlayerTeam(player.id, 0));
        // If playing, put all players in red/blue
        if (this.state.playing) {
            let team = 1;
            this.state.players
                .map(player => {
                    team = team === 1 ? 2 : 1;
                    this.room.setPlayerTeam(player.gameObject.id, team);
                });
        }
        this.room.setTeamsLock(true);
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
        this.state.players = this.room.getPlayerList().map(gameObject => ({
            gameObject,
            lives: GameManager.DEFAULT_LIVES,
            position: [0, 0],
        }));

        // Start the game
        this.resetPlayerTeams();
        this.resetStadium();
        this.room.startGame();
        this.startRound();
    }

    private startRound() {
        this.room.stopGame();
        this.resetPlayerTeams();
        this.resetStadium();
        this.room.startGame();
        this.resetPlayerStates();

        this.room.pauseGame(true);
        setTimeout(() => {
            this.room.pauseGame(false);
        }, 500);
    }

    private stop() {
        this.room.stopGame();
        this.state = {
            playing: false,
            players: [],
            lastLoser: null,
            stadium: null,
        }
        this.resetPlayerTeams();
        this.room.setTeamsLock(false);
        this.armStart();
    }
}
