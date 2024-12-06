runOnStartup(async runtime => {
    runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime) {

    //to avoid accidental closiing when pressing w + strg
    /* addEventListener(
         'beforeunload',
         function(e) {
             e.stopPropagation();
             e.preventDefault();
             return false;
         },
         true
     );*/

    self.addEventListener('keydown', ev => {
        if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
            ev.preventDefault();
        }
    });

    //first init
    runtime.addEventListener("mousemove", () => onMouseMove(runtime, event));
    if(!runtime.objects.globalManager.getFirstInstance()) runtime.objects.globalManager.createInstance(0, 0, 0, false, "");

    //fetch project files
    //levelData
    const levelDataUrl = await runtime.assets.getProjectFileUrl("jsons/levelData.json");
    const levelDataResponse = await fetch(levelDataUrl);
    runtime.objects.levelData.getFirstInstance().setJsonDataCopy(await levelDataResponse.json());
    //achievementData
    const achievementDataUrl = await runtime.assets.getProjectFileUrl("jsons/achievementData.json");
    const achievementDataResponse = await fetch(achievementDataUrl);
    runtime.objects.achievementData.getFirstInstance().setJsonDataCopy(await achievementDataResponse.json());

    runtime.callFunction("loadSave");
}

function onMouseMove(runtime, event) {
    if ((Math.abs(event.movementX) + Math.abs(event.movementY)) > 200) return;

    runtime.callFunction("updateCamera", event.movementX, event.movementY)
};
