


const scriptsInEvents = {

	async Game_Event20_Act4(runtime, localVars)
	{
		self.addEventListener('keydown', ev => {
		    if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
		        ev.preventDefault();
		    }
		});
		self.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });
	},

	async Game_Event20_Act6(runtime, localVars)
	{
		c3canvas.style.webkitUserSelect=c3canvas.style.msUserSelect=c3canvas.style.userSelect="none";
	},

	async Sdk_Event40_Act1(runtime, localVars)
	{
		PokiSDK.customEvent(localVars.Game, localVars.Segment, { label: localVars.Level, value: localVars.Value });
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

