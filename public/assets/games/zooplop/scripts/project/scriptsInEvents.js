


const scriptsInEvents = {

	async Game_Event10_Act4(runtime, localVars)
	{
		self.addEventListener('keydown', ev => {
		    if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
		        ev.preventDefault();
		    }
		});
		self.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });
	},

	async Game_Event10_Act6(runtime, localVars)
	{
		c3canvas.style.webkitUserSelect=c3canvas.style.msUserSelect=c3canvas.style.userSelect="none";
	},

	async Game_Event65(runtime, localVars)
	{
		var R = localVars.Red
		var G = localVars.Green
		var B = localVars.Blue
		document.body.style.background = 'rgb(' + R + ',' + G + ',' + B + ')';
		document.documentElement.style.background = 'rgb(' + R + ',' + G + ',' + B + ')';
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

