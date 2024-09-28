
if (typeof gdjs.evtsExt__Record__SetFormat !== "undefined") {
  gdjs.evtsExt__Record__SetFormat.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__Record__SetFormat = {};


gdjs.evtsExt__Record__SetFormat.userFunc0xa55530 = function GDJSInlineCode(runtimeScene, eventsFunctionContext) {
"use strict";
const format = eventsFunctionContext.getArgument('format');
const supported = gdjs._extensionRecord.isFormatSupported(format);

if (supported === true) gdjs._extensionRecord.options.format = format;
else gdjs._extensionRecord.format = 'webm';

};
gdjs.evtsExt__Record__SetFormat.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__Record__SetFormat.userFunc0xa55530(runtimeScene, typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined);

}


};

gdjs.evtsExt__Record__SetFormat.func = function(runtimeScene, format, parentEventsFunctionContext) {
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
if (argName === "format") return format;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};


gdjs.evtsExt__Record__SetFormat.eventsList0(runtimeScene, eventsFunctionContext);

return;
}

gdjs.evtsExt__Record__SetFormat.registeredGdjsCallbacks = [];