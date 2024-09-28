
if (typeof gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill !== "undefined") {
  gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill = {};
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.forEachIndex2 = 0;

gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.forEachObjects2 = [];

gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.forEachTemporary2 = null;

gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.forEachTotalCount2 = 0;

gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects1= [];
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects2= [];
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects3= [];
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects4= [];
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDFillObjectObjects1= [];
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDFillObjectObjects2= [];
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDFillObjectObjects3= [];
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDFillObjectObjects4= [];


gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.mapOfGDgdjs_9546evtsExt_9595_9595RectangularFloodFill_9595_9595RectangularFloodFill_9546GDFillObjectObjects3Objects = Hashtable.newFrom({"FillObject": gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDFillObjectObjects3});
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.mapOfGDgdjs_9546evtsExt_9595_9595RectangularFloodFill_9595_9595RectangularFloodFill_9546GDFillObjectObjects3Objects = Hashtable.newFrom({"FillObject": gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDFillObjectObjects3});
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
{
{runtimeScene.getScene().getVariables().get("__RectangularFloodFill").getChild("BatchID").setString((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("BatchID") : ""));
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.variable.getVariableString(runtimeScene.getScene().getVariables().get("__RectangularFloodFill").getChild("BatchID")) == "";
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().get("__RectangularFloodFill").getChild("BatchID").setString("RectangularFloodFill");
}}

}


{



}


{


let isConditionTrue_0 = false;
{
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDFillObjectObjects3.length = 0;

{gdjs.evtTools.object.createObjectOnScene((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : runtimeScene), gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.mapOfGDgdjs_9546evtsExt_9595_9595RectangularFloodFill_9595_9595RectangularFloodFill_9546GDFillObjectObjects3Objects, 0, 0, "");
}{runtimeScene.getScene().getVariables().get("__RectangularFloodFill").getChild("FillObjectWidth").setNumber((( gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDFillObjectObjects3.length === 0 ) ? 0 :gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDFillObjectObjects3[0].getWidth()));
}{runtimeScene.getScene().getVariables().get("__RectangularFloodFill").getChild("FillObjectHeight").setNumber((( gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDFillObjectObjects3.length === 0 ) ? 0 :gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDFillObjectObjects3[0].getHeight()));
}{for(var i = 0, len = gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDFillObjectObjects3.length ;i < len;++i) {
    gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDFillObjectObjects3[i].deleteFromScene(runtimeScene);
}
}}

}


{



}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("FillObject"), gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDFillObjectObjects3);
gdjs.copyArray(gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects2, gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects3);

{gdjs.evtsExt__RectangularFloodFill__CreateMultipleCopiesOfObject.func(runtimeScene, gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.mapOfGDgdjs_9546evtsExt_9595_9595RectangularFloodFill_9595_9595RectangularFloodFill_9546GDFillObjectObjects3Objects, Math.floor((( gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects3.length === 0 ) ? 0 :gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects3[0].getHeight()) / (gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__RectangularFloodFill").getChild("FillObjectHeight")) + (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("SpaceBetweenRows")) || 0 : 0))), Math.floor((( gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects3.length === 0 ) ? 0 :gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects3[0].getWidth()) / (gdjs.evtTools.variable.getVariableNumber(runtimeScene.getScene().getVariables().get("__RectangularFloodFill").getChild("FillObjectWidth")) + (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("SpaceBetweenColumns")) || 0 : 0))), (( gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects3.length === 0 ) ? 0 :gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects3[0].getCenterXInScene()) - (( gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects3.length === 0 ) ? 0 :gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects3[0].getWidth()) / 2, (( gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects3.length === 0 ) ? 0 :gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects3[0].getCenterYInScene()) - (( gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects3.length === 0 ) ? 0 :gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects3[0].getHeight()) / 2, (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("SpaceBetweenRows")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("SpaceBetweenColumns")) || 0 : 0), "", "", (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Zorder")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}}

}


};gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("TargetObject"), gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects1);

for (gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.forEachIndex2 = 0;gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.forEachIndex2 < gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects1.length;++gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.forEachIndex2) {
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects2.length = 0;


gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.forEachTemporary2 = gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects1[gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.forEachIndex2];
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects2.push(gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.forEachTemporary2);
let isConditionTrue_0 = false;
if (true) {

{ //Subevents: 
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.eventsList0(runtimeScene, eventsFunctionContext);} //Subevents end.
}
}

}


};

gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.func = function(runtimeScene, TargetObject, FillObject, SpaceBetweenRows, SpaceBetweenColumns, Layer, Zorder, BatchID, parentEventsFunctionContext) {
var eventsFunctionContext = {
  _objectsMap: {
"TargetObject": TargetObject
, "FillObject": FillObject
},
  _objectArraysMap: {
"TargetObject": gdjs.objectsListsToArray(TargetObject)
, "FillObject": gdjs.objectsListsToArray(FillObject)
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
if (argName === "SpaceBetweenRows") return SpaceBetweenRows;
if (argName === "SpaceBetweenColumns") return SpaceBetweenColumns;
if (argName === "Layer") return Layer;
if (argName === "Zorder") return Zorder;
if (argName === "BatchID") return BatchID;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects1.length = 0;
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects2.length = 0;
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects3.length = 0;
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDTargetObjectObjects4.length = 0;
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDFillObjectObjects1.length = 0;
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDFillObjectObjects2.length = 0;
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDFillObjectObjects3.length = 0;
gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.GDFillObjectObjects4.length = 0;

gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.eventsList1(runtimeScene, eventsFunctionContext);

return;
}

gdjs.evtsExt__RectangularFloodFill__RectangularFloodFill.registeredGdjsCallbacks = [];