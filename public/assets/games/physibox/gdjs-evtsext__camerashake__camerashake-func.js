
if (typeof gdjs.evtsExt__CameraShake__CameraShake !== "undefined") {
  gdjs.evtsExt__CameraShake__CameraShake.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__CameraShake__CameraShake = {};


gdjs.evtsExt__CameraShake__CameraShake.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("ShakePeriod")) || 0 : 0) != 0);
}
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().get("__CameraShake").getChild("DefaultFrequency").setNumber(1 / (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("ShakePeriod")) || 0 : 0));
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("ShakePeriod")) || 0 : 0) == 0);
}
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().get("__CameraShake").getChild("DefaultFrequency").setNumber(1 / 0.08);
}}

}


};gdjs.evtsExt__CameraShake__CameraShake.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{gdjs.evtTools.variable.variableClearChildren(runtimeScene.getScene().getVariables().get("__CameraShake").getChild("Layers"));
}{gdjs.evtsExt__CameraShake__SetLayerShakable.func(runtimeScene, true, (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}}

}


{


let isConditionTrue_0 = false;
{
{runtimeScene.getScene().getVariables().get("__CameraShake").getChild("Time").setNumber(0);
}{runtimeScene.getScene().getVariables().get("__CameraShake").getChild("Layer").setString((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""));
}{runtimeScene.getScene().getVariables().get("__CameraShake").getChild("Duration").setNumber((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Duration")) || 0 : 0));
}{runtimeScene.getScene().getVariables().get("__CameraShake").getChild("StartEaseDuration").setNumber(0);
}{runtimeScene.getScene().getVariables().get("__CameraShake").getChild("StopEaseDuration").setNumber((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Duration")) || 0 : 0));
}{runtimeScene.getScene().getVariables().get("__CameraShake").getChild("DefaultAmplitudeX").setNumber(Math.abs((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("AmplitudeX")) || 0 : 0)));
}{runtimeScene.getScene().getVariables().get("__CameraShake").getChild("DefaultAmplitudeY").setNumber(Math.abs((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("AmplitudeY")) || 0 : 0)));
}{runtimeScene.getScene().getVariables().get("__CameraShake").getChild("DefaultAmplitudeAngle").setNumber((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("AmplitudeAngle")) || 0 : 0));
}{runtimeScene.getScene().getVariables().get("__CameraShake").getChild("DefaultAmplitudeZoom").setNumber(1 + (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("AmplitudeZoom")) || 0 : 0) / 100);
}
{ //Subevents
gdjs.evtsExt__CameraShake__CameraShake.eventsList0(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (typeof eventsFunctionContext !== 'undefined' ? !!eventsFunctionContext.getArgument("ShakeForever") : false);
}
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().get("__CameraShake").getChild("Duration").setNumber(1234567890);
}}

}


{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__CameraShake").getChild("Duration")) == 0;
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().get("__CameraShake").getChild("Duration").setNumber(0.5);
}}

}


};gdjs.evtsExt__CameraShake__CameraShake.eventsList2 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__CameraShake__CameraShake.eventsList1(runtimeScene, eventsFunctionContext);
}


};

gdjs.evtsExt__CameraShake__CameraShake.func = function(runtimeScene, AmplitudeX, AmplitudeY, Layer, Camera, Duration, AmplitudeAngle, AmplitudeZoom, ShakePeriod, ShakeForever, parentEventsFunctionContext) {
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
if (argName === "AmplitudeX") return AmplitudeX;
if (argName === "AmplitudeY") return AmplitudeY;
if (argName === "Layer") return Layer;
if (argName === "Camera") return Camera;
if (argName === "Duration") return Duration;
if (argName === "AmplitudeAngle") return AmplitudeAngle;
if (argName === "AmplitudeZoom") return AmplitudeZoom;
if (argName === "ShakePeriod") return ShakePeriod;
if (argName === "ShakeForever") return ShakeForever;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};


gdjs.evtsExt__CameraShake__CameraShake.eventsList2(runtimeScene, eventsFunctionContext);

return;
}

gdjs.evtsExt__CameraShake__CameraShake.registeredGdjsCallbacks = [];