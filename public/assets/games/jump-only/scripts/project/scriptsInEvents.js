


const scriptsInEvents = {

	async E_gameplay_Event78(runtime, localVars)
	{
		let railAgent = runtime.objects.BehaviorRail.getFirstPickedInstance();
		
		let tween = railAgent.behaviors.Tween.startTween("value", 1, railAgent.instVars.Duration, railAgent.instVars.Ease, {
			startValue: 0,
			pingPong: railAgent.instVars.PingPong,
			loop: true,
			tags: ["Follow"]
		});
	},

	async E_loading_Event14_Act1(runtime, localVars)
	{
		runtime.goToLayout(localVars.Index)
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

