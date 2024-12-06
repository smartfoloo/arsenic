export {
    pushGhostPosition,
    saveGhostData,
	startGhostPlayback,
	interpolateGhostPosition,
	clearGhostData
}

import Utils from "./utils.js";
import Vec3 from "./fedVector3.js";
import Vec2 from "./fedVector2.js";

function clearGhostData() {
	ghostData.length = 0;
}

function pushGhostPosition(inst, time) {
    const objectToPush = {};
    objectToPush.position = [inst.x, inst.y, inst.zElevation]
	objectToPush.time = time;
    ghostData.push(objectToPush)
}

function saveGhostData(inst) {
	inst.setJsonDataCopy(ghostData)
}

const ghostData = []
let playbackData = [];
let curIndex = 0;

function startGhostPlayback(o){
	playbackData.length = 0;
	playbackData = o;
	curIndex = 0;
}

function interpolateGhostPosition(ghost, time) {

    if ((curIndex + 2) > playbackData.length) return;
	
	let unlerpedTime = Utils.unlerp(playbackData[curIndex].time, playbackData[curIndex + 1].time, time);
	
	Vec3.lerp(Vec3.fromArray(playbackData[curIndex].position), Vec3.fromArray(playbackData[curIndex + 1].position), unlerpedTime).toInst(ghost);

	if (unlerpedTime >= 1) curIndex++;		
}