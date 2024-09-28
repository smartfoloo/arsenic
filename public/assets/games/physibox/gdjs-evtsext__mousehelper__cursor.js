
gdjs.evtsExt__MouseHelper__cursor = gdjs.evtsExt__MouseHelper__cursor || {};

/**
 * Behavior generated from Cursor
 */
gdjs.evtsExt__MouseHelper__cursor.cursor = class cursor extends gdjs.RuntimeBehavior {
  constructor(instanceContainer, behaviorData, owner) {
    super(instanceContainer, behaviorData, owner);
    this._runtimeScene = instanceContainer;

    this._onceTriggers = new gdjs.OnceTriggers();
    this._behaviorData = {};
    this._sharedData = gdjs.evtsExt__MouseHelper__cursor.cursor.getSharedData(
      instanceContainer,
      behaviorData.name
    );
    
  }

  // Hot-reload:
  updateFromBehaviorData(oldBehaviorData, newBehaviorData) {
    

    return true;
  }

  // Properties:
  
}

/**
 * Shared data generated from Cursor
 */
gdjs.evtsExt__MouseHelper__cursor.cursor.SharedData = class cursorSharedData {
  constructor(sharedData) {
    
  }
  
  // Shared properties:
  
}

gdjs.evtsExt__MouseHelper__cursor.cursor.getSharedData = function(instanceContainer, behaviorName) {
  if (!instanceContainer._MouseHelper_cursorSharedData) {
    const initialData = instanceContainer.getInitialSharedDataForBehavior(
      behaviorName
    );
    instanceContainer._MouseHelper_cursorSharedData = new gdjs.evtsExt__MouseHelper__cursor.cursor.SharedData(
      initialData
    );
  }
  return instanceContainer._MouseHelper_cursorSharedData;
}

// Methods:
gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onCreatedContext = {};
gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onCreatedContext.GDObjectObjects1= [];
gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onCreatedContext.GDObjectObjects2= [];


gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onCreatedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{gdjs.evtTools.input.hideCursor(runtimeScene);
}}

}


};

gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onCreated = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
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
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onCreatedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onCreatedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onCreatedContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.doStepPreEventsContext = {};
gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.doStepPreEventsContext.GDObjectObjects1= [];
gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.doStepPreEventsContext.GDObjectObjects2= [];


gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.doStepPreEventsContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.doStepPreEventsContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.doStepPreEventsContext.GDObjectObjects1[i].setPosition(gdjs.evtTools.input.getCursorX(runtimeScene, "", 0),gdjs.evtTools.input.getCursorY(runtimeScene, "", 0));
}
}}

}


};

gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.doStepPreEvents = function(parentEventsFunctionContext) {
this._onceTriggers.startNewFrame();
var that = this;
var runtimeScene = this._runtimeScene;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
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
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.doStepPreEventsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.doStepPreEventsContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.doStepPreEventsContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onActivateContext = {};
gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onActivateContext.GDObjectObjects1= [];
gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onActivateContext.GDObjectObjects2= [];


gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onActivateContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onActivateContext.GDObjectObjects1);
{gdjs.evtTools.input.hideCursor(runtimeScene);
}{for(var i = 0, len = gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onActivateContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onActivateContext.GDObjectObjects1[i].hide(false);
}
}}

}


};

gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onActivate = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
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
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onActivateContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onActivateContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onActivateContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onDeActivateContext = {};
gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onDeActivateContext.GDObjectObjects1= [];
gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onDeActivateContext.GDObjectObjects2= [];


gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onDeActivateContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onDeActivateContext.GDObjectObjects1);
{gdjs.evtTools.input.showCursor(runtimeScene);
}{for(var i = 0, len = gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onDeActivateContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onDeActivateContext.GDObjectObjects1[i].hide();
}
}}

}


};

gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onDeActivate = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
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
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onDeActivateContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onDeActivateContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__MouseHelper__cursor.cursor.prototype.onDeActivateContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}


gdjs.registerBehavior("MouseHelper::cursor", gdjs.evtsExt__MouseHelper__cursor.cursor);
