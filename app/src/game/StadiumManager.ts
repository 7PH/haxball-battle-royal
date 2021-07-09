const STADIUMS: {[nbPlayers: number]: Stadium} = { };
STADIUMS[2] = JSON.parse(require('../../maps/2man.hbs').default);
STADIUMS[3] = JSON.parse(require('../../maps/3man.hbs').default);
STADIUMS[4] = JSON.parse(require('../../maps/4man.hbs').default);
STADIUMS[5] = JSON.parse(require('../../maps/5man.hbs').default);
STADIUMS[6] = JSON.parse(require('../../maps/6man.hbs').default);
STADIUMS[7] = JSON.parse(require('../../maps/7man.hbs').default);
STADIUMS[8] = JSON.parse(require('../../maps/8man.hbs').default);
STADIUMS[9] = JSON.parse(require('../../maps/9man.hbs').default);
STADIUMS[10] = JSON.parse(require('../../maps/10man.hbs').default);




export interface Stadium {

    goals: Array<{
        p0: [number, number],
        p1: [number, number],
        team: string,
        vis: boolean,
    }>;
}


export class StadiumManager {

    static readonly STADIUMS: {[nbPlayers: number]: Stadium} = STADIUMS;

    static getStadium(nbPlayers: number): Stadium | null {
        return STADIUMS[nbPlayers] || null;
    }

    static getStadiumPlayerPositions(stadium: Stadium): [number, number][] {
        return stadium.goals
            .map(goal => [
                (goal.p0[0] + goal.p1[0]) * .5,
                (goal.p0[1] + goal.p1[1]) * .5,
            ]);
    }

    static findNearestGoal(stadium: Stadium, ballPosition: {x: number, y: number}): [number, number] {
        const positions = StadiumManager.getStadiumPlayerPositions(stadium);
        let closestPosition: [number, number] = null;
        let closestDistance: number = Infinity;
        for (const position of positions) {
            const distance = Math.sqrt(Math.pow(position[0] - ballPosition.x, 2) + Math.pow(position[1] - ballPosition.y, 2));
            if (distance < closestDistance) {
                closestPosition = position;
                closestDistance = distance;
            }
        }
        return closestPosition;
    }
}
