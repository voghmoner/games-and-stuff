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
	this.over = false
	this.figureColors = [
		'#305899', 
		'#57427a',
		'#8c1a1a',
		'#ba6114',
		'#c4b61d',
		'#89ad3c',
		'#328f91'
	]
	this.gunX = Math.floor(this.numX / 2)
	this.gunColor = '#FFFFFF'
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
 		this.waterfall()
 		this.fillTop()
 	}
	this.draw()
}

Game.prototype.waterfall = function(){
	for(var i = 0; i < this.numX; i++){
		if(this.grid[i][this.numY - 2].full){
			this.over = true
		}
		for(var j = this.numY - 1; j > 0; j--){
			this.grid[i][j].full = this.grid[i][j - 1].full
			this.grid[i][j].color = this.grid[i][j - 1].color
		}
		this.grid[i][0].full = false
	}
}

Game.prototype.fillTop = function(){
	for(var i = 0; i < this.numX; i++){
		if(Math.random() < 0.5){
			this.grid[i][0].full = true
			this.grid[i][0].color = this.figureColors[Math.floor( Math.random() * this.figureColors.length)]
		}
	}
}

Game.prototype.moveGun = function(dx){
	if(this.gunX + dx >= this.numX || this.gunX + dx < 0){
		return false
	}
	this.gunX += dx
}

Game.prototype.shoot = function(){
	for(var i = this.numY - 2; i >= 0; i--){
		if(this.grid[this.gunX][i].full){
			this.grid[this.gunX][i].full = false
			this.points += 10
			return
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

	ctx.fillStyle = this.gunColor
	this.drawBox(this.gunX, this.numY - 1)
	
	ctx.fillStyle = '#FFFFFF'
	ctx.fillText('Points: ' + String(this.points), 10, 50)

	if(this.over){
		ctx.fillText('GAME OVER ', 10, 90)
	}

}

Game.prototype.drawBox = function(x, y){
	ctx.fillRect(this.boxGap + x * (this.boxSize + this.boxGap),this.boxGap + y * (this.boxSize + this.boxGap), this.boxSize, this.boxSize)
}

game = new Game()
game.newGrid()

checkKey = function(e) {

    e = e || window.event;
    if(game.over){
    	return 
    }

    if (e.keyCode == '37') {
        // left arrow
        game.moveGun(-1)
    }
    else if (e.keyCode == '38') {
        // up arrow
        game.shoot()
    }
    else if (e.keyCode == '39') {
        // right arrow
        game.moveGun(1)
    }
    else if (e.keyCode == '40') {
        // down arrow

 		game.waterfall()
 		game.fillTop()

		game.timeSum = 0
    }
}
document.onkeydown = checkKey