
if (typeof gdjs.evtsExt__DragCameraWithPointer__DragCameraWithPointer !== "undefined") {
  gdjs.evtsExt__DragCameraWithPointer__DragCameraWithPointer.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__DragCameraWithPointer__DragCameraWithPointer = {};


gdjs.evtsExt__DragCameraWithPointer__DragCameraWithPointer.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (Math.abs(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__DragCameraWithPointer").getChild("scrollDistanceX"))) >= 1);
}
if (isConditionTrue_0) {
{gdjs.evtTools.camera.setCameraX(runtimeScene, gdjs.evtTools.camera.getCameraX(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("CamLayer") : ""), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("CamNumber")) || 0 : 0)) - (gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__DragCameraWithPointer").getChild("scrollDistanceX"))), (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("CamLayer") : ""), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("CamNumber")) || 0 : 0));
}}

}


};gdjs.evtsExt__DragCameraWithPointer__DragCameraWithPointer.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (Math.abs(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__DragCameraWithPointer").getChild("scrollDistanceY"))) >= 1);
}
if (isConditionTrue_0) {
{gdjs.evtTools.camera.setCameraY(runtimeScene, gdjs.evtTools.camera.getCameraY(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("CamLayer") : ""), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("CamNumber")) || 0 : 0)) - (gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__DragCameraWithPointer").getChild("scrollDistanceY"))), (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("CamLayer") : ""), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("CamNumber")) || 0 : 0));
}}

}


};gdjs.evtsExt__DragCameraWithPointer__DragCameraWithPointer.eventsList2 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{runtimeScene.getScene().getVariables().get("__DragCameraWithPointer").getChild("scrollTargetX").setNumber(gdjs.evtTools.input.getCursorX(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("CamLayer") : ""), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("CamNumber")) || 0 : 0)));
}{runtimeScene.getScene().getVariables().get("__DragCameraWithPointer").getChild("scrollTargetY").setNumber(gdjs.evtTools.input.getCursorY(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("CamLayer") : ""), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("CamNumber")) || 0 : 0)));
}{runtimeScene.getScene().getVariables().get("__DragCameraWithPointer").getChild("scrollDistanceX").setNumber((gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__DragCameraWithPointer").getChild("scrollTargetX")) - gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__DragCameraWithPointer").getChild("scrollStartX"))));
}{runtimeScene.getScene().getVariables().get("__DragCameraWithPointer").getChild("scrollDistanceY").setNumber((gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__DragCameraWithPointer").getChild("scrollTargetY")) - gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__DragCameraWithPointer").getChild("scrollStartY"))));
}}

}


{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{let isConditionTrue_1 = false;
isConditionTrue_0 = false;
{
{isConditionTrue_1 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Direction") : "") == "horizontal");
}
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
}
}
{
{isConditionTrue_1 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Direction") : "") == "both");
}
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
}
}
{
{isConditionTrue_1 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Direction") : "") == "");
}
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
}
}
{
}
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__DragCameraWithPointer__DragCameraWithPointer.eventsList0(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{let isConditionTrue_1 = false;
isConditionTrue_0 = false;
{
{isConditionTrue_1 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Direction") : "") == "vertical");
}
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
}
}
{
{isConditionTrue_1 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Direction") : "") == "both");
}
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
}
}
{
{isConditionTrue_1 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Direction") : "") == "");
}
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
}
}
{
}
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__DragCameraWithPointer__DragCameraWithPointer.eventsList1(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__DragCameraWithPointer__DragCameraWithPointer.eventsList3 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{let isConditionTrue_1 = false;
isConditionTrue_0 = false;
{
isConditionTrue_1 = gdjs.evtTools.input.isMouseButtonPressed(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("InputButton") : ""));
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
}
}
{
{let isConditionTrue_2 = false;
isConditionTrue_2 = false;
isConditionTrue_2 = gdjs.evtTools.input.isMouseButtonPressed(runtimeScene, "Left");
if (isConditionTrue_2) {
isConditionTrue_2 = false;
{isConditionTrue_2 = !(typeof eventsFunctionContext !== 'undefined' ? !!eventsFunctionContext.getArgument("InputButton") : false);
}
}
isConditionTrue_1 = isConditionTrue_2;
}
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
}
}
{
}
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = eventsFunctionContext.getOnceTriggers().triggerOnce(13617468);
}
}
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().get("__DragCameraWithPointer").getChild("scrollStartX").setNumber(gdjs.evtTools.input.getCursorX(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("CamLayer") : ""), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("CamNumber")) || 0 : 0)));
}{runtimeScene.getScene().getVariables().get("__DragCameraWithPointer").getChild("scrollStartY").setNumber(gdjs.evtTools.input.getCursorY(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("CamLayer") : ""), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("CamNumber")) || 0 : 0)));
}}

}


{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{let isConditionTrue_1 = false;
isConditionTrue_0 = false;
{
isConditionTrue_1 = gdjs.evtTools.input.isMouseButtonPressed(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("InputButton") : ""));
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
}
}
{
{let isConditionTrue_2 = false;
isConditionTrue_2 = false;
isConditionTrue_2 = gdjs.evtTools.input.isMouseButtonPressed(runtimeScene, "Left");
if (isConditionTrue_2) {
isConditionTrue_2 = false;
{isConditionTrue_2 = !(typeof eventsFunctionContext !== 'undefined' ? !!eventsFunctionContext.getArgument("InputButton") : false);
}
}
isConditionTrue_1 = isConditionTrue_2;
}
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
}
}
{
}
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__DragCameraWithPointer__DragCameraWithPointer.eventsList2(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};

gdjs.evtsExt__DragCameraWithPointer__DragCameraWithPointer.func = function(runtimeScene, CamNumber, CamLayer, Direction, InputButton, parentEventsFunctionContext) {
var eventsFunctionContext = {
  _objectsMap: {
},
  _objectArraysMap: {
},
  _behaviorNamesMap: {
},
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
if (argName === "CamNumber") return CamNumber;
if (argName === "CamLayer") return CamLayer;
if (argName === "Direction") return Direction;
if (argName === "InputButton") return InputButton;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};


gdjs.evtsExt__DragCameraWithPointer__DragCameraWithPointer.eventsList3(runtimeScene, eventsFunctionContext);

return;
}

gdjs.evtsExt__DragCameraWithPointer__DragCameraWithPointer.registeredGdjsCallbacks = [];