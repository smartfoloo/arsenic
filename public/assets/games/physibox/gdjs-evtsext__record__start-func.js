
if (typeof gdjs.evtsExt__Record__Start !== "undefined") {
  gdjs.evtsExt__Record__Start.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__Record__Start = {};


gdjs.evtsExt__Record__Start.userFunc0xb23048 = function GDJSInlineCode(runtimeScene, eventsFunctionContext) {
"use strict";
const recorder = gdjs._extensionRecord;
const canvas = runtimeScene.getGame().getRenderer().getCanvas();
const stream = canvas.captureStream(recorder.fps);
const recordedChunks = [];

if (recorder) {
  if (recorder.gifMode()) recorder.mediaRecorder = new GifRecorder(stream, recorder.gif);
  else recorder.mediaRecorder = new MediaRecorder(stream, recorder.options);
}

recorder.mediaRecorder.addEventListener('error', (event) => recorder.setError(event.error.name));
recorder.mediaRecorder.addEventListener('resume', () => recorder.handler.resume = true);
recorder.mediaRecorder.addEventListener('pause', () => recorder.handler.pause = true);
recorder.mediaRecorder.addEventListener('start', () => recorder.handler.start = true);
recorder.mediaRecorder.addEventListener('save', () => recorder.handler.save = true);
recorder.mediaRecorder.addEventListener('stop', () => {
  if (!recorder.gifMode()) {
    recorder.blob = new Blob(recordedChunks, {
      type: 'video/' + recorder.options.format + recorder.options.codec
    });
  }

  recorder.handler.stop = true;
});
recorder.mediaRecorder.addEventListener('dataavailable', (event) => {
  if (recorder.gifMode()) recorder.blob = event.data;
  if (event.data.size > 0) recordedChunks.push(event.data);
});

recorder.mediaRecorder.start(2000);

};
gdjs.evtsExt__Record__Start.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__Record__Start.userFunc0xb23048(runtimeScene, typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined);

}


};

gdjs.evtsExt__Record__Start.func = function(runtimeScene, parentEventsFunctionContext) {
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
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};


gdjs.evtsExt__Record__Start.eventsList0(runtimeScene, eventsFunctionContext);

return;
}

gdjs.evtsExt__Record__Start.registeredGdjsCallbacks = [];