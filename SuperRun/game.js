var canvas, context, entities, Entity, _draw, preferredFramerate, xOffset, crFramerate, framesPassedSinceLastReset, lastResetTime, width, height, level, getLevel, crLevel, nextLevel;
alert("While the game loads, lets explain the idea!\n\nThe character automatically runs, jumps over small blocks, and climbs climbable cliffsides. Click to jump higher. You have a double jump ability in this game. Good luck.");
function init(){
	canvas = document.querySelector('canvas#game') || document.createElement('canvas');
	canvas.width = width = 240;
	canvas.height = height = 360;
	context = canvas.getContext('2d');
	entities = [];
	preferredFramerate = 35;
	crFramerate = preferredFramerate;
	framesPassedSinceLastReset = 0;
	lastResetTime = new Date().getTime();
	gameWin = function(){
		//
	};
	getLevel = function(levelID){
		var xmlHttp = new XMLHttpRequest();
			xmlHttp.open("GET", 'levels/'+levelID+'.slr?'+new Date().getTime(), false);
			xmlHttp.send(null);
			if(xmlHttp.status==404)gameWin();
		if(xmlHttp.status==200)return eval(xmlHttp.responseText);
		entities[0].velocityY/=5;
		return [["You win!\n\nCredits: \n - John J. (Programmer)\n - Clayton L. (idea)"
				  ,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,1,0,0,1,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,1,0,1,0,1,1,1,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
	}
	Entity = function(x, y, size, isPlayer){
		this.x = x || width / 2;
		this.y = y || height / 2;
		this.isPlayer = isPlayer || false;
		this.velocityX = 0;
		this.velocityY = 0.1;
		this.size = size || 32;
		this.mass = this.size * this.size / 512;
		this.updatePosition = function(){
			if(this.check('y')) this.velocityY+=0.1*this.mass;
			else {this.jumped = false;this.velocityY=this.velocityY<0?this.velocityY:0;}
			if(this.check('x'))this.x+=this.velocityX;
			this.y+=this.velocityY;
		};
		this.check = function(a){
			var grid = {};
			grid.x = (Math.floor((width/2+this.x-this.size/2) / (height/level.length)));
			grid.y = (Math.floor(this.y / (height/level.length)));
			grid.y<0?grid.y=0:grid.y>level.length?grid.y=level.length:0;
			if(grid.y>level.length||grid.y<0)this.die();
			if(a=='y'){
				if(this.y>=level.length*(height/level.length)) this.die();
				if(this.y<0){
					this.y = 1;
				};
				if(!level[(grid.y+1)%level.length][grid.x]) return 1;
			} else if(a=='x'){
				if(grid.x>=level[0].length-3) return nextLevel()||1;
				if(!level[grid.y%level.length][(grid.x+1)%level[0].length]) {this.velocityX = 4;return 1};
				if(!level[grid.y-1%level.length][(grid.x+1)%level[0].length]) {this.velocityY=-5;this.velocityX=-0.1;return 1;}
			}
		};
		this.die = function(){
			crLevel--;
			nextLevel();
		};
		this.show = function(){
			context.fillStyle = 'red';
			context.fillRect(this.x - (this.size / 2), this.y - (this.size / 2), this.size, this.size);
		};
		this.special = isPlayer;
		if(this.special) {
			this.show = function(){
				context.fillStyle = 'red';
				xOffset = this.x;
				context.fillRect(width / 3, this.y - this.size/2, this.size, this.size)
			};
			this.x = 0; this.y = height*0.6;
			this.velocityX=5;
		};
	};
	entities.push(new Entity(undefined, undefined, 48, true))
	_draw = function(){
		var i = document.querySelectorAll('.fps');
		for (var j = 0; j < i.length; j++){
			i[j].innerHTML = crFramerate;
		}
		context.clearRect(0,0,width,height)
		framesPassedSinceLastReset ++;
		if(new Date().getTime()>lastResetTime+999) {
			crFramerate = framesPassedSinceLastReset;
			lastResetTime = new Date().getTime();
			framesPassedSinceLastReset = 0;
		}
		for (var i = entities.length - 1; i >= 0; i--) {
			entities[i].updatePosition(entities[i].show());
		}
		for (var y = level.length - 1; y >= 0; y--) {
			for(var x = level[y].length - 1; x >= 0; x--){
				var t = level[y||1][x];
				if(t==0) context.fillStyle = 'rgba(0,0,0,0)';
				if(t==1) context.fillStyle = '#530';
				if(t==2) context.fillStyle = 'green';
				if(t==3) context.fillStyle = '#037';
				if(t==4) context.fillStyle = 'darkgreen';
				if(t==5) context.fillStyle = '#530';
				// if(t==5) context.fillStyle = 'rgba(0,0,0,0)';
				context.fillRect((x*(height/level.length))-xOffset,y*(height/level.length),(height/level.length),(height/level.length))
			}
		}
		setTimeout(_draw, 1000/preferredFramerate-1);
	};
	crLevel = 0;
	nextLevel = function(){
		crLevel++;
		level = getLevel(crLevel);
		alert(level[0][0]);
		entities = [];
		entities[0]=new Entity(undefined,undefined,48,true);
		for(var i = 1; i < level[0].length; i++){
			switch(level[0][i]){
				case 0: return;
				case 1: entities.push(new Entity((height/level.length)*i, 32, 16, false));
			};
		};
	};
	nextLevel();
	setTimeout(_draw, 250);
	canvas.onclick = function(e){
		e.preventDefault();
		if(!entities[0].jumped)entities[0].velocityY = -8;
		entities[0].jumped = true;
	};
	canvas.ontouchstart = canvas.ontouchdown = canvas.onclick;
};

window.onload = init;
