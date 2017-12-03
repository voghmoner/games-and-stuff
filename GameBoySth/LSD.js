function Game(){
	this.points = 0
	this.grid = []
	this.numX = 128
	this.numY = 64
	this.background = '#000000'
	this.boxSize = 20
	this.emptyColor = '#222222'
	this.boxGap = 4
	this.timeSum = 0
	this.figureColors = [
		'#305899', 
		'#57427a',
		'#8c1a1a',
		'#ba6114',
		'#c4b61d',
		'#89ad3c',
		'#328f91'
	]
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
	if(this.timeSum > 200){
		this.timeSum = this.timeSum % 200	
 		this.waterfall()
 	}
	this.draw()
}

Game.prototype.waterfall = function(){
	for(var i = 0; i < this.numX; i++){
		for(var j = this.numY - 1; j > 0; j--){
			this.grid[i][j].full = this.grid[i][j - 1].full
			this.grid[i][j].color = this.grid[i][j - 1].color
		}
		this.grid[i][0].full = false
		if(Math.random() < 0.1){
			this.grid[i][0].full = true
			this.grid[i][0].color = this.figureColors[Math.floor( Math.random() * this.figureColors.length)]
		}
	}
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

	for (var i = 0; i < this.numX; i++){
		for(var j = 0; j < this.numY; j++){
			if(this.grid[i][j].full){
				ctx.fillStyle = this.grid[i][j].color
				this.drawFrontBox(i,j)
			}
		}
	}
}

Game.prototype.drawBox = function(x, y){
	ctx.fillRect(this.boxGap + x * (this.boxSize + this.boxGap),this.boxGap + y * (this.boxSize + this.boxGap), this.boxSize, this.boxSize)
}

Game.prototype.drawFrontBox = function(x, y){
	ctx.fillRect(- 100 + this.boxGap + x * (this.boxSize + this.boxGap) * 2,- 100 + this.boxGap + y * (this.boxSize + this.boxGap) * 2, this.boxSize * 1.5, this.boxSize * 1.5)
}

game = new Game()
game.newGrid()

checkKey = function(e) {

    e = e || window.event;

    if (e.keyCode == '40') {
        // down arrow

 		game.waterfall()

		game.timeSum = 0
    }
}
document.onkeydown = checkKey