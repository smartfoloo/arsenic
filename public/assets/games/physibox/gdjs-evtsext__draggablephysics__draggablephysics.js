
gdjs.evtsExt__DraggablePhysics__DraggablePhysics = gdjs.evtsExt__DraggablePhysics__DraggablePhysics || {};

/**
 * Behavior generated from Draggable (for physics objects)
 */
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics = class DraggablePhysics extends gdjs.RuntimeBehavior {
  constructor(instanceContainer, behaviorData, owner) {
    super(instanceContainer, behaviorData, owner);
    this._runtimeScene = instanceContainer;

    this._onceTriggers = new gdjs.OnceTriggers();
    this._behaviorData = {};
    this._sharedData = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.getSharedData(
      instanceContainer,
      behaviorData.name
    );
    
    this._behaviorData.PhysicsBehavior = behaviorData.PhysicsBehavior !== undefined ? behaviorData.PhysicsBehavior : "";
    this._behaviorData.MouseButton = behaviorData.MouseButton !== undefined ? behaviorData.MouseButton : "Left";
    this._behaviorData.MaxForce = behaviorData.MaxForce !== undefined ? behaviorData.MaxForce : Number("500") || 0;
    this._behaviorData.Frequency = behaviorData.Frequency !== undefined ? behaviorData.Frequency : Number("10") || 0;
    this._behaviorData.Damping = behaviorData.Damping !== undefined ? behaviorData.Damping : Number("1") || 0;
    this._behaviorData.MouseJointID = Number("") || 0;
    this._behaviorData.EnableAutomaticDragging = behaviorData.EnableAutomaticDragging !== undefined ? behaviorData.EnableAutomaticDragging : true;
  }

  // Hot-reload:
  updateFromBehaviorData(oldBehaviorData, newBehaviorData) {
    
    if (oldBehaviorData.PhysicsBehavior !== newBehaviorData.PhysicsBehavior)
      this._behaviorData.PhysicsBehavior = newBehaviorData.PhysicsBehavior;
    if (oldBehaviorData.MouseButton !== newBehaviorData.MouseButton)
      this._behaviorData.MouseButton = newBehaviorData.MouseButton;
    if (oldBehaviorData.MaxForce !== newBehaviorData.MaxForce)
      this._behaviorData.MaxForce = newBehaviorData.MaxForce;
    if (oldBehaviorData.Frequency !== newBehaviorData.Frequency)
      this._behaviorData.Frequency = newBehaviorData.Frequency;
    if (oldBehaviorData.Damping !== newBehaviorData.Damping)
      this._behaviorData.Damping = newBehaviorData.Damping;
    if (oldBehaviorData.MouseJointID !== newBehaviorData.MouseJointID)
      this._behaviorData.MouseJointID = newBehaviorData.MouseJointID;
    if (oldBehaviorData.EnableAutomaticDragging !== newBehaviorData.EnableAutomaticDragging)
      this._behaviorData.EnableAutomaticDragging = newBehaviorData.EnableAutomaticDragging;

    return true;
  }

  // Properties:
  
  _getPhysicsBehavior() {
    return this._behaviorData.PhysicsBehavior !== undefined ? this._behaviorData.PhysicsBehavior : "";
  }
  _setPhysicsBehavior(newValue) {
    this._behaviorData.PhysicsBehavior = newValue;
  }
  _getMouseButton() {
    return this._behaviorData.MouseButton !== undefined ? this._behaviorData.MouseButton : "Left";
  }
  _setMouseButton(newValue) {
    this._behaviorData.MouseButton = newValue;
  }
  _getMaxForce() {
    return this._behaviorData.MaxForce !== undefined ? this._behaviorData.MaxForce : Number("500") || 0;
  }
  _setMaxForce(newValue) {
    this._behaviorData.MaxForce = newValue;
  }
  _getFrequency() {
    return this._behaviorData.Frequency !== undefined ? this._behaviorData.Frequency : Number("10") || 0;
  }
  _setFrequency(newValue) {
    this._behaviorData.Frequency = newValue;
  }
  _getDamping() {
    return this._behaviorData.Damping !== undefined ? this._behaviorData.Damping : Number("1") || 0;
  }
  _setDamping(newValue) {
    this._behaviorData.Damping = newValue;
  }
  _getMouseJointID() {
    return this._behaviorData.MouseJointID !== undefined ? this._behaviorData.MouseJointID : Number("") || 0;
  }
  _setMouseJointID(newValue) {
    this._behaviorData.MouseJointID = newValue;
  }
  _getEnableAutomaticDragging() {
    return this._behaviorData.EnableAutomaticDragging !== undefined ? this._behaviorData.EnableAutomaticDragging : true;
  }
  _setEnableAutomaticDragging(newValue) {
    this._behaviorData.EnableAutomaticDragging = newValue;
  }
  _toggleEnableAutomaticDragging() {
    this._setEnableAutomaticDragging(!this._getEnableAutomaticDragging());
  }
}

/**
 * Shared data generated from Draggable (for physics objects)
 */
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.SharedData = class DraggablePhysicsSharedData {
  constructor(sharedData) {
    
  }
  
  // Shared properties:
  
}

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.getSharedData = function(instanceContainer, behaviorName) {
  if (!instanceContainer._DraggablePhysics_DraggablePhysicsSharedData) {
    const initialData = instanceContainer.getInitialSharedDataForBehavior(
      behaviorName
    );
    instanceContainer._DraggablePhysics_DraggablePhysicsSharedData = new gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.SharedData(
      initialData
    );
  }
  return instanceContainer._DraggablePhysics_DraggablePhysicsSharedData;
}

// Methods:
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext = {};
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1= [];
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2= [];
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects3= [];


gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("PhysicsBehavior")).isKinematic() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1[k] = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("PhysicsBehavior")).setDynamic();
}
}}

}


};gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.mapOfGDgdjs_9546evtsExt_9595_9595DraggablePhysics_9595_9595DraggablePhysics_9546DraggablePhysics_9546prototype_9546doStepPreEventsContext_9546GDObjectObjects2Objects = Hashtable.newFrom({"Object": gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2});
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{

/* Reuse gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2 */

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( !(gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).IsBeingDragged((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.mapOfGDgdjs_9546evtsExt_9595_9595DraggablePhysics_9595_9595DraggablePhysics_9546DraggablePhysics_9546prototype_9546doStepPreEventsContext_9546GDObjectObjects2Objects, runtimeScene, true, false);
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("PhysicsBehavior")).addMouseJoint(gdjs.evtTools.input.getCursorX(runtimeScene, (gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2[i].getLayer()), 0), gdjs.evtTools.input.getCursorY(runtimeScene, (gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2[i].getLayer()), 0), (gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxForce()), (gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getFrequency()), (gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDamping()), runtimeScene.getScene().getVariables().get("__DraggablePhysics").getChild("MouseJointID"));
}
}{for(var i = 0, len = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setMouseJointID(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__DraggablePhysics").getChild("MouseJointID")));
}
}}

}


};gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.eventsList2 = function(runtimeScene, eventsFunctionContext) {

{

/* Reuse gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2 */

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isMouseButtonPressed(runtimeScene, (( gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2.length === 0 ) ? "" :gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMouseButton()));
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = eventsFunctionContext.getOnceTriggers().triggerOnce(13769172);
}
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.eventsList1(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.eventsList3 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getEnableAutomaticDragging() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.eventsList2(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getEnableAutomaticDragging() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, (( gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2.length === 0 ) ? "" :gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMouseButton()));
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).ReleaseDrag((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).IsBeingDragged((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1[k] = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("PhysicsBehavior")).setMouseJointTarget((gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMouseJointID()), gdjs.evtTools.input.getCursorX(runtimeScene, (gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1[i].getLayer()), 0), gdjs.evtTools.input.getCursorY(runtimeScene, (gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1[i].getLayer()), 0));
}
}}

}


};gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.eventsList4 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.eventsList0(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.eventsList3(runtimeScene, eventsFunctionContext);
}


};

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEvents = function(parentEventsFunctionContext) {
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
, "PhysicsBehavior": this._getPhysicsBehavior()
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

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.GDObjectObjects3.length = 0;

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.doStepPreEventsContext.eventsList4(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext = {};
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.GDObjectObjects1= [];
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.GDObjectObjects2= [];


gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.GDObjectObjects1.length;i<l;++i) {
    if ( !(gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).IsBeingDragged((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.GDObjectObjects1[k] = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("PhysicsBehavior")).addMouseJoint(gdjs.evtTools.input.getCursorX(runtimeScene, (gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.GDObjectObjects1[i].getLayer()), 0), gdjs.evtTools.input.getCursorY(runtimeScene, (gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.GDObjectObjects1[i].getLayer()), 0), (gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxForce()), (gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getFrequency()), (gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDamping()), runtimeScene.getScene().getVariables().get("__DraggablePhysics").getChild("MouseJointID"));
}
}{for(var i = 0, len = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setMouseJointID(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__DraggablePhysics").getChild("MouseJointID")));
}
}}

}


};

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDragging = function(parentEventsFunctionContext) {

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
, "PhysicsBehavior": this._getPhysicsBehavior()
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

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.StartDraggingContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.ReleaseDragContext = {};
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.ReleaseDragContext.GDObjectObjects1= [];
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.ReleaseDragContext.GDObjectObjects2= [];


gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.ReleaseDragContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.ReleaseDragContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.ReleaseDragContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.ReleaseDragContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).IsBeingDragged((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.ReleaseDragContext.GDObjectObjects1[k] = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.ReleaseDragContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.ReleaseDragContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.ReleaseDragContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.ReleaseDragContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.ReleaseDragContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("PhysicsBehavior")).removeJoint((gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.ReleaseDragContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMouseJointID()));
}
}{for(var i = 0, len = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.ReleaseDragContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.ReleaseDragContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setMouseJointID(0);
}
}}

}


};

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.ReleaseDrag = function(parentEventsFunctionContext) {

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
, "PhysicsBehavior": this._getPhysicsBehavior()
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

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.ReleaseDragContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.ReleaseDragContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.ReleaseDragContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsBeingDraggedContext = {};
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsBeingDraggedContext.GDObjectObjects1= [];
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsBeingDraggedContext.GDObjectObjects2= [];


gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsBeingDraggedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsBeingDraggedContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsBeingDraggedContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsBeingDraggedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMouseJointID() != 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsBeingDraggedContext.GDObjectObjects1[k] = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsBeingDraggedContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsBeingDraggedContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsBeingDragged = function(parentEventsFunctionContext) {

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
, "PhysicsBehavior": this._getPhysicsBehavior()
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

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsBeingDraggedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsBeingDraggedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsBeingDraggedContext.eventsList0(runtimeScene, eventsFunctionContext);

return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.onDeActivateContext = {};
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.onDeActivateContext.GDObjectObjects1= [];
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.onDeActivateContext.GDObjectObjects2= [];


gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.onDeActivateContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.onDeActivateContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.onDeActivateContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.onDeActivateContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).ReleaseDrag((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.onDeActivate = function(parentEventsFunctionContext) {

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
, "PhysicsBehavior": this._getPhysicsBehavior()
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

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.onDeActivateContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.onDeActivateContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.onDeActivateContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MouseButtonContext = {};
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MouseButtonContext.GDObjectObjects1= [];
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MouseButtonContext.GDObjectObjects2= [];


gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MouseButtonContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MouseButtonContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MouseButtonContext.GDObjectObjects1.length === 0 ) ? "" :gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MouseButtonContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMouseButton()); }}}

}


};

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MouseButton = function(parentEventsFunctionContext) {

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
, "PhysicsBehavior": this._getPhysicsBehavior()
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

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MouseButtonContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MouseButtonContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MouseButtonContext.eventsList0(runtimeScene, eventsFunctionContext);

return "" + eventsFunctionContext.returnValue;
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMouseButtonContext = {};
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMouseButtonContext.GDObjectObjects1= [];
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMouseButtonContext.GDObjectObjects2= [];


gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMouseButtonContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMouseButtonContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMouseButtonContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMouseButtonContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setMouseButton((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Value") : ""));
}
}}

}


};

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMouseButton = function(Value, parentEventsFunctionContext) {

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
, "PhysicsBehavior": this._getPhysicsBehavior()
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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMouseButtonContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMouseButtonContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMouseButtonContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MaxForceContext = {};
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MaxForceContext.GDObjectObjects1= [];
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MaxForceContext.GDObjectObjects2= [];


gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MaxForceContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MaxForceContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MaxForceContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MaxForceContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxForce()); }}}

}


};

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MaxForce = function(parentEventsFunctionContext) {

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
, "PhysicsBehavior": this._getPhysicsBehavior()
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

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MaxForceContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MaxForceContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.MaxForceContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMaxForceContext = {};
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMaxForceContext.GDObjectObjects1= [];
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMaxForceContext.GDObjectObjects2= [];


gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMaxForceContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMaxForceContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMaxForceContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMaxForceContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setMaxForce((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMaxForce = function(Value, parentEventsFunctionContext) {

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
, "PhysicsBehavior": this._getPhysicsBehavior()
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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMaxForceContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMaxForceContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetMaxForceContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.FrequencyContext = {};
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.FrequencyContext.GDObjectObjects1= [];
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.FrequencyContext.GDObjectObjects2= [];


gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.FrequencyContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.FrequencyContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.FrequencyContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.FrequencyContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getFrequency()); }}}

}


};

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.Frequency = function(parentEventsFunctionContext) {

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
, "PhysicsBehavior": this._getPhysicsBehavior()
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

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.FrequencyContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.FrequencyContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.FrequencyContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetFrequencyContext = {};
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetFrequencyContext.GDObjectObjects1= [];
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetFrequencyContext.GDObjectObjects2= [];


gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetFrequencyContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetFrequencyContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetFrequencyContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetFrequencyContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setFrequency((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetFrequency = function(Value, parentEventsFunctionContext) {

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
, "PhysicsBehavior": this._getPhysicsBehavior()
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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetFrequencyContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetFrequencyContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetFrequencyContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.DampingContext = {};
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.DampingContext.GDObjectObjects1= [];
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.DampingContext.GDObjectObjects2= [];


gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.DampingContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.DampingContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.DampingContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.DampingContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDamping()); }}}

}


};

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.Damping = function(parentEventsFunctionContext) {

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
, "PhysicsBehavior": this._getPhysicsBehavior()
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

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.DampingContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.DampingContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.DampingContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetDampingContext = {};
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetDampingContext.GDObjectObjects1= [];
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetDampingContext.GDObjectObjects2= [];


gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetDampingContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetDampingContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetDampingContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetDampingContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setDamping((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetDamping = function(Value, parentEventsFunctionContext) {

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
, "PhysicsBehavior": this._getPhysicsBehavior()
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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetDampingContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetDampingContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetDampingContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsAutomaticDraggingEnabledContext = {};
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsAutomaticDraggingEnabledContext.GDObjectObjects1= [];
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsAutomaticDraggingEnabledContext.GDObjectObjects2= [];


gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsAutomaticDraggingEnabledContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsAutomaticDraggingEnabledContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsAutomaticDraggingEnabledContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsAutomaticDraggingEnabledContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getEnableAutomaticDragging() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsAutomaticDraggingEnabledContext.GDObjectObjects1[k] = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsAutomaticDraggingEnabledContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsAutomaticDraggingEnabledContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsAutomaticDraggingEnabled = function(parentEventsFunctionContext) {

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
, "PhysicsBehavior": this._getPhysicsBehavior()
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

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsAutomaticDraggingEnabledContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsAutomaticDraggingEnabledContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.IsAutomaticDraggingEnabledContext.eventsList0(runtimeScene, eventsFunctionContext);

return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetEnableAutomaticDraggingContext = {};
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetEnableAutomaticDraggingContext.GDObjectObjects1= [];
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetEnableAutomaticDraggingContext.GDObjectObjects2= [];


gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetEnableAutomaticDraggingContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = !(typeof eventsFunctionContext !== 'undefined' ? !!eventsFunctionContext.getArgument("Value") : false);
}
if (isConditionTrue_0) {
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetEnableAutomaticDraggingContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetEnableAutomaticDraggingContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetEnableAutomaticDraggingContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setEnableAutomaticDragging(false);
}
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (typeof eventsFunctionContext !== 'undefined' ? !!eventsFunctionContext.getArgument("Value") : false);
}
if (isConditionTrue_0) {
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetEnableAutomaticDraggingContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetEnableAutomaticDraggingContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetEnableAutomaticDraggingContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setEnableAutomaticDragging(true);
}
}}

}


};

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetEnableAutomaticDragging = function(Value, parentEventsFunctionContext) {

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
, "PhysicsBehavior": this._getPhysicsBehavior()
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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetEnableAutomaticDraggingContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetEnableAutomaticDraggingContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics.prototype.SetEnableAutomaticDraggingContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}


gdjs.registerBehavior("DraggablePhysics::DraggablePhysics", gdjs.evtsExt__DraggablePhysics__DraggablePhysics.DraggablePhysics);
