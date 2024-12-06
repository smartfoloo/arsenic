import Utils from "./utils.js";
import Vec3 from "./fedVector3.js";
import Vec2 from "./fedVector2.js";


function getZDataFromShape(inst, x, y) {

    let height = 0;
    let slopeRadians = 0;
    let slideAngle = 0;
    switch (inst?.shape) {

        case "box":
            height = inst.zElevation + inst.zHeight;
            break;

        case "wedge":
            height = inst.zElevation + inst.zHeight * (Utils.unrotate(-inst.angle, inst.x, inst.y, x, y) + inst.width / 2) / inst.width;
            slopeRadians = Math.atan(inst.zHeight / inst.width);
            slideAngle = inst.angleDegrees - 180 * Math.sign(inst.width);
            break;

        case "prism":
            let f = (Utils.unrotate(-inst.angle + Utils.halfPI, inst.x, inst.y, x, y) + inst.height / 2) / inst.height;
            let angle = inst.angleDegrees + 90;
            if (f > 0.5) {
                f = 1 - f;
                angle += 180
            };
            height = inst.zElevation + inst.zHeight * f * 2;
            slideAngle = angle;
            slopeRadians = Math.atan(inst.zHeight / (inst.height / 2));
            break;

        case "corner-in":
            const unrotatedY = Utils.unrotate(-inst.angle + Utils.halfPI, inst.x, inst.y, x, y);
            let yf = (unrotatedY + inst.height / 2) / inst.height;
            const unrotatedX = Utils.unrotate(-inst.angle, inst.x, inst.y, x, y);
            let xf = (unrotatedX + inst.width / 2) / inst.width;
            const addHeight = Math.min(inst.zHeight * (xf + yf), inst.zHeight);
            height = inst.zElevation + addHeight;
            slideAngle = inst.angleDegrees + 135;
            if (inst.width < 0) slideAngle = Utils.flipAngleHorizontally(slideAngle);
            if (inst.height < 0) slideAngle = Utils.flipAngleVertically(slideAngle);
            if (addHeight != inst.zHeight) slopeRadians = Math.atan(inst.zHeight / (Math.sqrt(inst.width * inst.width, inst.height * inst.height) / 2));
            else slopeRadians = 0;
            break;

        default:
            height = inst.zElevation + inst.zHeight
    };

    return {
        "height": height,
        "ZAngle": Utils.toDegrees(slopeRadians),
        "XAngle": slideAngle
    }
}

export default function updateCollisionSpace(runtime) {
    const player = runtime.objects.player.getFirstInstance();
    const playerStepZ = player.zElevation + player.instVars.zStep;
    const playerHeight = player.zElevation + player.instVars.standHeight;

    const rect = player.getBoundingBox();
    rect.x -= 320;
    rect.y -= 320;
    rect.width += 640;
    rect.height += 640;

    const candidates = Utils.deduplicateArray(runtime.collisions.getCollisionCandidates(runtime.objects.solid, rect));

    let floor = -99999;
    let ceiling = 99999;

    for (const inst of candidates) {
        inst.behaviors.Solid.isEnabled = false;

        if (!inst.instVars.isEnabled) continue;

        const isOverlapping = player.testOverlap(inst);

        if (inst.zElevation >= playerHeight) {
            if (isOverlapping && inst.zElevation < ceiling) ceiling = inst.zElevation;
            continue;
        }

        const {height, ZAngle: slopeAngle, XAngle: slideAngle} = getZDataFromShape(inst, player.x, player.y);
       
        if (isOverlapping && height < playerStepZ && height > floor) {
            floor = height;
            player.instVars.floorAngle = slopeAngle;
            player.instVars.normalForce = Math.cos(Utils.toRadians(slopeAngle)) * player.instVars.gravity;
            player.instVars.slideAngle = slideAngle;
            player.instVars.shouldBePushed = Math.abs(player.instVars.floorAngle) > player.instVars.slopePushAngleThreshold && Math.abs(player.instVars.floorAngle) < 89;
            player.instVars.curGroundType = inst.instVars.groundType;
            player.instVars.curGroundSoundType = inst.instVars.groundSoundType;
            player.instVars.floorUID = inst.uid;
        }

        if (playerStepZ <= height && playerHeight > inst.zElevation) inst.behaviors.Solid.isEnabled = true;
    }
    player.instVars.zCeiling = ceiling;
    player.instVars.zFloor = floor;
}