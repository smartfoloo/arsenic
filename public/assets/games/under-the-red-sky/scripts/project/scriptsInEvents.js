import {
	pushGhostPosition,
	saveGhostData,
	startGhostPlayback,
	interpolateGhostPosition,
	clearGhostData
} from "./ghost.js";

import updateCollisionSpace from "./collision.js";
import Utils from "./utils.js";
import Vec3 from "./fedVector3.js";
import Vec2 from "./fedVector2.js";


const scriptsInEvents = {

	async Utils_Event1_Act1(runtime, localVars)
	{
		const start = (localVars.minimum + localVars.maximum) * 0.5 -180;
		const floored = Math.floor((localVars.angle1 - start) / 360) * 360;
		runtime.setReturnValue(Utils.clamp(localVars.angle1, localVars.minimum + floored, localVars.maximum + floored))
	},

	async Utils_Event15_Act1(runtime, localVars)
	{
		const o = runtime.getInstanceByUid(localVars.UID).getJsonDataCopy();
		runtime.setReturnValue(Object.keys(o).length === 0)
		
	},

	async Utils_Event32_Act1(runtime, localVars)
	{
		const level = runtime.objects.save.getFirstInstance().getJsonDataCopy().lastPlayedLevel
		if (runtime.getLayout(level)){
			runtime.setReturnValue(level)
		}
		else runtime.setReturnValue = "level-1"
	},

	async E_uicomponents_Event54_Act1(runtime, localVars)
	{
		const tokens = localVars.tokens.split(",");
		const isMatch = (element) => element == localVars.curToken;
		const tokenIndex = tokens.findIndex(isMatch);
		runtime.setReturnValue(tokens[Utils.wrap0(tokenIndex + 1, tokens.length)])
	},

	async E_uicomponents_Event63_Act1(runtime, localVars)
	{
		runtime.layout.getLayer("debugUI").isVisible = localVars.isDebugUIEnabled
	},

	async E_uicomponents_Event64_Act1(runtime, localVars)
	{
		localVars.isDebugUIEnabled = !localVars.isDebugUIEnabled;
		runtime.layout.getLayer("debugUI").isVisible = localVars.isDebugUIEnabled
	},

	async E_game_Event33_Act2(runtime, localVars)
	{
		const save = runtime.objects.save.getFirstInstance().getJsonDataCopy();
		const ghost = save.levels[runtime.layout.name].ghost;
		startGhostPlayback(ghost);
	},

	async E_game_Event34_Act1(runtime, localVars)
	{
		const ghost = runtime.objects.GhostShape.getFirstInstance();
		const player = runtime.objects.player.getFirstInstance();
		
		interpolateGhostPosition(ghost, runtime.globalVars.timerTime);
		ghost.opacity = (Vec3.fromInst(ghost).distance(Vec3.fromInst(player)) - 32) * 0.001;
	},

	async E_game_Event36_Act2(runtime, localVars)
	{
		clearGhostData();
		pushGhostPosition(runtime.objects.player.getFirstInstance(), runtime.globalVars.timerTime)
	},

	async E_game_Event37_Act1(runtime, localVars)
	{
		saveGhostData(runtime.objects.tempGhost.getFirstInstance())
	},

	async E_game_Event38_Act1(runtime, localVars)
	{
		pushGhostPosition(runtime.objects.player.getFirstInstance(), runtime.globalVars.timerTime)
	},

	async E_game_Event43(runtime, localVars)
	{
		const camPos = Vec3.fromArray(runtime.objects["3DCamera"].getCameraPosition())
		
		for(const inst of runtime.objects.distanceCull3DObject.instances()){
			inst.isVisible = camPos.distance(Vec3.fromInst(inst)) < 4000
		}
	},

	async E_player_Event2_Act4(runtime, localVars)
	{
		updateCollisionSpace(runtime)
	},

	async E_player_Event43_Act1(runtime, localVars)
	{
		updateCollisionSpace(runtime)
	},

	async E_player_Event157_Act1(runtime, localVars)
	{
		const strength = localVars.BOUNCE_GROUND_STRENGTH;
		const player = runtime.objects.player.getFirstInstance();
		const normal = Vec3.fromAngle(Utils.toRadians(player.instVars.slideAngle), Utils.toRadians(player.instVars.floorAngle));
		player.behaviors.Movement.vectorX = normal.x * strength;
		player.behaviors.Movement.vectorY = normal.y * strength;
		player.instVars.vectorZ = normal.z * strength;
		
		
	},

	async E_levelprogress_Event13_Act1(runtime, localVars)
	{
		const levelSequence = runtime.objects.levelData.getFirstInstance().getJsonDataCopy().levelOrder;
		const manager = runtime.objects.globalManager.getFirstInstance();
		const layoutName = manager.instVars.curLevel;
		//setting a fallback level
		let nextLevel = "1-0"
		let breakNext = false;
		loop: for (const [key, value] of Object.entries(levelSequence)) {
			let index = 0;
			for (const level of value) {
				index++
		        if (breakNext) {
		            nextLevel = level;
		            break loop;
		        }
		        if (layoutName === level) {
		            breakNext = true;
		            manager.instVars.curChapter = key;
					manager.instVars.curChapterProgress = index;
					manager.instVars.curChapterMaxProgress = value.length;
		        }
		    }
		}
		
		manager.instVars.nextLevel = nextLevel;
	},

	async E_levelprogress_Event14_Act1(runtime, localVars)
	{
		const levelSequence = runtime.objects.levelData.getFirstInstance().getJsonDataCopy().levelOrder;
		let nextChapter = Object.keys(levelSequence)[0];
		let breakNext = false;
		for (const key of Object.keys(levelSequence)) {
		    if (breakNext) {
		        nextChapter = key;
		        break
		    }
		    if (localVars.chapter === key) breakNext = true;
		}
		runtime.setReturnValue(nextChapter)
	},

	async E_levelprogress_Event15_Act1(runtime, localVars)
	{
		const levelSequence = runtime.objects.levelData.getFirstInstance().getJsonDataCopy().levelOrder;
		let previousChapter = Object.keys(levelSequence)[Object.keys(levelSequence).length - 1];
		runtime.setReturnValue(previousChapter)
		for (const key of Object.keys(levelSequence)) {
		    if (localVars.chapter === key) {
		        runtime.setReturnValue(previousChapter);
		        break;
		    }
		    previousChapter = key;
		}
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

