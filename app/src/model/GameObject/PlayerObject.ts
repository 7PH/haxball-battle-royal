import { TeamID } from "./TeamID";

/**
 * A player
 */
export interface PlayerObject {
    id: number;
    name: string;
    auth: string;
    conn: string; 
    admin: boolean;
    team: TeamID;
    position: PlayerPosition;
}
export interface PlayerPosition {
    x: number | null;
    y: number | null;
}
