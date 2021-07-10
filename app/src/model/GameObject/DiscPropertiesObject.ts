
/**
 * A disc (can be of a player or not)
 */
export interface DiscPropertiesObject {
    
    x: number;
    y: number;

    xspeed: number;
    yspeed: number;

    xgravity: number;
    ygravity: number;

    radius: number;
    bCoeff: number;
    invMass: number;
    damping: number;
    color: number;
    cMask: number;
    cGroup: number;
}
