
/**
 *
 * CollisionFlagsObjects contains flag constants that are used as helpers for reading and writing collision flags.
    The flags are ball, red, blue, redKO, blueKO, wall, all, kick, score, c0, c1, c2 and c3
    https://github.com/haxball/haxball-issues/wiki/Collision-Flags

    e.g.
    >> var cf = room.CollisionFlags;
    >> // Check if disc 4 belongs to collision group "ball":
    >> var discProps = room.getDiscProperties(4);
    >> var hasBallFlag = (discProps.cGroup & cf.ball) != 0;
    >> // Add "wall" to the collision mask of disc 5 without changing any other of it's flags:
    >> var discProps = room.getDiscProperties(5);
    >> room.setDiscProperties(5, {cMask: discProps.cMask | cf.wall});

    // Collision flags are what haxball's physics uses to determine which objects collide and which objects ignore each other.
    // Each flag represents a group or category.
 */
export interface CollisionFlagsObject {

    ball: number;
    red: number;
    blue: number;
    redKO: number;
    blueKO: number;
    wall: number;
    all: number;
    kick: number;
    score: number;
    c0: number;
    c1: number;
    c2: number;
    c3: number;
}
