const MAPS: {[nbPlayers: number]: string} = { };
MAPS[2] = require('../../maps/2man.hbs').default;
MAPS[3] = require('../../maps/3man.hbs').default;
MAPS[4] = require('../../maps/4man.hbs').default;
MAPS[5] = require('../../maps/5man.hbs').default;
MAPS[6] = require('../../maps/6man.hbs').default;
MAPS[7] = require('../../maps/7man.hbs').default;
MAPS[8] = require('../../maps/8man.hbs').default;
MAPS[9] = require('../../maps/9man.hbs').default;
MAPS[10] = require('../../maps/10man.hbs').default;

export class MapManager {
    static getMap(nbPlayers: number): string | null {
        return MAPS[nbPlayers] || null;
    }
}
