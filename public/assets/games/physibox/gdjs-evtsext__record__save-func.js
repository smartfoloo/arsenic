
if (typeof gdjs.evtsExt__Record__Save !== "undefined") {
  gdjs.evtsExt__Record__Save.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__Record__Save = {};


gdjs.evtsExt__Record__Save.userFunc0xa55530 = function GDJSInlineCode(runtimeScene, eventsFunctionContext) {
"use strict";
const recorder = gdjs._extensionRecord;
const path = eventsFunctionContext.getArgument('path');
const name = eventsFunctionContext.getArgument('name');

if (!recorder.mediaRecorder) {
    recorder.setError('Saving a recording that has not started'); 
} else if (!recorder.blob) {
    recorder.setError('Saving a recording that has not stopped'); 
} else {
    if (recorder.fs) {
        desktopDownload().then(
            () => recorder.handler.save = true,
            () => recorder.setError('Recording could not be saved to disk'),
        );
    }
    else {
        webDownload();
    }
}

async function desktopDownload() {
    const buffer = await Buffer.from(await recorder.blob.arrayBuffer());
    await recorder.fs.writeFile(path + '/' + name + '.' + recorder.options.format, buffer);
}

function webDownload() {
    const href = URL.createObjectURL(recorder.blob);
    const ref = window.open(href, name);
    ref.onbeforeunload = () => URL.revokeObjectURL(href);

    recorder.handler.save = true
};

};
gdjs.evtsExt__Record__Save.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__Record__Save.userFunc0xa55530(runtimeScene, typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined);

}


};

gdjs.evtsExt__Record__Save.func = function(runtimeScene, path, name, parentEventsFunctionContext) {
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
if (argName === "path") return path;
if (argName === "name") return name;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};


gdjs.evtsExt__Record__Save.eventsList0(runtimeScene, eventsFunctionContext);

return;
}

gdjs.evtsExt__Record__Save.registeredGdjsCallbacks = [];