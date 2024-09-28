
gdjs.evtsExt__Health__Health = gdjs.evtsExt__Health__Health || {};

/**
 * Behavior generated from Health
 */
gdjs.evtsExt__Health__Health.Health = class Health extends gdjs.RuntimeBehavior {
  constructor(instanceContainer, behaviorData, owner) {
    super(instanceContainer, behaviorData, owner);
    this._runtimeScene = instanceContainer;

    this._onceTriggers = new gdjs.OnceTriggers();
    this._behaviorData = {};
    this._sharedData = gdjs.evtsExt__Health__Health.Health.getSharedData(
      instanceContainer,
      behaviorData.name
    );
    
    this._behaviorData.Health = behaviorData.Health !== undefined ? behaviorData.Health : Number("100") || 0;
    this._behaviorData.CurrentHealth = Number("0") || 0;
    this._behaviorData.MaxHealth = behaviorData.MaxHealth !== undefined ? behaviorData.MaxHealth : Number("100") || 0;
    this._behaviorData.DamageCooldown = behaviorData.DamageCooldown !== undefined ? behaviorData.DamageCooldown : Number("0") || 0;
    this._behaviorData.IsHealthJustDamaged = false;
    this._behaviorData.HealthRegenRate = behaviorData.HealthRegenRate !== undefined ? behaviorData.HealthRegenRate : Number("0") || 0;
    this._behaviorData.HealthRegenDelay = behaviorData.HealthRegenDelay !== undefined ? behaviorData.HealthRegenDelay : Number("0") || 0;
    this._behaviorData.AllowOverHealing = behaviorData.AllowOverHealing !== undefined ? behaviorData.AllowOverHealing : false;
    this._behaviorData.HitAtLeastOnce = false;
    this._behaviorData.IsJustHealed = false;
    this._behaviorData.CurrentShieldPoints = Number("") || 0;
    this._behaviorData.MaxShieldPoints = behaviorData.MaxShieldPoints !== undefined ? behaviorData.MaxShieldPoints : Number("0") || 0;
    this._behaviorData.ShieldDuration = behaviorData.ShieldDuration !== undefined ? behaviorData.ShieldDuration : Number("5") || 0;
    this._behaviorData.ShieldRegenRate = behaviorData.ShieldRegenRate !== undefined ? behaviorData.ShieldRegenRate : Number("0") || 0;
    this._behaviorData.BlockExcessDamage = behaviorData.BlockExcessDamage !== undefined ? behaviorData.BlockExcessDamage : false;
    this._behaviorData.ShieldRegenDelay = behaviorData.ShieldRegenDelay !== undefined ? behaviorData.ShieldRegenDelay : Number("0") || 0;
    this._behaviorData.IsShieldJustDamaged = false;
    this._behaviorData.ChanceToDodge = behaviorData.ChanceToDodge !== undefined ? behaviorData.ChanceToDodge : Number("0") || 0;
    this._behaviorData.DamageToBeApplied = Number("0") || 0;
    this._behaviorData.FlatDamageReduction = behaviorData.FlatDamageReduction !== undefined ? behaviorData.FlatDamageReduction : Number("0") || 0;
    this._behaviorData.PercentDamageReduction = behaviorData.PercentDamageReduction !== undefined ? behaviorData.PercentDamageReduction : Number("0") || 0;
    this._behaviorData.IsJustDodged = false;
    this._behaviorData.ShieldDamageTaken = Number("") || 0;
    this._behaviorData.HealToBeApplied = Number("0") || 0;
  }

  // Hot-reload:
  updateFromBehaviorData(oldBehaviorData, newBehaviorData) {
    
    if (oldBehaviorData.Health !== newBehaviorData.Health)
      this._behaviorData.Health = newBehaviorData.Health;
    if (oldBehaviorData.CurrentHealth !== newBehaviorData.CurrentHealth)
      this._behaviorData.CurrentHealth = newBehaviorData.CurrentHealth;
    if (oldBehaviorData.MaxHealth !== newBehaviorData.MaxHealth)
      this._behaviorData.MaxHealth = newBehaviorData.MaxHealth;
    if (oldBehaviorData.DamageCooldown !== newBehaviorData.DamageCooldown)
      this._behaviorData.DamageCooldown = newBehaviorData.DamageCooldown;
    if (oldBehaviorData.IsHealthJustDamaged !== newBehaviorData.IsHealthJustDamaged)
      this._behaviorData.IsHealthJustDamaged = newBehaviorData.IsHealthJustDamaged;
    if (oldBehaviorData.HealthRegenRate !== newBehaviorData.HealthRegenRate)
      this._behaviorData.HealthRegenRate = newBehaviorData.HealthRegenRate;
    if (oldBehaviorData.HealthRegenDelay !== newBehaviorData.HealthRegenDelay)
      this._behaviorData.HealthRegenDelay = newBehaviorData.HealthRegenDelay;
    if (oldBehaviorData.AllowOverHealing !== newBehaviorData.AllowOverHealing)
      this._behaviorData.AllowOverHealing = newBehaviorData.AllowOverHealing;
    if (oldBehaviorData.HitAtLeastOnce !== newBehaviorData.HitAtLeastOnce)
      this._behaviorData.HitAtLeastOnce = newBehaviorData.HitAtLeastOnce;
    if (oldBehaviorData.IsJustHealed !== newBehaviorData.IsJustHealed)
      this._behaviorData.IsJustHealed = newBehaviorData.IsJustHealed;
    if (oldBehaviorData.CurrentShieldPoints !== newBehaviorData.CurrentShieldPoints)
      this._behaviorData.CurrentShieldPoints = newBehaviorData.CurrentShieldPoints;
    if (oldBehaviorData.MaxShieldPoints !== newBehaviorData.MaxShieldPoints)
      this._behaviorData.MaxShieldPoints = newBehaviorData.MaxShieldPoints;
    if (oldBehaviorData.ShieldDuration !== newBehaviorData.ShieldDuration)
      this._behaviorData.ShieldDuration = newBehaviorData.ShieldDuration;
    if (oldBehaviorData.ShieldRegenRate !== newBehaviorData.ShieldRegenRate)
      this._behaviorData.ShieldRegenRate = newBehaviorData.ShieldRegenRate;
    if (oldBehaviorData.BlockExcessDamage !== newBehaviorData.BlockExcessDamage)
      this._behaviorData.BlockExcessDamage = newBehaviorData.BlockExcessDamage;
    if (oldBehaviorData.ShieldRegenDelay !== newBehaviorData.ShieldRegenDelay)
      this._behaviorData.ShieldRegenDelay = newBehaviorData.ShieldRegenDelay;
    if (oldBehaviorData.IsShieldJustDamaged !== newBehaviorData.IsShieldJustDamaged)
      this._behaviorData.IsShieldJustDamaged = newBehaviorData.IsShieldJustDamaged;
    if (oldBehaviorData.ChanceToDodge !== newBehaviorData.ChanceToDodge)
      this._behaviorData.ChanceToDodge = newBehaviorData.ChanceToDodge;
    if (oldBehaviorData.DamageToBeApplied !== newBehaviorData.DamageToBeApplied)
      this._behaviorData.DamageToBeApplied = newBehaviorData.DamageToBeApplied;
    if (oldBehaviorData.FlatDamageReduction !== newBehaviorData.FlatDamageReduction)
      this._behaviorData.FlatDamageReduction = newBehaviorData.FlatDamageReduction;
    if (oldBehaviorData.PercentDamageReduction !== newBehaviorData.PercentDamageReduction)
      this._behaviorData.PercentDamageReduction = newBehaviorData.PercentDamageReduction;
    if (oldBehaviorData.IsJustDodged !== newBehaviorData.IsJustDodged)
      this._behaviorData.IsJustDodged = newBehaviorData.IsJustDodged;
    if (oldBehaviorData.ShieldDamageTaken !== newBehaviorData.ShieldDamageTaken)
      this._behaviorData.ShieldDamageTaken = newBehaviorData.ShieldDamageTaken;
    if (oldBehaviorData.HealToBeApplied !== newBehaviorData.HealToBeApplied)
      this._behaviorData.HealToBeApplied = newBehaviorData.HealToBeApplied;

    return true;
  }

  // Properties:
  
  _getHealth() {
    return this._behaviorData.Health !== undefined ? this._behaviorData.Health : Number("100") || 0;
  }
  _setHealth(newValue) {
    this._behaviorData.Health = newValue;
  }
  _getCurrentHealth() {
    return this._behaviorData.CurrentHealth !== undefined ? this._behaviorData.CurrentHealth : Number("0") || 0;
  }
  _setCurrentHealth(newValue) {
    this._behaviorData.CurrentHealth = newValue;
  }
  _getMaxHealth() {
    return this._behaviorData.MaxHealth !== undefined ? this._behaviorData.MaxHealth : Number("100") || 0;
  }
  _setMaxHealth(newValue) {
    this._behaviorData.MaxHealth = newValue;
  }
  _getDamageCooldown() {
    return this._behaviorData.DamageCooldown !== undefined ? this._behaviorData.DamageCooldown : Number("0") || 0;
  }
  _setDamageCooldown(newValue) {
    this._behaviorData.DamageCooldown = newValue;
  }
  _getIsHealthJustDamaged() {
    return this._behaviorData.IsHealthJustDamaged !== undefined ? this._behaviorData.IsHealthJustDamaged : false;
  }
  _setIsHealthJustDamaged(newValue) {
    this._behaviorData.IsHealthJustDamaged = newValue;
  }
  _toggleIsHealthJustDamaged() {
    this._setIsHealthJustDamaged(!this._getIsHealthJustDamaged());
  }
  _getHealthRegenRate() {
    return this._behaviorData.HealthRegenRate !== undefined ? this._behaviorData.HealthRegenRate : Number("0") || 0;
  }
  _setHealthRegenRate(newValue) {
    this._behaviorData.HealthRegenRate = newValue;
  }
  _getHealthRegenDelay() {
    return this._behaviorData.HealthRegenDelay !== undefined ? this._behaviorData.HealthRegenDelay : Number("0") || 0;
  }
  _setHealthRegenDelay(newValue) {
    this._behaviorData.HealthRegenDelay = newValue;
  }
  _getAllowOverHealing() {
    return this._behaviorData.AllowOverHealing !== undefined ? this._behaviorData.AllowOverHealing : false;
  }
  _setAllowOverHealing(newValue) {
    this._behaviorData.AllowOverHealing = newValue;
  }
  _toggleAllowOverHealing() {
    this._setAllowOverHealing(!this._getAllowOverHealing());
  }
  _getHitAtLeastOnce() {
    return this._behaviorData.HitAtLeastOnce !== undefined ? this._behaviorData.HitAtLeastOnce : false;
  }
  _setHitAtLeastOnce(newValue) {
    this._behaviorData.HitAtLeastOnce = newValue;
  }
  _toggleHitAtLeastOnce() {
    this._setHitAtLeastOnce(!this._getHitAtLeastOnce());
  }
  _getIsJustHealed() {
    return this._behaviorData.IsJustHealed !== undefined ? this._behaviorData.IsJustHealed : false;
  }
  _setIsJustHealed(newValue) {
    this._behaviorData.IsJustHealed = newValue;
  }
  _toggleIsJustHealed() {
    this._setIsJustHealed(!this._getIsJustHealed());
  }
  _getCurrentShieldPoints() {
    return this._behaviorData.CurrentShieldPoints !== undefined ? this._behaviorData.CurrentShieldPoints : Number("") || 0;
  }
  _setCurrentShieldPoints(newValue) {
    this._behaviorData.CurrentShieldPoints = newValue;
  }
  _getMaxShieldPoints() {
    return this._behaviorData.MaxShieldPoints !== undefined ? this._behaviorData.MaxShieldPoints : Number("0") || 0;
  }
  _setMaxShieldPoints(newValue) {
    this._behaviorData.MaxShieldPoints = newValue;
  }
  _getShieldDuration() {
    return this._behaviorData.ShieldDuration !== undefined ? this._behaviorData.ShieldDuration : Number("5") || 0;
  }
  _setShieldDuration(newValue) {
    this._behaviorData.ShieldDuration = newValue;
  }
  _getShieldRegenRate() {
    return this._behaviorData.ShieldRegenRate !== undefined ? this._behaviorData.ShieldRegenRate : Number("0") || 0;
  }
  _setShieldRegenRate(newValue) {
    this._behaviorData.ShieldRegenRate = newValue;
  }
  _getBlockExcessDamage() {
    return this._behaviorData.BlockExcessDamage !== undefined ? this._behaviorData.BlockExcessDamage : false;
  }
  _setBlockExcessDamage(newValue) {
    this._behaviorData.BlockExcessDamage = newValue;
  }
  _toggleBlockExcessDamage() {
    this._setBlockExcessDamage(!this._getBlockExcessDamage());
  }
  _getShieldRegenDelay() {
    return this._behaviorData.ShieldRegenDelay !== undefined ? this._behaviorData.ShieldRegenDelay : Number("0") || 0;
  }
  _setShieldRegenDelay(newValue) {
    this._behaviorData.ShieldRegenDelay = newValue;
  }
  _getIsShieldJustDamaged() {
    return this._behaviorData.IsShieldJustDamaged !== undefined ? this._behaviorData.IsShieldJustDamaged : false;
  }
  _setIsShieldJustDamaged(newValue) {
    this._behaviorData.IsShieldJustDamaged = newValue;
  }
  _toggleIsShieldJustDamaged() {
    this._setIsShieldJustDamaged(!this._getIsShieldJustDamaged());
  }
  _getChanceToDodge() {
    return this._behaviorData.ChanceToDodge !== undefined ? this._behaviorData.ChanceToDodge : Number("0") || 0;
  }
  _setChanceToDodge(newValue) {
    this._behaviorData.ChanceToDodge = newValue;
  }
  _getDamageToBeApplied() {
    return this._behaviorData.DamageToBeApplied !== undefined ? this._behaviorData.DamageToBeApplied : Number("0") || 0;
  }
  _setDamageToBeApplied(newValue) {
    this._behaviorData.DamageToBeApplied = newValue;
  }
  _getFlatDamageReduction() {
    return this._behaviorData.FlatDamageReduction !== undefined ? this._behaviorData.FlatDamageReduction : Number("0") || 0;
  }
  _setFlatDamageReduction(newValue) {
    this._behaviorData.FlatDamageReduction = newValue;
  }
  _getPercentDamageReduction() {
    return this._behaviorData.PercentDamageReduction !== undefined ? this._behaviorData.PercentDamageReduction : Number("0") || 0;
  }
  _setPercentDamageReduction(newValue) {
    this._behaviorData.PercentDamageReduction = newValue;
  }
  _getIsJustDodged() {
    return this._behaviorData.IsJustDodged !== undefined ? this._behaviorData.IsJustDodged : false;
  }
  _setIsJustDodged(newValue) {
    this._behaviorData.IsJustDodged = newValue;
  }
  _toggleIsJustDodged() {
    this._setIsJustDodged(!this._getIsJustDodged());
  }
  _getShieldDamageTaken() {
    return this._behaviorData.ShieldDamageTaken !== undefined ? this._behaviorData.ShieldDamageTaken : Number("") || 0;
  }
  _setShieldDamageTaken(newValue) {
    this._behaviorData.ShieldDamageTaken = newValue;
  }
  _getHealToBeApplied() {
    return this._behaviorData.HealToBeApplied !== undefined ? this._behaviorData.HealToBeApplied : Number("0") || 0;
  }
  _setHealToBeApplied(newValue) {
    this._behaviorData.HealToBeApplied = newValue;
  }
}

/**
 * Shared data generated from Health
 */
gdjs.evtsExt__Health__Health.Health.SharedData = class HealthSharedData {
  constructor(sharedData) {
    
  }
  
  // Shared properties:
  
}

gdjs.evtsExt__Health__Health.Health.getSharedData = function(instanceContainer, behaviorName) {
  if (!instanceContainer._Health_HealthSharedData) {
    const initialData = instanceContainer.getInitialSharedDataForBehavior(
      behaviorName
    );
    instanceContainer._Health_HealthSharedData = new gdjs.evtsExt__Health__Health.Health.SharedData(
      initialData
    );
  }
  return instanceContainer._Health_HealthSharedData;
}

// Methods:
gdjs.evtsExt__Health__Health.Health.prototype.onCreatedContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.onCreatedContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.onCreatedContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.onCreatedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.onCreatedContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.onCreatedContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.onCreatedContext.GDObjectObjects1[i].resetTimer("__Health.TimeSinceLastHit");
}
}{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.onCreatedContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.onCreatedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).SetCurrentHealth((gdjs.evtsExt__Health__Health.Health.prototype.onCreatedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getHealth()), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.onCreated = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.onCreatedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.onCreatedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.onCreatedContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2= [];
gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects3= [];
gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects4= [];


gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{



}


{

/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2 */

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentHealth() > (gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).MaxHealth((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setCurrentHealth((gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxHealth()));
}
}}

}


};gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getHealthRegenRate() != 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentHealth() < (gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).MaxHealth((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getTimerElapsedTimeInSecondsOrNaN("__Health.TimeSinceLastHit") > (gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getHealthRegenDelay()) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length = k;
}
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setCurrentHealth(gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentHealth() + ((gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getHealthRegenRate()) * gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene)));
}
}
{ //Subevents
gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.eventsList0(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.eventsList2 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setIsHealthJustDamaged(false);
}
}{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setIsJustHealed(false);
}
}{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setIsJustDodged(false);
}
}}

}


};gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.eventsList3 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.eventsList1(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.eventsList2(runtimeScene, eventsFunctionContext);
}


};gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.eventsList4 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2, gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects3);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects3.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentShieldPoints() == 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects3[k] = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects3[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects3.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects3 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects3.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).RenewShieldDuration((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2, gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects3);

{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects3.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setCurrentShieldPoints(gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentShieldPoints() + ((gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getShieldRegenRate()) * gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene)));
}
}}

}


{



}


{

/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2 */

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentShieldPoints() > (gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxShieldPoints()) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setCurrentShieldPoints((gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxShieldPoints()));
}
}}

}


};gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.eventsList5 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getShieldRegenRate() != 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentShieldPoints() < (gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxShieldPoints()) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getTimerElapsedTimeInSecondsOrNaN("__Health.TimeSinceLastHit") > (gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getShieldRegenDelay()) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length = k;
}
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.eventsList4(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.eventsList6 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length;i<l;++i) {
    if ( !(gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).IsShieldActive((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[k] = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = eventsFunctionContext.getOnceTriggers().triggerOnce(13495812);
}
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setCurrentShieldPoints(0);
}
}}

}


};gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.eventsList7 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setIsShieldJustDamaged(false);
}
}}

}


};gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.eventsList8 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.eventsList5(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.eventsList6(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.eventsList7(runtimeScene, eventsFunctionContext);
}


};gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.eventsList9 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.eventsList3(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.eventsList8(runtimeScene, eventsFunctionContext);
}


};

gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEvents = function(parentEventsFunctionContext) {
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

gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects3.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.GDObjectObjects4.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.doStepPreEventsContext.eventsList9(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.HitContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2= [];
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3= [];
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects4= [];


gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1, gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.randomFloatInRange(0, 1) < (( gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getChanceToDodge()));
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setIsJustDodged(true);
}
}{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setDamageToBeApplied(0);
}
}}

}


};gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2, gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3);

{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setDamageToBeApplied(Math.max(0, (gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDamageToBeApplied()) - (gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getFlatDamageReduction())));
}
}}

}


};gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList2 = function(runtimeScene, eventsFunctionContext) {

{

/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2 */

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getPercentDamageReduction() > 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[k] = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDamageToBeApplied() > 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[k] = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length = k;
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setDamageToBeApplied(gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDamageToBeApplied() * (1 - Math.min(1, (gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getPercentDamageReduction()))));
}
}}

}


};gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList3 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList1(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList2(runtimeScene, eventsFunctionContext);
}


};gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList4 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1, gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (typeof eventsFunctionContext !== 'undefined' ? !!eventsFunctionContext.getArgument("UseArmor") : false);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDamageToBeApplied() > 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[k] = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length = k;
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList3(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList5 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2, gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getBlockExcessDamage() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3[k] = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setDamageToBeApplied(0);
}
}{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setCurrentShieldPoints(0);
}
}}

}


{



}


{

/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2 */

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length;i<l;++i) {
    if ( !(gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getBlockExcessDamage()) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[k] = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setDamageToBeApplied(gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDamageToBeApplied() - ((gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentShieldPoints())));
}
}{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setCurrentShieldPoints(0);
}
}}

}


};gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList6 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2, gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDamageToBeApplied() <= (gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentShieldPoints()) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3[k] = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setCurrentShieldPoints(gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentShieldPoints() - ((gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDamageToBeApplied())));
}
}{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setShieldDamageTaken((gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDamageToBeApplied()));
}
}{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setDamageToBeApplied(0);
}
}}

}


{



}


{

/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2 */

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDamageToBeApplied() > (gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentShieldPoints()) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[k] = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setShieldDamageTaken((gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentShieldPoints()));
}
}
{ //Subevents
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList5(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList7 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1, gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (typeof eventsFunctionContext !== 'undefined' ? !!eventsFunctionContext.getArgument("UseShield") : false);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).IsShieldActive((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[k] = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDamageToBeApplied() > 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[k] = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length = k;
}
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setIsShieldJustDamaged(true);
}
}{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).TriggerDamageCooldown((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}
{ //Subevents
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList6(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList8 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).SetCurrentHealth((gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentHealth()) - (gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDamageToBeApplied()), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList9 = function(runtimeScene, eventsFunctionContext) {

{

/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1 */

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDamageToBeApplied() > 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1[k] = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).SetJustDamaged(true, (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).TriggerDamageCooldown((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}
{ //Subevents
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList8(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList10 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList0(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList4(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList7(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList9(runtimeScene, eventsFunctionContext);
}


};gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList11 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1.length;i<l;++i) {
    if ( !(gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).IsDamageCooldownActive((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1[k] = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setDamageToBeApplied((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("DamageValue")) || 0 : 0));
}
}
{ //Subevents
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList10(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList12 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList11(runtimeScene, eventsFunctionContext);
}


};

gdjs.evtsExt__Health__Health.Health.prototype.Hit = function(DamageValue, UseShield, UseArmor, parentEventsFunctionContext) {

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
if (argName === "DamageValue") return DamageValue;
if (argName === "UseShield") return UseShield;
if (argName === "UseArmor") return UseArmor;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects3.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.HitContext.GDObjectObjects4.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.HitContext.eventsList12(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.HealthContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.HealthContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.HealthContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.HealthContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.HealthContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__Health__Health.Health.prototype.HealthContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.HealthContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentHealth()); }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.Health = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.HealthContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.HealthContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.HealthContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setCurrentHealth((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0));
}
}}

}


{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxHealth() > 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext.GDObjectObjects1[k] = gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setCurrentHealth(Math.min((gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentHealth()), (gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxHealth())));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetHealth = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetHealthContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetCurrentHealthContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetCurrentHealthContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetCurrentHealthContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetCurrentHealthContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetCurrentHealthContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetCurrentHealthContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetCurrentHealthContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).SetHealth((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetCurrentHealth = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetCurrentHealthContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetCurrentHealthContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetCurrentHealthContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.HealContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2= [];
gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects3= [];


gdjs.evtsExt__Health__Health.Health.prototype.HealContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxHealth() == 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2[k] = gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setHealToBeApplied((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("HealValue")) || 0 : 0));
}
}}

}


{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxHealth() > 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2[k] = gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2.length;i<l;++i) {
    if ( !(gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getAllowOverHealing()) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2[k] = gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2.length = k;
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setHealToBeApplied(Math.min((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("HealValue")) || 0 : 0), (gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxHealth()) - (gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentHealth())));
}
}}

}


{



}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setCurrentHealth(gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentHealth() + ((gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getHealToBeApplied())));
}
}}

}


{



}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setIsJustHealed(true);
}
}}

}


};gdjs.evtsExt__Health__Health.Health.prototype.HealContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__Health__Health.Health.prototype.HealContext.eventsList0(runtimeScene, eventsFunctionContext);
}


};

gdjs.evtsExt__Health__Health.Health.prototype.Heal = function(HealValue, parentEventsFunctionContext) {

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
if (argName === "HealValue") return HealValue;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.HealContext.GDObjectObjects3.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.HealContext.eventsList1(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.MaxHealthContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.MaxHealthContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.MaxHealthContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.MaxHealthContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.MaxHealthContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__Health__Health.Health.prototype.MaxHealthContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.MaxHealthContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxHealth()); }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.MaxHealth = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.MaxHealthContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.MaxHealthContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.MaxHealthContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setMaxHealth((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0));
}
}}

}


{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentHealth() > (gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).MaxHealth((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext.GDObjectObjects1[k] = gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setCurrentHealth((gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).MaxHealth((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOp = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthOpContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).SetMaxHealthOp((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealth = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetMaxHealthContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenRateContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenRateContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenRateContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenRateContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenRateContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenRateContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenRateContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getHealthRegenRate()); }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenRate = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenRateContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenRateContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenRateContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateOpContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateOpContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateOpContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateOpContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateOpContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateOpContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateOpContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setHealthRegenRate((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateOp = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateOpContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateOpContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateOpContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).SetHealthRegenRateOp((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRate = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenRateContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownDurationContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownDurationContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownDurationContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownDurationContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownDurationContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownDurationContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownDurationContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDamageCooldown()); }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownDuration = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownDurationContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownDurationContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownDurationContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationOpContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationOpContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationOpContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationOpContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationOpContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationOpContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationOpContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setDamageCooldown((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationOp = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationOpContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationOpContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationOpContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).SetCooldownDurationOp((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDuration = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetCooldownDurationContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenDelayContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenDelayContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenDelayContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenDelayContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenDelayContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenDelayContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenDelayContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getHealthRegenDelay()); }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenDelay = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenDelayContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenDelayContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.HealthRegenDelayContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayOpContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayOpContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayOpContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayOpContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayOpContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayOpContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayOpContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setHealthRegenDelay((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayOp = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayOpContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayOpContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayOpContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).SetHealthRegenDelayOp((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelay = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetHealthRegenDelayContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.ChanceToDodgeContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.ChanceToDodgeContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.ChanceToDodgeContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.ChanceToDodgeContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.ChanceToDodgeContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__Health__Health.Health.prototype.ChanceToDodgeContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.ChanceToDodgeContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getChanceToDodge()); }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.ChanceToDodge = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.ChanceToDodgeContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.ChanceToDodgeContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.ChanceToDodgeContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeOpContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeOpContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeOpContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeOpContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeOpContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeOpContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeOpContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setChanceToDodge((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeOp = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeOpContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeOpContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeOpContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).SetChanceToDodgeOp((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodge = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetChanceToDodgeContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.FlatDamageReductionContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.FlatDamageReductionContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.FlatDamageReductionContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.FlatDamageReductionContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.FlatDamageReductionContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__Health__Health.Health.prototype.FlatDamageReductionContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.FlatDamageReductionContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getFlatDamageReduction()); }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.FlatDamageReduction = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.FlatDamageReductionContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.FlatDamageReductionContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.FlatDamageReductionContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionOpContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionOpContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionOpContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionOpContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionOpContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionOpContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionOpContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setFlatDamageReduction((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionOp = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionOpContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionOpContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionOpContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).SetFlatDamageReductionOp((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReduction = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetFlatDamageReductionContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.PercentDamageReductionContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.PercentDamageReductionContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.PercentDamageReductionContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.PercentDamageReductionContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.PercentDamageReductionContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__Health__Health.Health.prototype.PercentDamageReductionContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.PercentDamageReductionContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getPercentDamageReduction()); }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.PercentDamageReduction = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.PercentDamageReductionContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.PercentDamageReductionContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.PercentDamageReductionContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionOpContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionOpContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionOpContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionOpContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionOpContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionOpContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionOpContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setPercentDamageReduction((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionOp = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionOpContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionOpContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionOpContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).SetPercentDamageReductionOp((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReduction = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetPercentDamageReductionContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.AllowOverHealingContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.AllowOverHealingContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.AllowOverHealingContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.AllowOverHealingContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.AllowOverHealingContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.AllowOverHealingContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.AllowOverHealingContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setAllowOverHealing(false);
}
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (typeof eventsFunctionContext !== 'undefined' ? !!eventsFunctionContext.getArgument("Value") : false);
}
if (isConditionTrue_0) {
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.AllowOverHealingContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.AllowOverHealingContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.AllowOverHealingContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setAllowOverHealing(true);
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.AllowOverHealing = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.AllowOverHealingContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.AllowOverHealingContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.AllowOverHealingContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetHitAtLeastOnceContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetHitAtLeastOnceContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetHitAtLeastOnceContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetHitAtLeastOnceContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetHitAtLeastOnceContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetHitAtLeastOnceContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetHitAtLeastOnceContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setHitAtLeastOnce(false);
}
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (typeof eventsFunctionContext !== 'undefined' ? !!eventsFunctionContext.getArgument("Value") : false);
}
if (isConditionTrue_0) {
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetHitAtLeastOnceContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetHitAtLeastOnceContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetHitAtLeastOnceContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setHitAtLeastOnce(true);
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetHitAtLeastOnce = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetHitAtLeastOnceContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetHitAtLeastOnceContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetHitAtLeastOnceContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetJustDamagedContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetJustDamagedContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetJustDamagedContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetJustDamagedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetJustDamagedContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetJustDamagedContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetJustDamagedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setIsHealthJustDamaged(false);
}
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (typeof eventsFunctionContext !== 'undefined' ? !!eventsFunctionContext.getArgument("Value") : false);
}
if (isConditionTrue_0) {
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetJustDamagedContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetJustDamagedContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetJustDamagedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setIsHealthJustDamaged(true);
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetJustDamaged = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetJustDamagedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetJustDamagedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetJustDamagedContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.TriggerDamageCooldownContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.TriggerDamageCooldownContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.TriggerDamageCooldownContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.TriggerDamageCooldownContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.TriggerDamageCooldownContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.TriggerDamageCooldownContext.GDObjectObjects1.length;i<l;++i) {
    if ( !(gdjs.evtsExt__Health__Health.Health.prototype.TriggerDamageCooldownContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).HitAtLeastOnce((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.TriggerDamageCooldownContext.GDObjectObjects1[k] = gdjs.evtsExt__Health__Health.Health.prototype.TriggerDamageCooldownContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.TriggerDamageCooldownContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.TriggerDamageCooldownContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.TriggerDamageCooldownContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.TriggerDamageCooldownContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).SetHitAtLeastOnce(true, (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.TriggerDamageCooldownContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.TriggerDamageCooldownContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.TriggerDamageCooldownContext.GDObjectObjects1[i].resetTimer("__Health.TimeSinceLastHit");
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.TriggerDamageCooldown = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.TriggerDamageCooldownContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.TriggerDamageCooldownContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.TriggerDamageCooldownContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.HitAtLeastOnceContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.HitAtLeastOnceContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.HitAtLeastOnceContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.HitAtLeastOnceContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
{
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = false; }}}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.HitAtLeastOnceContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.HitAtLeastOnceContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.HitAtLeastOnceContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getHitAtLeastOnce() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.HitAtLeastOnceContext.GDObjectObjects1[k] = gdjs.evtsExt__Health__Health.Health.prototype.HitAtLeastOnceContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.HitAtLeastOnceContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.HitAtLeastOnce = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.HitAtLeastOnceContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.HitAtLeastOnceContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.HitAtLeastOnceContext.eventsList0(runtimeScene, eventsFunctionContext);

return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__Health__Health.Health.prototype.IsJustDamagedContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.IsJustDamagedContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.IsJustDamagedContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.IsJustDamagedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = false; }}}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.IsJustDamagedContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.IsJustDamagedContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.IsJustDamagedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getIsHealthJustDamaged() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.IsJustDamagedContext.GDObjectObjects1[k] = gdjs.evtsExt__Health__Health.Health.prototype.IsJustDamagedContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.IsJustDamagedContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.IsJustDamaged = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.IsJustDamagedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.IsJustDamagedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.IsJustDamagedContext.eventsList0(runtimeScene, eventsFunctionContext);

return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__Health__Health.Health.prototype.IsJustHealedContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.IsJustHealedContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.IsJustHealedContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.IsJustHealedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = false; }}}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.IsJustHealedContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.IsJustHealedContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.IsJustHealedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getIsJustHealed() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.IsJustHealedContext.GDObjectObjects1[k] = gdjs.evtsExt__Health__Health.Health.prototype.IsJustHealedContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.IsJustHealedContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.IsJustHealed = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.IsJustHealedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.IsJustHealedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.IsJustHealedContext.eventsList0(runtimeScene, eventsFunctionContext);

return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = false; }}}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getHitAtLeastOnce() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects1[k] = gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDamageCooldown() > 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects1[k] = gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects1[i].getTimerElapsedTimeInSecondsOrNaN("__Health.TimeSinceLastHit") < (gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDamageCooldown()) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects1[k] = gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects1.length = k;
}
}
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActive = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.IsDamageCooldownActiveContext.eventsList0(runtimeScene, eventsFunctionContext);

return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownRemainingContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownRemainingContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownRemainingContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownRemainingContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = 0; }}}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownRemainingContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownRemainingContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownRemainingContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).IsDamageCooldownActive((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownRemainingContext.GDObjectObjects1[k] = gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownRemainingContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownRemainingContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownRemainingContext.GDObjectObjects1 */
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = Math.max(0, (( gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownRemainingContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownRemainingContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDamageCooldown()) - (( gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownRemainingContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownRemainingContext.GDObjectObjects1[0].getTimerElapsedTimeInSeconds("__Health.TimeSinceLastHit"))); }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownRemaining = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownRemainingContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownRemainingContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.DamageCooldownRemainingContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Health__Health.Health.prototype.IsDeadContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.IsDeadContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.IsDeadContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.IsDeadContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = false; }}}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.IsDeadContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.IsDeadContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.IsDeadContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentHealth() <= 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.IsDeadContext.GDObjectObjects1[k] = gdjs.evtsExt__Health__Health.Health.prototype.IsDeadContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.IsDeadContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.IsDead = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.IsDeadContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.IsDeadContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.IsDeadContext.eventsList0(runtimeScene, eventsFunctionContext);

return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__Health__Health.Health.prototype.TimeSinceLastHitContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.TimeSinceLastHitContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.TimeSinceLastHitContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.TimeSinceLastHitContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.TimeSinceLastHitContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__Health__Health.Health.prototype.TimeSinceLastHitContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.TimeSinceLastHitContext.GDObjectObjects1[0].getTimerElapsedTimeInSeconds("__Health.TimeSinceLastHit")); }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.TimeSinceLastHit = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.TimeSinceLastHitContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.TimeSinceLastHitContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.TimeSinceLastHitContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageTakenContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageTakenContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageTakenContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageTakenContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageTakenContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageTakenContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageTakenContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDamageToBeApplied()); }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageTaken = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageTakenContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageTakenContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageTakenContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Health__Health.Health.prototype.MaxShieldContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.MaxShieldContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.MaxShieldContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.MaxShieldContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.MaxShieldContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__Health__Health.Health.prototype.MaxShieldContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.MaxShieldContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxShieldPoints()); }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.MaxShield = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.MaxShieldContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.MaxShieldContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.MaxShieldContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldOpContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldOpContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldOpContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldOpContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldOpContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldOpContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldOpContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setMaxShieldPoints((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldOp = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldOpContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldOpContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldOpContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).SetMaxShieldOp((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShield = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldPointsContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldPointsContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldPointsContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldPointsContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldPointsContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldPointsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldPointsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).SetMaxShieldOp((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldPoints = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldPointsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldPointsContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetMaxShieldPointsContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.ShieldPointsContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.ShieldPointsContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.ShieldPointsContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.ShieldPointsContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.ShieldPointsContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__Health__Health.Health.prototype.ShieldPointsContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.ShieldPointsContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentShieldPoints()); }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.ShieldPoints = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.ShieldPointsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.ShieldPointsContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.ShieldPointsContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsOpContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsOpContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsOpContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsOpContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsOpContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsOpContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsOpContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setCurrentShieldPoints((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsOp = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsOpContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsOpContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsOpContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).SetShieldPointsOp((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPoints = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldPointsContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenRateContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenRateContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenRateContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenRateContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenRateContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenRateContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenRateContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getShieldRegenRate()); }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenRate = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenRateContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenRateContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenRateContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateOpContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateOpContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateOpContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateOpContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateOpContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateOpContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateOpContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setShieldRegenRate((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateOp = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateOpContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateOpContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateOpContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).SetShieldRegenRateOp((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRate = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenRateContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenDelayContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenDelayContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenDelayContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenDelayContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenDelayContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenDelayContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenDelayContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getShieldRegenDelay()); }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenDelay = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenDelayContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenDelayContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.ShieldRegenDelayContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayOpContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayOpContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayOpContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayOpContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayOpContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayOpContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayOpContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setShieldRegenDelay((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayOp = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayOpContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayOpContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayOpContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).SetShieldRegenDelayOp((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelay = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldRegenDelayContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.ShieldDurationContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.ShieldDurationContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.ShieldDurationContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.ShieldDurationContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.ShieldDurationContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__Health__Health.Health.prototype.ShieldDurationContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.ShieldDurationContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getShieldDuration()); }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.ShieldDuration = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.ShieldDurationContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.ShieldDurationContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.ShieldDurationContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationOpContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationOpContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationOpContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationOpContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationOpContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationOpContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationOpContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setShieldDuration((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationOp = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationOpContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationOpContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationOpContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).SetShieldDurationOp((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Value")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDuration = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldDurationContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.RenewShieldDurationContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.RenewShieldDurationContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.RenewShieldDurationContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.RenewShieldDurationContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.RenewShieldDurationContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.RenewShieldDurationContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.RenewShieldDurationContext.GDObjectObjects1[i].resetTimer("__Health.ShieldDuration");
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.RenewShieldDuration = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.RenewShieldDurationContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.RenewShieldDurationContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.RenewShieldDurationContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setCurrentShieldPoints((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("ShieldPoints")) || 0 : 0));
}
}}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getMaxShieldPoints() > 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.GDObjectObjects1[k] = gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setCurrentShieldPoints(Math.min((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("ShieldPoints")) || 0 : 0), (gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).MaxShield((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)))));
}
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (typeof eventsFunctionContext !== 'undefined' ? !!eventsFunctionContext.getArgument("RenewShieldDuration") : false);
}
if (isConditionTrue_0) {
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).RenewShieldDuration((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.ActivateShield = function(ShieldPoints, RenewShieldDuration, parentEventsFunctionContext) {

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
if (argName === "ShieldPoints") return ShieldPoints;
if (argName === "RenewShieldDuration") return RenewShieldDuration;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.ActivateShieldContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldBlockExcessDamageContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldBlockExcessDamageContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldBlockExcessDamageContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.SetShieldBlockExcessDamageContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetShieldBlockExcessDamageContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetShieldBlockExcessDamageContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetShieldBlockExcessDamageContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setBlockExcessDamage(false);
}
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (typeof eventsFunctionContext !== 'undefined' ? !!eventsFunctionContext.getArgument("Value") : false);
}
if (isConditionTrue_0) {
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.SetShieldBlockExcessDamageContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__Health__Health.Health.prototype.SetShieldBlockExcessDamageContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Health__Health.Health.prototype.SetShieldBlockExcessDamageContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setBlockExcessDamage(true);
}
}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldBlockExcessDamage = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldBlockExcessDamageContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.SetShieldBlockExcessDamageContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.SetShieldBlockExcessDamageContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__Health__Health.Health.prototype.IsShieldJustDamagedContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.IsShieldJustDamagedContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.IsShieldJustDamagedContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.IsShieldJustDamagedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = false; }}}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.IsShieldJustDamagedContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.IsShieldJustDamagedContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.IsShieldJustDamagedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getIsShieldJustDamaged() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.IsShieldJustDamagedContext.GDObjectObjects1[k] = gdjs.evtsExt__Health__Health.Health.prototype.IsShieldJustDamagedContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.IsShieldJustDamagedContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.IsShieldJustDamaged = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.IsShieldJustDamagedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.IsShieldJustDamagedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.IsShieldJustDamagedContext.eventsList0(runtimeScene, eventsFunctionContext);

return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__Health__Health.Health.prototype.IsJustDodgedContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.IsJustDodgedContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.IsJustDodgedContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.IsJustDodgedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = false; }}}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.IsJustDodgedContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.IsJustDodgedContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.IsJustDodgedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getIsJustDodged() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.IsJustDodgedContext.GDObjectObjects1[k] = gdjs.evtsExt__Health__Health.Health.prototype.IsJustDodgedContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.IsJustDodgedContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.IsJustDodged = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.IsJustDodgedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.IsJustDodgedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.IsJustDodgedContext.eventsList0(runtimeScene, eventsFunctionContext);

return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects2= [];
gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects3= [];


gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1, gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects2);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getShieldDuration() <= 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects2[k] = gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


{

/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1 */

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getShieldDuration() > 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1[k] = gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1[i].getTimerElapsedTimeInSecondsOrNaN("__Health.ShieldDuration") < (gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getShieldDuration()) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1[k] = gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1.length = k;
}
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = false; }}}

}


{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getCurrentShieldPoints() > 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1[k] = gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.eventsList0(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActive = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.GDObjectObjects3.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.IsShieldActiveContext.eventsList1(runtimeScene, eventsFunctionContext);

return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__Health__Health.Health.prototype.ShieldTimeRemainingContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.ShieldTimeRemainingContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.ShieldTimeRemainingContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.ShieldTimeRemainingContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = 0; }}}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.ShieldTimeRemainingContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__Health__Health.Health.prototype.ShieldTimeRemainingContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__Health__Health.Health.prototype.ShieldTimeRemainingContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getShieldDuration() > 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__Health__Health.Health.prototype.ShieldTimeRemainingContext.GDObjectObjects1[k] = gdjs.evtsExt__Health__Health.Health.prototype.ShieldTimeRemainingContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__Health__Health.Health.prototype.ShieldTimeRemainingContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__Health__Health.Health.prototype.ShieldTimeRemainingContext.GDObjectObjects1 */
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = Math.max(0, (( gdjs.evtsExt__Health__Health.Health.prototype.ShieldTimeRemainingContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.ShieldTimeRemainingContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getShieldDuration()) - (( gdjs.evtsExt__Health__Health.Health.prototype.ShieldTimeRemainingContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.ShieldTimeRemainingContext.GDObjectObjects1[0].getTimerElapsedTimeInSeconds("__Health.ShieldDuration"))); }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.ShieldTimeRemaining = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.ShieldTimeRemainingContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.ShieldTimeRemainingContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.ShieldTimeRemainingContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageToShieldContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageToShieldContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageToShieldContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageToShieldContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageToShieldContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageToShieldContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageToShieldContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getShieldDamageTaken()); }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageToShield = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageToShieldContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageToShieldContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.PreviousDamageToShieldContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Health__Health.Health.prototype.PreviousHealAmountContext = {};
gdjs.evtsExt__Health__Health.Health.prototype.PreviousHealAmountContext.GDObjectObjects1= [];
gdjs.evtsExt__Health__Health.Health.prototype.PreviousHealAmountContext.GDObjectObjects2= [];


gdjs.evtsExt__Health__Health.Health.prototype.PreviousHealAmountContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Health__Health.Health.prototype.PreviousHealAmountContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__Health__Health.Health.prototype.PreviousHealAmountContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Health__Health.Health.prototype.PreviousHealAmountContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getHealToBeApplied()); }}}

}


};

gdjs.evtsExt__Health__Health.Health.prototype.PreviousHealAmount = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Health__Health.Health.prototype.PreviousHealAmountContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Health__Health.Health.prototype.PreviousHealAmountContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Health__Health.Health.prototype.PreviousHealAmountContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}


gdjs.registerBehavior("Health::Health", gdjs.evtsExt__Health__Health.Health);
