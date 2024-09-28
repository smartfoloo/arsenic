
gdjs.evtsExt__AutoTyping__Text_AutoTyping = gdjs.evtsExt__AutoTyping__Text_AutoTyping || {};

/**
 * Behavior generated from Auto typing text
 */
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping = class Text_AutoTyping extends gdjs.RuntimeBehavior {
  constructor(instanceContainer, behaviorData, owner) {
    super(instanceContainer, behaviorData, owner);
    this._runtimeScene = instanceContainer;

    this._onceTriggers = new gdjs.OnceTriggers();
    this._behaviorData = {};
    this._sharedData = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.getSharedData(
      instanceContainer,
      behaviorData.name
    );
    
    this._behaviorData.Interval = behaviorData.Interval !== undefined ? behaviorData.Interval : Number("0.05") || 0;
    this._behaviorData.CharacterJustAdded = false;
    this._behaviorData.CurrentCharacter = "";
  }

  // Hot-reload:
  updateFromBehaviorData(oldBehaviorData, newBehaviorData) {
    
    if (oldBehaviorData.Interval !== newBehaviorData.Interval)
      this._behaviorData.Interval = newBehaviorData.Interval;
    if (oldBehaviorData.CharacterJustAdded !== newBehaviorData.CharacterJustAdded)
      this._behaviorData.CharacterJustAdded = newBehaviorData.CharacterJustAdded;
    if (oldBehaviorData.CurrentCharacter !== newBehaviorData.CurrentCharacter)
      this._behaviorData.CurrentCharacter = newBehaviorData.CurrentCharacter;

    return true;
  }

  // Network sync:
  getNetworkSyncData() {
    return {
      ...super.getNetworkSyncData(),
      props: {
        
    Interval: this._behaviorData.Interval,
    CharacterJustAdded: this._behaviorData.CharacterJustAdded,
    CurrentCharacter: this._behaviorData.CurrentCharacter,
      }
    };
  }
  updateFromNetworkSyncData(networkSyncData) {
    super.updateFromNetworkSyncData(networkSyncData);
    
    if (networkSyncData.props.Interval !== undefined)
      this._behaviorData.Interval = networkSyncData.props.Interval;
    if (networkSyncData.props.CharacterJustAdded !== undefined)
      this._behaviorData.CharacterJustAdded = networkSyncData.props.CharacterJustAdded;
    if (networkSyncData.props.CurrentCharacter !== undefined)
      this._behaviorData.CurrentCharacter = networkSyncData.props.CurrentCharacter;
  }

  // Properties:
  
  _getInterval() {
    return this._behaviorData.Interval !== undefined ? this._behaviorData.Interval : Number("0.05") || 0;
  }
  _setInterval(newValue) {
    this._behaviorData.Interval = newValue;
  }
  _getCharacterJustAdded() {
    return this._behaviorData.CharacterJustAdded !== undefined ? this._behaviorData.CharacterJustAdded : false;
  }
  _setCharacterJustAdded(newValue) {
    this._behaviorData.CharacterJustAdded = newValue;
  }
  _toggleCharacterJustAdded() {
    this._setCharacterJustAdded(!this._getCharacterJustAdded());
  }
  _getCurrentCharacter() {
    return this._behaviorData.CurrentCharacter !== undefined ? this._behaviorData.CurrentCharacter : "";
  }
  _setCurrentCharacter(newValue) {
    this._behaviorData.CurrentCharacter = newValue;
  }
}

/**
 * Shared data generated from Auto typing text
 */
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.SharedData = class Text_AutoTypingSharedData {
  constructor(sharedData) {
    
  }
  
  // Shared properties:
  
}

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.getSharedData = function(instanceContainer, behaviorName) {
  if (!instanceContainer._AutoTyping_Text_AutoTypingSharedData) {
    const initialData = instanceContainer.getInitialSharedDataForBehavior(
      behaviorName
    );
    instanceContainer._AutoTyping_Text_AutoTypingSharedData = new gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.SharedData(
      initialData
    );
  }
  return instanceContainer._AutoTyping_Text_AutoTypingSharedData;
}

// Methods:
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.onCreatedContext = {};
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.onCreatedContext.GDObjectObjects1= [];
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.onCreatedContext.GDObjectObjects2= [];


gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.onCreatedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.onCreatedContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.onCreatedContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.onCreatedContext.GDObjectObjects1[i].returnVariable(gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.onCreatedContext.GDObjectObjects1[i].getVariables().get("__AutoTyping").getChild("txt_buffer")).setString((gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.onCreatedContext.GDObjectObjects1[i].getString()));
}
}{for(var i = 0, len = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.onCreatedContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.onCreatedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).StartAtBeginning((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.onCreatedContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.onCreatedContext.eventsList0(runtimeScene, eventsFunctionContext);
}


};

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.onCreated = function(parentEventsFunctionContext) {

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
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AutoTyping"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AutoTyping"),
  localVariables: [],
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

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.onCreatedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.onCreatedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.onCreatedContext.eventsList1(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.onCreatedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.onCreatedContext.GDObjectObjects2.length = 0;


return;
}
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext = {};
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1= [];
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2= [];
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects3= [];


gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setCharacterJustAdded(false);
}
}}

}


};gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{

/* Reuse gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2 */

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2[i].timerElapsedTime("__AutoTyping.WriteTimer", (gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getInterval())) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2[i].resetTimer("__AutoTyping.WriteTimer");
}
}{for(var i = 0, len = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2[i].returnVariable(gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2[i].getVariables().get("__AutoTyping").getChild("write_index")).add(1);
}
}{for(var i = 0, len = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setCharacterJustAdded(true);
}
}{for(var i = 0, len = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setCurrentCharacter(gdjs.evtTools.string.strAt((gdjs.RuntimeObject.getVariableString(gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2[i].getVariables().get("__AutoTyping").getChild("txt_buffer"))), (gdjs.RuntimeObject.getVariableNumber(gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2[i].getVariables().get("__AutoTyping").getChild("write_index")))));
}
}}

}


};gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.eventsList2 = function(runtimeScene, eventsFunctionContext) {

{

/* Reuse gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1 */

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1[i].getString() != (gdjs.RuntimeObject.getVariableString(gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1[i].getVariables().get("__AutoTyping").getChild("txt_buffer"))) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1[k] = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1[i].returnVariable(gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1[i].getVariables().get("__AutoTyping").getChild("write_index")).setNumber(0);
}
}{for(var i = 0, len = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1[i].returnVariable(gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1[i].getVariables().get("__AutoTyping").getChild("txt_buffer")).setString((gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1[i].getString()));
}
}{for(var i = 0, len = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1[i].setString("");
}
}{for(var i = 0, len = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1[i].resetTimer("__AutoTyping.WriteTimer");
}
}}

}


};gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.eventsList3 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2[i].getVariableNumber(gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2[i].getVariables().get("__AutoTyping").getChild("write_index")) <= gdjs.evtTools.string.strLen((gdjs.RuntimeObject.getVariableString(gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2[i].getVariables().get("__AutoTyping").getChild("txt_buffer")))) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2[i].setString(gdjs.evtTools.string.subStr((gdjs.RuntimeObject.getVariableString(gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2[i].getVariables().get("__AutoTyping").getChild("txt_buffer"))), 0, (gdjs.RuntimeObject.getVariableNumber(gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2[i].getVariables().get("__AutoTyping").getChild("write_index")))));
}
}
{ //Subevents
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.eventsList1(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1[i].getVariableNumber(gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1[i].getVariables().get("__AutoTyping").getChild("write_index")) > gdjs.evtTools.string.strLen((gdjs.RuntimeObject.getVariableString(gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1[i].getVariables().get("__AutoTyping").getChild("txt_buffer")))) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1[k] = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.removeTimer(runtimeScene, "__AutoTyping.WriteTimer");
}
{ //Subevents
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.eventsList2(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.eventsList4 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.eventsList0(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.eventsList3(runtimeScene, eventsFunctionContext);
}


};

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEvents = function(parentEventsFunctionContext) {

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
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AutoTyping"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AutoTyping"),
  localVariables: [],
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

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects3.length = 0;

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.eventsList4(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPostEventsContext.GDObjectObjects3.length = 0;


return;
}
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingFinishedContext = {};
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingFinishedContext.GDObjectObjects1= [];
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingFinishedContext.GDObjectObjects2= [];


gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingFinishedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingFinishedContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingFinishedContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingFinishedContext.GDObjectObjects1[i].getVariableNumber(gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingFinishedContext.GDObjectObjects1[i].getVariables().get("__AutoTyping").getChild("write_index")) >= gdjs.evtTools.string.strLen((gdjs.RuntimeObject.getVariableString(gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingFinishedContext.GDObjectObjects1[i].getVariables().get("__AutoTyping").getChild("txt_buffer")))) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingFinishedContext.GDObjectObjects1[k] = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingFinishedContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingFinishedContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingFinished = function(parentEventsFunctionContext) {

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
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AutoTyping"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AutoTyping"),
  localVariables: [],
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

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingFinishedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingFinishedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingFinishedContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingFinishedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingFinishedContext.GDObjectObjects2.length = 0;


return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingPauseContext = {};
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingPauseContext.GDObjectObjects1= [];
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingPauseContext.GDObjectObjects2= [];


gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingPauseContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingPauseContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingPauseContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingPauseContext.GDObjectObjects1[i].timerPaused("__AutoTyping.WriteTimer") ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingPauseContext.GDObjectObjects1[k] = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingPauseContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingPauseContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingPause = function(parentEventsFunctionContext) {

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
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AutoTyping"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AutoTyping"),
  localVariables: [],
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

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingPauseContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingPauseContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingPauseContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingPauseContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.TypingPauseContext.GDObjectObjects2.length = 0;


return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.IsCharacterJustAddedContext = {};
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.IsCharacterJustAddedContext.GDObjectObjects1= [];
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.IsCharacterJustAddedContext.GDObjectObjects2= [];


gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.IsCharacterJustAddedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.IsCharacterJustAddedContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.IsCharacterJustAddedContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.IsCharacterJustAddedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCharacterJustAdded() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.IsCharacterJustAddedContext.GDObjectObjects1[k] = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.IsCharacterJustAddedContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.IsCharacterJustAddedContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.IsCharacterJustAdded = function(parentEventsFunctionContext) {

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
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AutoTyping"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AutoTyping"),
  localVariables: [],
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

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.IsCharacterJustAddedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.IsCharacterJustAddedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.IsCharacterJustAddedContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.IsCharacterJustAddedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.IsCharacterJustAddedContext.GDObjectObjects2.length = 0;


return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.PauseContext = {};
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.PauseContext.GDObjectObjects1= [];
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.PauseContext.GDObjectObjects2= [];


gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.PauseContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.PauseContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.PauseContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.PauseContext.GDObjectObjects1[i].pauseTimer("__AutoTyping.WriteTimer");
}
}}

}


};

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.Pause = function(parentEventsFunctionContext) {

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
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AutoTyping"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AutoTyping"),
  localVariables: [],
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

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.PauseContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.PauseContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.PauseContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.PauseContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.PauseContext.GDObjectObjects2.length = 0;


return;
}
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ResumeContext = {};
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ResumeContext.GDObjectObjects1= [];
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ResumeContext.GDObjectObjects2= [];


gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ResumeContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ResumeContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ResumeContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ResumeContext.GDObjectObjects1[i].unpauseTimer("__AutoTyping.WriteTimer");
}
}}

}


};

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.Resume = function(parentEventsFunctionContext) {

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
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AutoTyping"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AutoTyping"),
  localVariables: [],
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

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ResumeContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ResumeContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ResumeContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ResumeContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ResumeContext.GDObjectObjects2.length = 0;


return;
}
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.SkipToEndContext = {};
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.SkipToEndContext.GDObjectObjects1= [];
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.SkipToEndContext.GDObjectObjects2= [];


gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.SkipToEndContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.SkipToEndContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.SkipToEndContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.SkipToEndContext.GDObjectObjects1[i].returnVariable(gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.SkipToEndContext.GDObjectObjects1[i].getVariables().get("__AutoTyping").getChild("write_index")).setNumber(gdjs.evtTools.string.strLen((gdjs.RuntimeObject.getVariableString(gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.SkipToEndContext.GDObjectObjects1[i].getVariables().get("__AutoTyping").getChild("txt_buffer")))));
}
}}

}


};

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.SkipToEnd = function(parentEventsFunctionContext) {

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
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AutoTyping"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AutoTyping"),
  localVariables: [],
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

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.SkipToEndContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.SkipToEndContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.SkipToEndContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.SkipToEndContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.SkipToEndContext.GDObjectObjects2.length = 0;


return;
}
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.JumpToPositionContext = {};
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.JumpToPositionContext.GDObjectObjects1= [];
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.JumpToPositionContext.GDObjectObjects2= [];


gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.JumpToPositionContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.JumpToPositionContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.JumpToPositionContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.JumpToPositionContext.GDObjectObjects1[i].returnVariable(gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.JumpToPositionContext.GDObjectObjects1[i].getVariables().get("__AutoTyping").getChild("write_index")).setNumber((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("CharacterIndex")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.JumpToPosition = function(CharacterIndex, parentEventsFunctionContext) {

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
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AutoTyping"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AutoTyping"),
  localVariables: [],
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
if (argName === "CharacterIndex") return CharacterIndex;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.JumpToPositionContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.JumpToPositionContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.JumpToPositionContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.JumpToPositionContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.JumpToPositionContext.GDObjectObjects2.length = 0;


return;
}
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.StartAtBeginningContext = {};
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.StartAtBeginningContext.GDObjectObjects1= [];
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.StartAtBeginningContext.GDObjectObjects2= [];


gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.StartAtBeginningContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.StartAtBeginningContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.StartAtBeginningContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.StartAtBeginningContext.GDObjectObjects1[i].returnVariable(gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.StartAtBeginningContext.GDObjectObjects1[i].getVariables().get("__AutoTyping").getChild("write_index")).setNumber(0);
}
}{for(var i = 0, len = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.StartAtBeginningContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.StartAtBeginningContext.GDObjectObjects1[i].setString("");
}
}{for(var i = 0, len = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.StartAtBeginningContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.StartAtBeginningContext.GDObjectObjects1[i].resetTimer("__AutoTyping.WriteTimer");
}
}}

}


};gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.StartAtBeginningContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.StartAtBeginningContext.eventsList0(runtimeScene, eventsFunctionContext);
}


};

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.StartAtBeginning = function(parentEventsFunctionContext) {

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
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AutoTyping"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AutoTyping"),
  localVariables: [],
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

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.StartAtBeginningContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.StartAtBeginningContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.StartAtBeginningContext.eventsList1(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.StartAtBeginningContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.StartAtBeginningContext.GDObjectObjects2.length = 0;


return;
}
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ChangeIntervalContext = {};
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ChangeIntervalContext.GDObjectObjects1= [];
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ChangeIntervalContext.GDObjectObjects2= [];


gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ChangeIntervalContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = eventsFunctionContext.getOnceTriggers().triggerOnce(9057844);
}
if (isConditionTrue_0) {
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ChangeIntervalContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ChangeIntervalContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ChangeIntervalContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setInterval((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("interval")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ChangeInterval = function(interval, parentEventsFunctionContext) {

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
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AutoTyping"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AutoTyping"),
  localVariables: [],
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
if (argName === "interval") return interval;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ChangeIntervalContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ChangeIntervalContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ChangeIntervalContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ChangeIntervalContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.ChangeIntervalContext.GDObjectObjects2.length = 0;


return;
}
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterContext = {};
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterContext.GDObjectObjects1= [];
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterContext.GDObjectObjects2= [];


gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterContext.GDObjectObjects1.length === 0 ) ? "" :gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentCharacter()); }}}

}


};

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacter = function(parentEventsFunctionContext) {

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
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AutoTyping"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AutoTyping"),
  localVariables: [],
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

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterContext.GDObjectObjects2.length = 0;


return "" + eventsFunctionContext.returnValue;
}
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterIndexContext = {};
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterIndexContext.GDObjectObjects1= [];
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterIndexContext.GDObjectObjects2= [];


gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterIndexContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterIndexContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (gdjs.RuntimeObject.getVariableNumber(((gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterIndexContext.GDObjectObjects1.length === 0 ) ? gdjs.VariablesContainer.badVariablesContainer : gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterIndexContext.GDObjectObjects1[0].getVariables()).get("__AutoTyping").getChild("write_index"))); }}}

}


};

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterIndex = function(parentEventsFunctionContext) {

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
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("AutoTyping"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("AutoTyping"),
  localVariables: [],
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

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterIndexContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterIndexContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterIndexContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterIndexContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.CurrentCharacterIndexContext.GDObjectObjects2.length = 0;


return Number(eventsFunctionContext.returnValue) || 0;
}

gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping.prototype.doStepPreEvents = function() {
  this._onceTriggers.startNewFrame();
};


gdjs.registerBehavior("AutoTyping::Text_AutoTyping", gdjs.evtsExt__AutoTyping__Text_AutoTyping.Text_AutoTyping);
