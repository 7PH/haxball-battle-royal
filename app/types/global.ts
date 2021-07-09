import { RoomConfig } from "../src/model/RoomObject/RoomConfig";
import { Room } from "../src/model/RoomObject/RoomObject";

export {};


declare global {

    interface Window {
        HBInit(config: RoomConfig): Room;
        onHBLoaded(): void;
    }
}
