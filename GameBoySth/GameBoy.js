function Game(){
	this.points = 0
	this.grid = []
	this.numX = 10
	this.numY = 16
	this.background = '#000000'
	this.boxSize = 20
	this.emptyColor = '#222222'
	this.boxGap = 4
	this.timeSum = 0
	this.noFigure = true
	this.over = false
	this.figureColors = [
		'#CC00CC', 
		'#CCE5FF',
		'#7F00FF',
		'#FFFF00',
		'#FF9933',
		'#FF8000',
		'#009900'
	]
	this.figures = ['O','T', 'I', 'Z', 'S', 'L', 'J']
	this.nextFigure = new Figure(
		this.figureColors[Math.floor( Math.random() * this.figureColors.length)],
		this.figures[Math.floor( Math.random() * this.figures.length)],
		this.numX / 2, 0)
}

function Box(){
	this.full = false
	this.color = null
}

Game.prototype.newGrid = function(){
	this.grid = []
	for (var i = 0; i < this.numX; i++){
		this.grid.push([])
		for(var j = 0; j < this.numY; j++){
			this.grid[i].push(new Box())
		}
	}
}

Game.prototype.update = function(delta_t){
	this.timeSum += delta_t
	if(this.timeSum > 1000 && !this.over){
		this.timeSum = this.timeSum % 1000
 		if(this.noFigure){
 			this.createFigure()
 		}
 		else{
 			this.dropFigure()
 		}
 	}
	this.draw()
}

Game.prototype.createFigure = function(){
	this.figure = this.nextFigure
	this.nextFigure = new Figure(
		this.figureColors[Math.floor( Math.random() * this.figureColors.length)],
		this.figures[Math.floor( Math.random() * this.figures.length)],
		this.numX / 2, 0)
	this.noFigure = false
	if(!this.figureCanMove(0, 0)){
		this.over = true
		this.noFigure = true
	}
}

Game.prototype.dropFigure = function(){
	if(!this.moveFigure(0, 1))
	{
		this.figure.eachPart(
			(function(x,y){
				this.grid[x][y].full = true
				this.grid[x][y].color = this.figure.color
			}),
			this
		)
		this.noFigure = true	
		this.checkGrid()
		this.createFigure()
	}
}

Game.prototype.checkGrid = function(){
	for(var i = 0; i < this.numY; i++){
		if(this.lineFull(i)){
			this.deleteLine(i)
		}
	}
}

Game.prototype.lineFull = function(y){
	for(var i = 0; i < this.numX; i++){
		if(!this.grid[i][y].full){
			return false
		}
	}
	return true
}

Game.prototype.deleteLine = function(y){
	this.points += 1000
	for(var i = 0; i < this.numX; i++){
		for(var j = y; j > 0; j--){
			this.grid[i][j].full = this.grid[i][j - 1].full
			this.grid[i][j].color = this.grid[i][j - 1].color
		}
		this.grid[i][0].full = false
	}
}

Game.prototype.moveFigure = function(dx, dy){
	if(this.noFigure){
		return false
	}
	if(this.figureCanMove(dx, dy)){
		this.figure.x += dx
		this.figure.y += dy
		return true
	}
	return false
}

Game.prototype.figureCanMove = function(dx, dy){
	return this.figure.eachPart (
		(function(x,y){
			if(y + dy >= this.numY || y + dy < 0){
				return false
			}
			if(x + dx >= this.numX || x + dx < 0){
				return false
			}
			if(this.grid[x + dx][y + dy].full){
				return false
			}
		}),
		this
	)
}

Game.prototype.rotate = function(clockWise){
	if(this.noFigure){
		return false
	}
	if(this.figure.parts.length == 1){
		return true
	}
	this.figure.rot = (this.figure.rot + (clockWise ? 1 : -1) + this.figure.parts.length) % this.figure.parts.length
	if(!this.figureCanMove(0, 0)){
		this.rotate(!clockWise)
	}
}

Game.prototype.drawBox = function(x, y){
	ctx.fillRect(this.boxGap + x * (this.boxSize + this.boxGap),this.boxGap + y * (this.boxSize + this.boxGap), this.boxSize, this.boxSize)
}

Game.prototype.draw = function(){
	ctx.fillStyle = this.background
	ctx.fillRect(0, 0, width, height)

	//drawBoxes
	for (var i = 0; i < this.numX; i++){
		for(var j = 0; j < this.numY; j++){
			if(!this.grid[i][j].full){
				ctx.fillStyle = this.emptyColor
			}
			else{
				ctx.fillStyle = this.grid[i][j].color
			}
			this.drawBox(i,j)
		}
	}

	//drawFigure
	if(!this.noFigure){
		ctx.fillStyle = this.figure.color
		this.figure.eachPart(this.drawBox, this)

	}

	//drawNextFigure
	ctx.fillStyle = this.nextFigure.color
	this.nextFigure.eachPart(
		(function(x,y){
			this.drawBox(x + this.numX, y + 4)
		}),
		this
	)

	ctx.fillStyle = '#FFFFFF'
	ctx.fillText('Points: ' + String(this.points), 10, 50)

	if(this.over){
		ctx.fillText('GAME OVER ', 10, 90)
	}

}

function Figure(color, form, x, y){
	this.x = x
	this.y = y
	this.color = color
	this.form = form
	this.parts = []
	switch(form){
		case 'O':
			this.parts.push([
				0,0,0,0,
				0,1,1,0,
				0,1,1,0,
				0,0,0,0
				])
			break
		case 'T':
			this.parts.push([
				0,0,0,0,
				0,0,1,0,
				0,1,1,1,
				0,0,0,0
				])
			this.parts.push([
				0,0,0,0,
				0,0,1,0,
				0,0,1,1,
				0,0,1,0
				])
			this.parts.push([
				0,0,0,0,
				0,0,0,0,
				0,1,1,1,
				0,0,1,0
				])
			this.parts.push([
				0,0,0,0,
				0,0,1,0,
				0,1,1,0,
				0,0,1,0
				])
			break
		case 'J':
			this.parts.push([
				0,0,0,0,
				0,0,1,0,
				0,0,1,0,
				0,1,1,0
				])
			this.parts.push([
				0,0,0,0,
				0,1,0,0,
				0,1,1,1,
				0,0,0,0
				])
			this.parts.push([
				0,0,0,0,
				0,0,1,1,
				0,0,1,0,
				0,0,1,0
				])
			this.parts.push([
				0,0,0,0,
				0,0,0,0,
				0,1,1,1,
				0,0,0,1
				])
			break
		case 'L':
			this.parts.push([
				0,0,0,0,
				0,0,1,0,
				0,0,1,0,
				0,0,1,1
				])
			this.parts.push([
				0,0,0,0,
				0,0,0,0,
				0,1,1,1,
				0,1,0,0
				])
			this.parts.push([
				0,0,0,0,
				0,1,1,0,
				0,0,1,0,
				0,0,1,0
				])
			this.parts.push([
				0,0,0,0,
				0,0,0,1,
				0,1,1,1,
				0,0,0,0
				])
			break
		case 'I':
			this.parts.push([
				0,0,1,0,
				0,0,1,0,
				0,0,1,0,
				0,0,1,0
				])
			this.parts.push([
				0,0,0,0,
				0,0,0,0,
				1,1,1,1,
				0,0,0,0
				])
			break
		case 'Z':
			this.parts.push([
				0,0,0,0,
				0,1,1,0,
				0,0,1,1,
				0,0,0,0
				])
			this.parts.push([
				0,0,0,0,
				0,0,0,1,
				0,0,1,1,
				0,0,1,0
				])
			break
		case 'S':
			this.parts.push([
				0,0,0,0,
				0,0,1,1,
				0,1,1,0,
				0,0,0,0
				])
			this.parts.push([
				0,0,0,0,
				0,1,0,0,
				0,1,1,0,
				0,0,1,0
				])
			break

	}
	this.rot = Math.floor( Math.random() * this.parts.length)

	//raiseUp
	this.y -= this.eachPart (
		(function(x,y){
			return y
		})
	)

}

Figure.prototype.eachPart = function(callback, context){
	if(typeof context === "undefined"){
		var context = this
	}
	for(var i = 0; i < 16; i++){
		if(this.parts[this.rot][i] == 1){
			var x = i % 4 + this.x
			var y = Math.floor(i / 4) + this.y
			if(callback.call(context,x, y) !== undefined){
				return callback.call(context,x, y)
			}
		}
	}
	return true //iterates without return
}


tetris = new Game()
tetris.newGrid()


checkKey = function(e) {

    e = e || window.event;

    if (e.keyCode == '37') {
        // left arrow
        tetris.moveFigure(-1, 0)
    }
    else if (e.keyCode == '38') {
        // up arrow
        tetris.rotate(true)
    }
    else if (e.keyCode == '39') {
        // right arrow
        tetris.moveFigure(1, 0)
    }
    else if (e.keyCode == '40') {
        // down arrow
        if(tetris.moveFigure(0, 1)){
			tetris.timeSum = 0
        }
    }
}
document.onkeydown = checkKey