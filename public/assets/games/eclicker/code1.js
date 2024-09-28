gdjs.GameCode = {};
gdjs.GameCode.localVariables = [];
gdjs.GameCode.GDRedButtonWithShadowObjects1= [];
gdjs.GameCode.GDRedButtonWithShadowObjects2= [];
gdjs.GameCode.GDE_9595TextObjects1= [];
gdjs.GameCode.GDE_9595TextObjects2= [];


gdjs.GameCode.eventsList0 = function(runtimeScene) {

{

gdjs.copyArray(runtimeScene.getObjects("RedButtonWithShadow"), gdjs.GameCode.GDRedButtonWithShadowObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.GameCode.GDRedButtonWithShadowObjects1.length;i<l;++i) {
    if ( gdjs.GameCode.GDRedButtonWithShadowObjects1[i].IsClicked((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) ) {
        isConditionTrue_0 = true;
        gdjs.GameCode.GDRedButtonWithShadowObjects1[k] = gdjs.GameCode.GDRedButtonWithShadowObjects1[i];
        ++k;
    }
}
gdjs.GameCode.GDRedButtonWithShadowObjects1.length = k;
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("E_Text"), gdjs.GameCode.GDE_9595TextObjects1);
{for(var i = 0, len = gdjs.GameCode.GDE_9595TextObjects1.length ;i < len;++i) {
    gdjs.GameCode.GDE_9595TextObjects1[i].getBehavior("Text").setText(gdjs.GameCode.GDE_9595TextObjects1[i].getBehavior("Text").getText() + ("E"));
}
}}

}


};

gdjs.GameCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.GameCode.GDRedButtonWithShadowObjects1.length = 0;
gdjs.GameCode.GDRedButtonWithShadowObjects2.length = 0;
gdjs.GameCode.GDE_9595TextObjects1.length = 0;
gdjs.GameCode.GDE_9595TextObjects2.length = 0;

gdjs.GameCode.eventsList0(runtimeScene);
gdjs.GameCode.GDRedButtonWithShadowObjects1.length = 0;
gdjs.GameCode.GDRedButtonWithShadowObjects2.length = 0;
gdjs.GameCode.GDE_9595TextObjects1.length = 0;
gdjs.GameCode.GDE_9595TextObjects2.length = 0;


return;

}

gdjs['GameCode'] = gdjs.GameCode;
