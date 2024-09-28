gdjs.TitleCode = {};
gdjs.TitleCode.localVariables = [];
gdjs.TitleCode.GDNewTextObjects1= [];
gdjs.TitleCode.GDNewTextObjects2= [];
gdjs.TitleCode.GDNewTextObjects3= [];
gdjs.TitleCode.GDWhiteSleekButtonObjects1= [];
gdjs.TitleCode.GDWhiteSleekButtonObjects2= [];
gdjs.TitleCode.GDWhiteSleekButtonObjects3= [];


gdjs.TitleCode.asyncCallback10304556 = function (runtimeScene, asyncObjectsList) {
asyncObjectsList.restoreLocalVariablesContainers(gdjs.TitleCode.localVariables);
gdjs.copyArray(asyncObjectsList.getObjects("WhiteSleekButton"), gdjs.TitleCode.GDWhiteSleekButtonObjects3);

{for(var i = 0, len = gdjs.TitleCode.GDWhiteSleekButtonObjects3.length ;i < len;++i) {
    gdjs.TitleCode.GDWhiteSleekButtonObjects3[i].hide(false);
}
}gdjs.TitleCode.localVariables.length = 0;
}
gdjs.TitleCode.eventsList0 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
asyncObjectsList.backupLocalVariablesContainers(gdjs.TitleCode.localVariables);
/* Don't save WhiteSleekButton as it will be provided by the parent asyncObjectsList. */
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(2), (runtimeScene) => (gdjs.TitleCode.asyncCallback10304556(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.TitleCode.asyncCallback10304068 = function (runtimeScene, asyncObjectsList) {
asyncObjectsList.restoreLocalVariablesContainers(gdjs.TitleCode.localVariables);
gdjs.copyArray(runtimeScene.getObjects("NewText"), gdjs.TitleCode.GDNewTextObjects2);
{for(var i = 0, len = gdjs.TitleCode.GDNewTextObjects2.length ;i < len;++i) {
    gdjs.TitleCode.GDNewTextObjects2[i].getBehavior("Text").setText("Made by Silvereen");
}
}
{ //Subevents
gdjs.TitleCode.eventsList0(runtimeScene, asyncObjectsList);} //End of subevents
gdjs.TitleCode.localVariables.length = 0;
}
gdjs.TitleCode.eventsList1 = function(runtimeScene) {

{


{
{
const asyncObjectsList = new gdjs.LongLivedObjectsList();
asyncObjectsList.backupLocalVariablesContainers(gdjs.TitleCode.localVariables);
for (const obj of gdjs.TitleCode.GDWhiteSleekButtonObjects1) asyncObjectsList.addObject("WhiteSleekButton", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(2), (runtimeScene) => (gdjs.TitleCode.asyncCallback10304068(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.TitleCode.eventsList2 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("WhiteSleekButton"), gdjs.TitleCode.GDWhiteSleekButtonObjects1);
{for(var i = 0, len = gdjs.TitleCode.GDWhiteSleekButtonObjects1.length ;i < len;++i) {
    gdjs.TitleCode.GDWhiteSleekButtonObjects1[i].hide();
}
}
{ //Subevents
gdjs.TitleCode.eventsList1(runtimeScene);} //End of subevents
}

}


{

gdjs.copyArray(runtimeScene.getObjects("WhiteSleekButton"), gdjs.TitleCode.GDWhiteSleekButtonObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.TitleCode.GDWhiteSleekButtonObjects1.length;i<l;++i) {
    if ( gdjs.TitleCode.GDWhiteSleekButtonObjects1[i].IsClicked((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) ) {
        isConditionTrue_0 = true;
        gdjs.TitleCode.GDWhiteSleekButtonObjects1[k] = gdjs.TitleCode.GDWhiteSleekButtonObjects1[i];
        ++k;
    }
}
gdjs.TitleCode.GDWhiteSleekButtonObjects1.length = k;
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Game", false);
}}

}


};

gdjs.TitleCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.TitleCode.GDNewTextObjects1.length = 0;
gdjs.TitleCode.GDNewTextObjects2.length = 0;
gdjs.TitleCode.GDNewTextObjects3.length = 0;
gdjs.TitleCode.GDWhiteSleekButtonObjects1.length = 0;
gdjs.TitleCode.GDWhiteSleekButtonObjects2.length = 0;
gdjs.TitleCode.GDWhiteSleekButtonObjects3.length = 0;

gdjs.TitleCode.eventsList2(runtimeScene);
gdjs.TitleCode.GDNewTextObjects1.length = 0;
gdjs.TitleCode.GDNewTextObjects2.length = 0;
gdjs.TitleCode.GDNewTextObjects3.length = 0;
gdjs.TitleCode.GDWhiteSleekButtonObjects1.length = 0;
gdjs.TitleCode.GDWhiteSleekButtonObjects2.length = 0;
gdjs.TitleCode.GDWhiteSleekButtonObjects3.length = 0;


return;

}

gdjs['TitleCode'] = gdjs.TitleCode;
