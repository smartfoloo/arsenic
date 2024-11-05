class Logo{
	constructor(...args){
		this.init(...args)
	}
	init(){
		this.canvas = document.getElementById("logo")
		this.ctx = this.canvas.getContext("2d")
		var pathSvg = failedTests.indexOf("Path2D SVG") === -1
		this.pathSvg = null
		this.symbolFont = "TnT, Meiryo, sans-serif"
		this.symbols = gameConfig.game_logo || []
		
		if(this.symbols.length === 0){
			var ctx = this.ctx
			ctx.save()
			ctx.font = "100px " + this.symbolFont
			var totalWidth = 0
			var gameSplit = gameConfig.game_name_full.split("").map(text => {
				var width = ctx.measureText(text).width
				totalWidth += width
				return {
					width: width,
					text: text
				}
			})
			ctx.restore()
			
			var gameSize = gameSplit.length
			var letterScale = Math.max(2, Math.min(3.5, 14 / gameSize))
			var letterSize = (1170 - 44) / totalWidth
			var x = 22
			gameSplit.forEach((letter, i) => {
				var y = 17 - (1 - Math.abs(i / (gameSize - 1) * 2 - 1)) * 11
				this.symbols.unshift({
					x: x,
					y: y,
					scale: letterScale,
					text: letter.text
				})
				x += letter.width / letterScale * letterSize
			})
		}
		this.symbols.forEach(symbol => {
			if(symbol.vectors){
				symbol.path = new Path2D(vectors[symbol.vectors])
				if(!vectors[symbol.vectors]){
					this.pathSvg = false
				}else if(this.pathSvg === null){
					this.pathSvg = true
				}
				if(symbol.hasShadow){
					symbol.shadow = new Path2D(vectors[symbol.vectors + "Shadow"])
				}
			}
		})
		pageEvents.add(window, "resize", this.update.bind(this))
	}
	updateSubtitle(){
		this.subtitleGradient = ["#df600d", "#d8446f", "#b2147b", "#428ac2", "#1f9099"]
		this.subtitle = []
		this.subtitleW = 0
		var index = 0
		var latinLowercase = /[a-z]/
		var gameName = plugins.getLocalTitle(gameConfig.game_name_full, gameConfig.game_name_lang)
		for(var i = 0; i < gameName.length; i++){
			var letter = gameName[i]
			var width = 57
			if(letter === "ェ"){
				width = 40
			}else if(letter === " "){
				width = 20
			}else if(letter === "i"){
				width = 22
			}else if(letter === "T"){
				width = 30
			}else if(latinLowercase.test(letter)){
				width = 38
			}
			this.subtitle.push({
				letter: letter,
				x: this.subtitleW + width / 2,
				index: letter === " " ? index : index++
			})
			this.subtitleW += width
		}
		this.update()
	}
	update(){
		var ctx = this.ctx
		ctx.save()
		
		this.width = 1170
		this.height = 390
		var pixelRatio = window.devicePixelRatio || 1
		var winW = this.canvas.offsetWidth * pixelRatio
		var winH = this.canvas.offsetHeight * pixelRatio
		this.canvas.width = Math.max(1, winW)
		this.canvas.height = Math.max(1, winH)
		ctx.scale(winW / this.width, winH / this.height)
		
		ctx.lineJoin = "round"
		ctx.miterLimit = 1
		ctx.textBaseline = "top"
		ctx.textAlign = "center"
		if(!this.pathSvg){
			ctx.font = "100px " + this.symbolFont
		}
		
		for(var i = 0; i < this.symbols.length; i++){
			ctx.strokeStyle = "#3f0406"
			ctx.lineWidth = 13.5
			this.drawSymbol(this.symbols[i], "stroke", 4)
		}
		ctx.font = this.bold(strings.font) + "55px " + strings.font
		this.subtitleIterate((letter, x) => {
			ctx.lineWidth = strings.id === "en" ? 19 : 18.5
			ctx.strokeStyle = "#3f0406"
			ctx.strokeText(letter, x, 315)
		})
		if(this.pathSvg){
			ctx.fillStyle = "#3f0406"
			ctx.fillRect(400, 180, 30, 50)
		}else{
			ctx.font = "100px " + this.symbolFont
		}
		var drawSquares = false
		for(var i = 0; i < this.symbols.length; i++){
			var symbol = this.symbols[i]
			ctx.strokeStyle = "#7c361e"
			ctx.lineWidth = 13.5
			this.drawSymbol(symbol, "stroke")
			ctx.strokeStyle = "#fff"
			ctx.lineWidth = 7.5
			this.drawSymbol(symbol, "stroke")
			if(this.pathSvg && symbol.path){
				var grd = ctx.createLinearGradient(0, 55 - symbol.y, 0, 95 - symbol.y)
				grd.addColorStop(0, "#a41f1e")
				grd.addColorStop(1, "#a86a29")
				ctx.fillStyle = grd
				this.drawSymbol(symbol, "fill")
				ctx.save()
				ctx.scale(symbol.scale ? symbol.scale : 3.2, 3.2)
				ctx.translate(symbol.x, symbol.y)
				ctx.clip(symbol.path)
				drawSquares = true
			}
			grd = ctx.createLinearGradient(0, 55 - symbol.y, 0, 95 - symbol.y)
			grd.addColorStop(0, "#d80e11")
			grd.addColorStop(1, "#e08f19")
			ctx.fillStyle = grd
			if(this.pathSvg && (symbol.shadow || symbol.path)){
				ctx.translate(3, 2)
				ctx.fill(symbol.shadow || symbol.path)
				ctx.restore()
			}else{
				this.drawSymbol(symbol, "fill")
			}
		}
		if(!this.pathSvg){
			ctx.font = this.bold(strings.font) + "55px " + strings.font
		}else if(drawSquares){
			ctx.fillStyle = "#fff"
			ctx.fillRect(382, 85, 30, 15)
			ctx.fillRect(402, 145, 15, 15)
		}
		
		this.subtitleIterate((letter, x) => {
			ctx.lineWidth = strings.id === "en" ? 19 : 18.5
			ctx.strokeStyle = "#7c361e"
			ctx.strokeText(letter, x, 305)
		})
		this.subtitleIterate((letter, x, i) => {
			ctx.lineWidth = strings.id === "en" ? 11 : 9.5
			ctx.strokeStyle = this.getSubtitleGradient(i)
			ctx.fillStyle = "#fff"
			ctx.strokeText(letter, x, 305)
			ctx.fillText(letter, x, 305)
		})
		
		ctx.restore()
	}
	drawSymbol(symbol, action, y){
		var ctx = this.ctx
		ctx.save()
		ctx.scale(symbol.scale ? symbol.scale : (((!this.pathSvg || !symbol.path) && symbol.scaleAlt) ? symbol.scaleAlt : 3.2), 3.2)
		ctx.translate(symbol.x, symbol.y + (y || 0))
		if(this.pathSvg && symbol.path){
			ctx[action](symbol.path)
		}else{
			ctx[action + "Text"](symbol.text, 30 + (symbol.xAlt || 0), -4 + (symbol.yAlt || 0))
		}
		ctx.restore()
	}
	subtitleIterate(func){
		for(var i = this.subtitle.length; i--;){
			var subtitleObj = this.subtitle[i]
			var x = (this.width - this.subtitleW) / 2 + subtitleObj.x
			func(subtitleObj.letter, x, subtitleObj.index)
		}
	}
	getSubtitleGradient(index){
		var sign = 1
		var position = 0
		var length = this.subtitleGradient.length - 1
		while(index >= 0){
			if(sign === 1){
				position = index % length
			}else{
				position = length - (index % length)
			}
			sign *= -1
			index -= length
		}
		return this.subtitleGradient[position]
	}
	bold(font){
		return font === "Microsoft YaHei, sans-serif" ? "bold " : ""
	}
	clean(){
		pageEvents.remove(window, "resize")
		delete this.symbols
		delete this.ctx
		delete this.canvas
	}
}
