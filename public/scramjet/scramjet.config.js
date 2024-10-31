(() => {
	// webpackBootstrap
	var __webpack_exports__ = {};
	if (!self.$scramjet) {
		//@ts-expect-error really dumb workaround
		self.$scramjet = {};
	}
	self.$scramjet.config = {
    prefix: '/service/scramjet/',
		codec: self.$scramjet.codecs.xor,
		config: '/scramjet/scramjet.config.js',
    shared: '/scramjet/scramjet.shared.js',
    worker: '/scramjet/scramjet.worker.js',
    client: '/scramjet/scramjet.client.js',
    codecs: '/scramjet/scramjet.codecs.js'
	};
})();
//# sourceMappingURL=scramjet.config.js.map
