gdjs.CreditsCode = {};
gdjs.CreditsCode.GDCreditsObjects1= [];
gdjs.CreditsCode.GDCreditsObjects2= [];
gdjs.CreditsCode.GDCreditsObjects3= [];
gdjs.CreditsCode.GDCreditsObjects4= [];
gdjs.CreditsCode.GDCreditsObjects5= [];
gdjs.CreditsCode.GDCreditsObjects6= [];
gdjs.CreditsCode.GDCreditsObjects7= [];
gdjs.CreditsCode.GDCreditsObjects8= [];
gdjs.CreditsCode.GDCreditsObjects9= [];
gdjs.CreditsCode.GDCreditsObjects10= [];
gdjs.CreditsCode.GDCreditsObjects11= [];
gdjs.CreditsCode.GDCreditsObjects12= [];
gdjs.CreditsCode.GDCreditsObjects13= [];
gdjs.CreditsCode.GDCreditsObjects14= [];
gdjs.CreditsCode.GDCreditsObjects15= [];
gdjs.CreditsCode.GDCreditsObjects16= [];
gdjs.CreditsCode.GDCreditsObjects17= [];
gdjs.CreditsCode.GDCreditsObjects18= [];
gdjs.CreditsCode.GDCreditsObjects19= [];
gdjs.CreditsCode.GDCreditsObjects20= [];
gdjs.CreditsCode.GDCreditsObjects21= [];
gdjs.CreditsCode.GDCreditsObjects22= [];
gdjs.CreditsCode.GDCreditsObjects23= [];
gdjs.CreditsCode.GDCreditsObjects24= [];
gdjs.CreditsCode.GDInstructionsObjects1= [];
gdjs.CreditsCode.GDInstructionsObjects2= [];
gdjs.CreditsCode.GDInstructionsObjects3= [];
gdjs.CreditsCode.GDInstructionsObjects4= [];
gdjs.CreditsCode.GDInstructionsObjects5= [];
gdjs.CreditsCode.GDInstructionsObjects6= [];
gdjs.CreditsCode.GDInstructionsObjects7= [];
gdjs.CreditsCode.GDInstructionsObjects8= [];
gdjs.CreditsCode.GDInstructionsObjects9= [];
gdjs.CreditsCode.GDInstructionsObjects10= [];
gdjs.CreditsCode.GDInstructionsObjects11= [];
gdjs.CreditsCode.GDInstructionsObjects12= [];
gdjs.CreditsCode.GDInstructionsObjects13= [];
gdjs.CreditsCode.GDInstructionsObjects14= [];
gdjs.CreditsCode.GDInstructionsObjects15= [];
gdjs.CreditsCode.GDInstructionsObjects16= [];
gdjs.CreditsCode.GDInstructionsObjects17= [];
gdjs.CreditsCode.GDInstructionsObjects18= [];
gdjs.CreditsCode.GDInstructionsObjects19= [];
gdjs.CreditsCode.GDInstructionsObjects20= [];
gdjs.CreditsCode.GDInstructionsObjects21= [];
gdjs.CreditsCode.GDInstructionsObjects22= [];
gdjs.CreditsCode.GDInstructionsObjects23= [];
gdjs.CreditsCode.GDInstructionsObjects24= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects1= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects2= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects3= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects4= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects5= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects6= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects7= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects8= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects9= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects10= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects11= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects12= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects13= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects14= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects15= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects16= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects17= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects18= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects19= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects20= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects21= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects22= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects23= [];
gdjs.CreditsCode.GDNewTiledSpriteObjects24= [];


gdjs.CreditsCode.asyncCallback14071228 = function (runtimeScene, asyncObjectsList) {
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Main", false);
}}
gdjs.CreditsCode.eventsList0 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(9), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14071228(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14070668 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects23);

{}
{ //Subevents
gdjs.CreditsCode.eventsList0(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList1 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects22) asyncObjectsList.addObject("Credits", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(5), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14070668(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14069508 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects22);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects22.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects22[i].getBehavior("Text").setText("© Silvereen Game LLC - All rights reserved except for audio");
}
}{gdjs.evtTools.runtimeScene.prioritizeLoadingOfScene(runtimeScene, "Main");
}
{ //Subevents
gdjs.CreditsCode.eventsList1(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList2 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects21) asyncObjectsList.addObject("Credits", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14069508(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14068604 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects21);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects21.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects21[i].getBehavior("Text").setText("Download this game for your site on archive.silvereen.net");
}
}
{ //Subevents
gdjs.CreditsCode.eventsList2(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList3 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects20) asyncObjectsList.addObject("Credits", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14068604(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14068084 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects20);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects20.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects20[i].getBehavior("Text").setText("3kh0.net");
}
}
{ //Subevents
gdjs.CreditsCode.eventsList3(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList4 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects19) asyncObjectsList.addObject("Credits", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14068084(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14067284 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects19);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects19.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects19[i].getBehavior("Text").setText("Silvereen.net");
}
}
{ //Subevents
gdjs.CreditsCode.eventsList4(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList5 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects18) asyncObjectsList.addObject("Credits", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14067284(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14066892 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects18);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects18.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects18[i].getBehavior("Text").setText("patreon.com/silvereen");
}
}
{ //Subevents
gdjs.CreditsCode.eventsList5(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList6 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects17) asyncObjectsList.addObject("Credits", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14066892(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14065780 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects17);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects17.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects17[i].getBehavior("Text").setText("Patreons: We have none :( please follow us on patreon");
}
}
{ //Subevents
gdjs.CreditsCode.eventsList6(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList7 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects16) asyncObjectsList.addObject("Credits", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14065780(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14064868 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects16);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects16.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects16[i].getBehavior("Text").setText("purple-planet.com");
}
}
{ //Subevents
gdjs.CreditsCode.eventsList7(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList8 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects15) asyncObjectsList.addObject("Credits", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14064868(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14063964 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects15);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects15.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects15[i].getBehavior("Text").setText("freesound.org/people/soundslikewillem/sounds/400158/");
}
}
{ //Subevents
gdjs.CreditsCode.eventsList8(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList9 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects14) asyncObjectsList.addObject("Credits", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14063964(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14063060 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects14);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects14.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects14[i].getBehavior("Text").setText("freesound.org/people/Vilkas_Sound/sounds/463388/");
}
}
{ //Subevents
gdjs.CreditsCode.eventsList9(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList10 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects13) asyncObjectsList.addObject("Credits", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14063060(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14061868 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects13);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects13.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects13[i].getBehavior("Text").setText("freesound.org/people/MATRIXXX_/sounds/523365/");
}
}
{ //Subevents
gdjs.CreditsCode.eventsList10(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList11 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects12) asyncObjectsList.addObject("Credits", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14061868(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14061716 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects12);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects12.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects12[i].getBehavior("Text").setText("freesound.org/people/snakebarney/sounds/138101/");
}
}
{ //Subevents
gdjs.CreditsCode.eventsList11(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList12 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects11) asyncObjectsList.addObject("Credits", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14061716(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14061332 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects11);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects11.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects11[i].getBehavior("Text").setText("Echo - Developer");
}
}
{ //Subevents
gdjs.CreditsCode.eventsList12(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList13 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects10) asyncObjectsList.addObject("Credits", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14061332(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14060948 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects10);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects10.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects10[i].getBehavior("Text").setText("Artem - Playtester");
}
}
{ //Subevents
gdjs.CreditsCode.eventsList13(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList14 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects9) asyncObjectsList.addObject("Credits", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14060948(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14060564 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects9);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects9.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects9[i].getBehavior("Text").setText("Silvereen - CEO");
}
}
{ //Subevents
gdjs.CreditsCode.eventsList14(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList15 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects8) asyncObjectsList.addObject("Credits", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14060564(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14060180 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects8);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects8.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects8[i].getBehavior("Text").setText("Silvereen Games is:");
}
}
{ //Subevents
gdjs.CreditsCode.eventsList15(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList16 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects7) asyncObjectsList.addObject("Credits", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14060180(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14059796 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects7);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects7.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects7[i].getBehavior("Text").setText("Conept Art: Silvereen");
}
}
{ //Subevents
gdjs.CreditsCode.eventsList16(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList17 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects6) asyncObjectsList.addObject("Credits", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14059796(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14059500 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects6);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects6.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects6[i].getBehavior("Text").setText("Programmer: Silvereen");
}
}
{ //Subevents
gdjs.CreditsCode.eventsList17(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList18 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects5) asyncObjectsList.addObject("Credits", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14059500(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14059180 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects5);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects5.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects5[i].getBehavior("Text").setText("Art: Silvereen");
}
}
{ //Subevents
gdjs.CreditsCode.eventsList18(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList19 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects4) asyncObjectsList.addObject("Credits", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14059180(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14058804 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects4);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects4.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects4[i].getBehavior("Text").setText("Art Director: Silvereen");
}
}
{ //Subevents
gdjs.CreditsCode.eventsList19(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList20 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects3) asyncObjectsList.addObject("Credits", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14058804(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14057636 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects3);

gdjs.copyArray(asyncObjectsList.getObjects("Instructions"), gdjs.CreditsCode.GDInstructionsObjects3);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects3.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects3[i].getBehavior("Text").setText("Creatve Lead: Silvereen");
}
}{for(var i = 0, len = gdjs.CreditsCode.GDInstructionsObjects3.length ;i < len;++i) {
    gdjs.CreditsCode.GDInstructionsObjects3[i].getBehavior("Text").setText("[Spacebar to escape]");
}
}
{ //Subevents
gdjs.CreditsCode.eventsList20(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList21 = function(runtimeScene, asyncObjectsList) {

{


{
const parentAsyncObjectsList = asyncObjectsList;
{
const asyncObjectsList = gdjs.LongLivedObjectsList.from(parentAsyncObjectsList);
for (const obj of gdjs.CreditsCode.GDCreditsObjects2) asyncObjectsList.addObject("Credits", obj);
/* Don't save Instructions as it will be provided by the parent asyncObjectsList. */
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14057636(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14027220 = function (runtimeScene, asyncObjectsList) {
gdjs.copyArray(asyncObjectsList.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects2);

{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects2.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects2[i].getBehavior("Text").setText("Director: Silvereen");
}
}
{ //Subevents
gdjs.CreditsCode.eventsList21(runtimeScene, asyncObjectsList);} //End of subevents
}
gdjs.CreditsCode.eventsList22 = function(runtimeScene) {

{


{
{
const asyncObjectsList = new gdjs.LongLivedObjectsList();
for (const obj of gdjs.CreditsCode.GDCreditsObjects1) asyncObjectsList.addObject("Credits", obj);
for (const obj of gdjs.CreditsCode.GDInstructionsObjects1) asyncObjectsList.addObject("Instructions", obj);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(4.22), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14027220(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.asyncCallback14074308 = function (runtimeScene, asyncObjectsList) {
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Main", false);
}}
gdjs.CreditsCode.eventsList23 = function(runtimeScene) {

{


{
{
const asyncObjectsList = new gdjs.LongLivedObjectsList();
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(1.5), (runtimeScene) => (gdjs.CreditsCode.asyncCallback14074308(runtimeScene, asyncObjectsList)));
}
}

}


};gdjs.CreditsCode.eventsList24 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects1);
gdjs.copyArray(runtimeScene.getObjects("Instructions"), gdjs.CreditsCode.GDInstructionsObjects1);
{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects1.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects1[i].activateBehavior("Physics2", false);
}
}{for(var i = 0, len = gdjs.CreditsCode.GDInstructionsObjects1.length ;i < len;++i) {
    gdjs.CreditsCode.GDInstructionsObjects1[i].activateBehavior("Physics2", false);
}
}{gdjs.evtTools.sound.playSoundOnChannel(runtimeScene, "Purple Planet Music - Masquerade (1_33) 90bpm.mp3", 2, false, 75, 1);
}
{ //Subevents
gdjs.CreditsCode.eventsList22(runtimeScene);} //End of subevents
}

}


{

gdjs.copyArray(runtimeScene.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.CreditsCode.GDCreditsObjects1.length;i<l;++i) {
    if ( gdjs.CreditsCode.GDCreditsObjects1[i].getBehavior("Draggable").isDragged() ) {
        isConditionTrue_0 = true;
        gdjs.CreditsCode.GDCreditsObjects1[k] = gdjs.CreditsCode.GDCreditsObjects1[i];
        ++k;
    }
}
gdjs.CreditsCode.GDCreditsObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.CreditsCode.GDCreditsObjects1 */
{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects1.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects1[i].activateBehavior("Draggable", false);
}
}{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects1.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects1[i].activateBehavior("Physics2", true);
}
}}

}


{

gdjs.copyArray(runtimeScene.getObjects("Instructions"), gdjs.CreditsCode.GDInstructionsObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.CreditsCode.GDInstructionsObjects1.length;i<l;++i) {
    if ( gdjs.CreditsCode.GDInstructionsObjects1[i].getBehavior("Draggable").isDragged() ) {
        isConditionTrue_0 = true;
        gdjs.CreditsCode.GDInstructionsObjects1[k] = gdjs.CreditsCode.GDInstructionsObjects1[i];
        ++k;
    }
}
gdjs.CreditsCode.GDInstructionsObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.CreditsCode.GDInstructionsObjects1 */
{for(var i = 0, len = gdjs.CreditsCode.GDInstructionsObjects1.length ;i < len;++i) {
    gdjs.CreditsCode.GDInstructionsObjects1[i].activateBehavior("Physics2", true);
}
}{for(var i = 0, len = gdjs.CreditsCode.GDInstructionsObjects1.length ;i < len;++i) {
    gdjs.CreditsCode.GDInstructionsObjects1[i].activateBehavior("Draggable", false);
}
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isKeyPressed(runtimeScene, "Space");
if (isConditionTrue_0) {
{gdjs.evtTools.sound.fadeMusicVolume(runtimeScene, 1.5, 0, 2);
}
{ //Subevents
gdjs.CreditsCode.eventsList23(runtimeScene);} //End of subevents
}

}


};

gdjs.CreditsCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.CreditsCode.GDCreditsObjects1.length = 0;
gdjs.CreditsCode.GDCreditsObjects2.length = 0;
gdjs.CreditsCode.GDCreditsObjects3.length = 0;
gdjs.CreditsCode.GDCreditsObjects4.length = 0;
gdjs.CreditsCode.GDCreditsObjects5.length = 0;
gdjs.CreditsCode.GDCreditsObjects6.length = 0;
gdjs.CreditsCode.GDCreditsObjects7.length = 0;
gdjs.CreditsCode.GDCreditsObjects8.length = 0;
gdjs.CreditsCode.GDCreditsObjects9.length = 0;
gdjs.CreditsCode.GDCreditsObjects10.length = 0;
gdjs.CreditsCode.GDCreditsObjects11.length = 0;
gdjs.CreditsCode.GDCreditsObjects12.length = 0;
gdjs.CreditsCode.GDCreditsObjects13.length = 0;
gdjs.CreditsCode.GDCreditsObjects14.length = 0;
gdjs.CreditsCode.GDCreditsObjects15.length = 0;
gdjs.CreditsCode.GDCreditsObjects16.length = 0;
gdjs.CreditsCode.GDCreditsObjects17.length = 0;
gdjs.CreditsCode.GDCreditsObjects18.length = 0;
gdjs.CreditsCode.GDCreditsObjects19.length = 0;
gdjs.CreditsCode.GDCreditsObjects20.length = 0;
gdjs.CreditsCode.GDCreditsObjects21.length = 0;
gdjs.CreditsCode.GDCreditsObjects22.length = 0;
gdjs.CreditsCode.GDCreditsObjects23.length = 0;
gdjs.CreditsCode.GDCreditsObjects24.length = 0;
gdjs.CreditsCode.GDInstructionsObjects1.length = 0;
gdjs.CreditsCode.GDInstructionsObjects2.length = 0;
gdjs.CreditsCode.GDInstructionsObjects3.length = 0;
gdjs.CreditsCode.GDInstructionsObjects4.length = 0;
gdjs.CreditsCode.GDInstructionsObjects5.length = 0;
gdjs.CreditsCode.GDInstructionsObjects6.length = 0;
gdjs.CreditsCode.GDInstructionsObjects7.length = 0;
gdjs.CreditsCode.GDInstructionsObjects8.length = 0;
gdjs.CreditsCode.GDInstructionsObjects9.length = 0;
gdjs.CreditsCode.GDInstructionsObjects10.length = 0;
gdjs.CreditsCode.GDInstructionsObjects11.length = 0;
gdjs.CreditsCode.GDInstructionsObjects12.length = 0;
gdjs.CreditsCode.GDInstructionsObjects13.length = 0;
gdjs.CreditsCode.GDInstructionsObjects14.length = 0;
gdjs.CreditsCode.GDInstructionsObjects15.length = 0;
gdjs.CreditsCode.GDInstructionsObjects16.length = 0;
gdjs.CreditsCode.GDInstructionsObjects17.length = 0;
gdjs.CreditsCode.GDInstructionsObjects18.length = 0;
gdjs.CreditsCode.GDInstructionsObjects19.length = 0;
gdjs.CreditsCode.GDInstructionsObjects20.length = 0;
gdjs.CreditsCode.GDInstructionsObjects21.length = 0;
gdjs.CreditsCode.GDInstructionsObjects22.length = 0;
gdjs.CreditsCode.GDInstructionsObjects23.length = 0;
gdjs.CreditsCode.GDInstructionsObjects24.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects1.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects2.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects3.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects4.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects5.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects6.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects7.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects8.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects9.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects10.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects11.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects12.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects13.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects14.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects15.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects16.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects17.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects18.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects19.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects20.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects21.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects22.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects23.length = 0;
gdjs.CreditsCode.GDNewTiledSpriteObjects24.length = 0;

gdjs.CreditsCode.eventsList24(runtimeScene);

return;

}

gdjs['CreditsCode'] = gdjs.CreditsCode;
