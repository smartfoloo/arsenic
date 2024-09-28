
if (typeof gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject !== "undefined") {
  gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject = {};
gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects1= [];
gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects2= [];
gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects3= [];
gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects4= [];


gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.mapOfGDgdjs_9546evtsExt_9595_9595RectangularFloodFill_9595_9595CreateMultipleCopiesOfObject_9546GDObjectObjects1Objects = Hashtable.newFrom({"Object": gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects1});
gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.mapOfGDgdjs_9546evtsExt_9595_9595RectangularFloodFill_9595_9595CreateMultipleCopiesOfObject_9546GDObjectObjects2Objects = Hashtable.newFrom({"Object": gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects2});
gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_y")) > (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("NumberOfRows")) || 0 : 0);
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_y").setNumber(-(1));
}{runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_x").setNumber(-(1));
}}

}


};gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Zorder")) || 0 : 0) != 0);
}
if (isConditionTrue_0) {
gdjs.copyArray(gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects2, gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects3);

{for(var i = 0, len = gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects3.length ;i < len;++i) {
    gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects3[i].setZOrder((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Zorder")) || 0 : 0));
}
}}

}


{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_x")) > (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("NumberOfColumns")) || 0 : 0);
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_x").setNumber(1);
}{runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_y").add(1);
}
{ //Subevents
gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.eventsList0(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.eventsList2 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
{
gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects1.length = 0;

{gdjs.evtTools.object.createObjectOnScene((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : runtimeScene), gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.mapOfGDgdjs_9546evtsExt_9595_9595RectangularFloodFill_9595_9595CreateMultipleCopiesOfObject_9546GDObjectObjects1Objects, 0, 0, "");
}{runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_ObjectWidth").setNumber((( gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects1[0].getWidth()));
}{runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_ObjectHeight").setNumber((( gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects1[0].getHeight()));
}{for(var i = 0, len = gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects1[i].deleteFromScene(runtimeScene);
}
}}

}


{



}


{


let isConditionTrue_0 = false;
{
{runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_x").setNumber(1);
}{runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_y").setNumber(1);
}{runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_CreationID").setNumber(1);
}}

}


{



}


{


let stopDoWhile_0 = false;
do {
gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects2.length = 0;

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_x")) > 0;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_y")) > 0;
}
if (isConditionTrue_0) {
let isConditionTrue_0 = false;
if (true) {
{gdjs.evtTools.object.createObjectOnScene((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : runtimeScene), gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.mapOfGDgdjs_9546evtsExt_9595_9595RectangularFloodFill_9595_9595CreateMultipleCopiesOfObject_9546GDObjectObjects2Objects, (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("StartingPositionX")) || 0 : 0) + (gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_x")) - 1) * (gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_ObjectWidth")) + (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("ColumnSpacing")) || 0 : 0)), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("StartingPositionY")) || 0 : 0) + (gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_y")) - 1) * (gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_ObjectHeight")) + (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("RowSpacing")) || 0 : 0)), (typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Layer") : ""));
}{for(var i = 0, len = gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects2[i].returnVariable(gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects2[i].getVariables().get("RowID")).setNumber(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_y")));
}
}{for(var i = 0, len = gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects2[i].returnVariable(gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects2[i].getVariables().get("ColumnID")).setNumber(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_x")));
}
}{for(var i = 0, len = gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects2[i].returnVariable(gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects2[i].getVariables().get("CreationID")).setNumber(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_CreationID")));
}
}{for(var i = 0, len = gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects2[i].returnVariable(gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects2[i].getVariables().get("BatchID")).setString((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("BatchID") : ""));
}
}{runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_x").add(1);
}{runtimeScene.getScene().getVariables().get("__CreateMultipleCopiesOfObject_CreationID").add(1);
}
{ //Subevents: 
gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.eventsList1(runtimeScene, eventsFunctionContext);} //Subevents end.
}
} else stopDoWhile_0 = true; 
} while (!stopDoWhile_0);

}


};

gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.func = function(runtimeScene, Object, NumberOfRows, NumberOfColumns, StartingPositionX, StartingPositionY, RowSpacing, ColumnSpacing, BatchID, Layer, Zorder, parentEventsFunctionContext) {
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": gdjs.objectsListsToArray(Object)
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
if (argName === "NumberOfRows") return NumberOfRows;
if (argName === "NumberOfColumns") return NumberOfColumns;
if (argName === "StartingPositionX") return StartingPositionX;
if (argName === "StartingPositionY") return StartingPositionY;
if (argName === "RowSpacing") return RowSpacing;
if (argName === "ColumnSpacing") return ColumnSpacing;
if (argName === "BatchID") return BatchID;
if (argName === "Layer") return Layer;
if (argName === "Zorder") return Zorder;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects1.length = 0;
gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects2.length = 0;
gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects3.length = 0;
gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.GDObjectObjects4.length = 0;

gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.eventsList2(runtimeScene, eventsFunctionContext);

return;
}

gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.registeredGdjsCallbacks = [];