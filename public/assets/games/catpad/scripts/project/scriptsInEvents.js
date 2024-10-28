


const scriptsInEvents = {

	async Shared_Event166_Act4(runtime, localVars)
	{
		self.addEventListener('keydown', ev => {
		    if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
		        ev.preventDefault();
		    }
		});
		self.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });
	},

	async Shared_Event166_Act6(runtime, localVars)
	{
		c3canvas.style.webkitUserSelect=c3canvas.style.msUserSelect=c3canvas.style.userSelect="none";
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

