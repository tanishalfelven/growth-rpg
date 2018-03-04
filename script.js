"use strict";

var GAME = {
	halt: false,
	bindInput: function(){
		// While a key is pressed down, return true
		window.addEventListener('keydown', function(e){
			GAME.keys[e.keyCode] = true;
		});
		window.addEventListener('keyup', function(e){
			GAME.keys[e.keyCode] = false;
		});
		window.addEventListener('mousemove', function(e){
			var rect = GAME.canvas.getBoundingClientRect();
			GAME.mouse_pos.x = e.clientX - rect.left;
			GAME.mouse_pos.y = e.clientY - rect.top;
		});
		window.addEventListener('mousedown', function(e){
			var rect = GAME.canvas.getBoundingClientRect();
			GAME.mouse_click_pos.x = e.clientX - rect.left;
			GAME.mouse_click_pos.y = e.clientY - rect.top;
			GAME.mouse_click_pos.isDown = true;
		});
		window.addEventListener('mouseup', function(e){
			var rect = GAME.canvas.getBoundingClientRect();
			GAME.mouse_click_pos.x = e.clientX - rect.left;
			GAME.mouse_click_pos.y = e.clientY - rect.top;
			GAME.mouse_click_pos.isDown = false;
		});
	},
	handleInput: function(){
		if(this.typewriter.isDisplaying){
			this.typewriter.handleInput();
		}else{
			player.handleInput();
			UI.handleInput();
		}
	},
	update: function(){
		if(this.typewriter.isDisplaying)
			this.typewriter.update();
		else {
			GAME.map.update();
			for(var gameobj in this.objects)
				this.objects[gameobj].update();
			UI.update();
		}

		this.camera.update();
	},
	render: function(){
		GAME.map.render();
		for(var gameobj in this.objects)
			this.objects[gameobj].render();

		this.camera.render();

		if(this.typewriter.isDisplaying)
			this.typewriter.render();
		else {
			UI.render();
		}
	},
	gameLoop: function(now){
		if (!GAME.halt)
			window.requestAnimationFrame(GAME.gameLoop);

		GAME.delta = (now - GAME.lastTime) / 1000;

		if(GAME.delta){
			GAME.handleInput();
			GAME.update();
			GAME.render();
		}

		GAME.lastTime = now;
	},
	draw: {
		fillBox: function(x, y, width, height, color){
			GAME.camera.ctx.fillStyle = color;
			GAME.camera.ctx.fillRect(x - GAME.camera.x, y - GAME.camera.y, width, height);
		},
		box: function(x, y, width, height, color, lineWidth){
			GAME.camera.ctx.lineWidth = lineWidth.toString();
			GAME.camera.ctx.strokeStyle = color;
			GAME.camera.ctx.beginPath();
			GAME.camera.ctx.rect(x - GAME.camera.x, y - GAME.camera.y, width, height);
			GAME.camera.ctx.stroke();
		},
		image: function(image, x, y, width, height){
			GAME.camera.ctx.drawImage(image, x - GAME.camera.x, y - GAME.camera.y, width, height);
		},
		sprite: function(p, x, y, width, height) {
			GAME.camera.ctx.drawImage(GAME.spritesheet, p.x*10, p.y*10, 10, 10, x - GAME.camera.x, y - GAME.camera.y, width, height);
		},
		customSprite: function(sx, sy, sw, sh, x, y, width, height) {
			GAME.camera.ctx.drawImage(GAME.spritesheet, sx, sy, sw, sh, x - GAME.camera.x, y - GAME.camera.y, width, height);
		}
	},
	drawUI: {
		fillBox: function(x, y, width, height, color){
			GAME.ctx.fillStyle = color;
			GAME.ctx.fillRect(x, y, width, height);
		},
		box: function(x, y, width, height, color, lineWidth){
			GAME.ctx.lineWidth = lineWidth.toString();
			GAME.ctx.strokeStyle = color;
			GAME.ctx.beginPath();
			GAME.ctx.rect(x, y, width, height);
			GAME.ctx.stroke();
		},
		image: function(image, x, y, width, height){
			GAME.ctx.drawImage(image, x, y, width, height);
		},
		sprite: function(p, x, y, width, height) {
			GAME.ctx.drawImage(GAME.spritesheet, p.x*10, p.y*10, 10, 10, x, y, width, height);
		},
		text: function(text, x, y, color){
			GAME.ctx.fillStyle = color;
			GAME.ctx.fillText(text, x, y);
		},
		centerText: function(text, x, y, color){
			GAME.ctx.textAlign="center";
			this.text(text, x, y, color);
			GAME.ctx.textAlign="start";
		}
	},
	camera: {
		init: function(){
			this.canvas = document.createElement('canvas');
			this.canvas.width = 800;
			this.canvas.height = 800;
			this.ctx = this.canvas.getContext('2d');
			this.ctx.font = '20px Press-Start-2P';
			this.ctx.textBaseline = 'top';
			this.ctx.imageSmoothingEnabled = false;

			GAME.spritesheet = new Image();
			GAME.spritesheet.src="res/growth-spritesheet.png";

			this.x = player.x - canvas.height/2;
			this.y = player.y - canvas.width/2;
		},
		reset: function() {
			this.x = player.x - canvas.height/2;
			this.y = player.y - canvas.width/2;
		},
		update: function(){
			var rectX = 400;
			var rectY = 400;
			var speed = player.speed;
			if(player.x - this.x > (canvas.width/2) + (rectX/2))
				this.x += speed * GAME.delta;
			if(player.x - this.x < (canvas.width/2) - (rectX/2))
				this.x -= speed * GAME.delta;
			if(player.y - this.y > (canvas.height/2) + (rectY/2))
				this.y += speed * GAME.delta;
			if(player.y - this.y < (canvas.height/2) - (rectY/2))
				this.y -= speed * GAME.delta;
		},
		render: function(){
			GAME.ctx.drawImage(this.canvas, 0, 0, GAME.canvas.width, GAME.canvas.height);
			this.ctx.fillStyle = '#333333';
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		}

	}
};

GAME.map = {
	tiles: [
		new P(0,3),new P(1,3),new P(2,3),new P(3,3),new P(4,3),new P(5,3)
	],
	update: function() {
		if (GAME.objects.length < 20) {
			GAME.objects.push(new Slime(Math.random()*2000, Math.random()*2000));
		}
	},
	render: function() {
		var tile = 0;
		GAME.draw.box(-5, -5, 2010, 2010, "black", 5);
		for (var x = 0; x < 5; x++) {
			for (var y = 0; y < 5; y++) {
				tile++;
				tile %= this.tiles.length;
				GAME.draw.sprite(this.tiles[tile], x*400, y*400, 50, 50);
			}
		}
	}
};

function P(x,y){
	return {x:x,y:y}
};

class Entity {
	constructor(x, y, width, height, speed, mhp) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.hitbox = new Box(this.x, this.y, this.width, this.height);
		this.speed = speed;
		this.mhp = mhp;
		this.hp = mhp;
		this.damage = 2;

		this.frame = 0;
		this.timer = 0;
		this.STATE = {
			REST: 0,
			DAMAGED: 1
		};
		this.state = this.STATE.REST;
	}
	attack (damage) {
		if (this.state == this.STATE.DAMAGED) {
			this.timer = 0;
			return;
		}
		this.hp -= damage;
		this.setState(this.STATE.DAMAGED);
	}
	setState (state) {
		this.state = state;
		this.frame = 0;
	}
	fireAttack() {/* Must be implemeneted per class. */ return 0;}
	resetAnimation (autoloop) {
		this.frame++;
		if (!autoloop)
			this.frame %= this.getAnimation().length;
		this.timer = 0;
	}
	getAnimation () {/* Must be implemeneted per class. */ return [{x:0,y:0}];}
	render () {
		GAME.draw.sprite(this.getAnimation()[this.frame], this.x, this.y, this.width, this.height);
		GAME.draw.fillBox(this.x, this.y, this.width, 2, "gray");
		if (this.hp > 0)
			GAME.draw.fillBox(this.x, this.y, this.width*(this.hp/this.mhp), 2, "green");
	}
	die () {
		var e = GAME.objects;
		for (var i = 0; i < e.length; i++) {
			if (this == e[i]) {
				e.splice(i, 1);
				break;
			}
		}
	}
};

class Projectile extends Entity {
	constructor (x, y, width, height, speed, mhp, maxDistance, isRight) {
		super(x, y, width, height, speed, mhp);
		this.isRight = isRight;
		this.maxX = this.x + maxDistance * (isRight ? 1 : -1);
	}
	update () {
		if (this.isRight && this.x >= this.maxX || !this.isRight && this.x <= this.maxX) {
			this.die();
		}
		this.x += this.speed * GAME.delta * (this.isRight ? 1 : -1);
		this.hitbox.x = this.x;

		this.fireAttack();
	}
	fireAttack () {
		var e = GAME.objects;
		for (var i = 0; i < e.length; i++) {
			if (e[i] === this) continue;
			if (this.hitbox.isCollidingWith(e[i].hitbox)) {
				e[i].attack(this.damage);
				this.die();
			}
		}
	}
}

class Arrow extends Projectile {
	constructor (x, y, maxDistance, isRight, damage) {
		super(x, y, 30, 5, 500, 1, maxDistance, isRight);
		this.damage = damage;
		GAME.objects.push(this);
	}
	render () {
		//GAME.draw.fillBox(this.x,this.y,this.width,this.height,'red');
		//GAME.draw.sprite({x:0,y:6}, this.x, this.y, this.width, this.height);
		GAME.draw.customSprite(0, 60 + (this.isRight?0:1), 6, 1, this.x, this.y, this.width, this.height);
	}
}

class Player extends Entity {
	constructor() {
		super(100, 100, 50, 50, 200, 30);

		this.setClass('man', 'dagger');
		this.STATE.RUN = 2;
		this.STATE.ATTACK = 3;
		this.state = this.STATE.REST;
		this.isRight = true;
		// Special Player Stuff
		this.level = 1;
		this.xp = 0;
		this.damage = 2;
		this.sp = 0;
		this.cp = 0;
		this.regenTimer = 0;
		this.skills = {
			speed: 		1,
			strength: 	1,
			health: 	1,
			regen: 		1,
		};
		this.A_KEYS = {
			REST_L:0,
			REST_R:1,
			RUN_L:2,
			RUN_R:3,
			ATTACK_L:4,
			ATTACK_R:5,
			DAMAGED_L:7,
			DAMAGED_R:6
		};
	}
	setClass (anim, fireAttack) {
		this.class = anim;
		this.animations = animations[anim];
		this.fireAttack = attacks[fireAttack];
		switch(anim) {
			case "thief":
			this.damage*=2;
			this.skills.speed += 1;
			this.mhp -= 5;
			this.hp -= 5;
			break;
			case "archer":
			this.damage-=1;
			this.skills.strength += 1;
			break;
		}
	}
	handleInput () {
		this.right = false;
		this.left = false;
		this.up = false;
		this.down = false;

		if(GAME.keys[key.a]){
			this.left = true;
			this.isRight = false;
		}else if(GAME.keys[key.d]){
			this.right = true;
			this.isRight = true;
		}

		if(GAME.keys[key.w]){
			this.up = true;
		}else if(GAME.keys[key.s]){
			this.down = true;
		}

		if (this.state == this.STATE.DAMAGED) {
			return;
		}

		if(GAME.mouse_click_pos.isDown  && (this.state != this.STATE.ATTACK)){
			this.setState(this.STATE.ATTACK);
			return;
		}

		this.isMoving = (this.right || this.up || this.left || this.down) && (this.state != this.STATE.ATTACK);

		if(!this.isMoving && (this.state != this.STATE.REST && this.state != this.STATE.ATTACK)){
			this.setState(this.STATE.REST);
			return;
		}

		if(this.isMoving && this.state != this.STATE.RUN){
			this.setState(this.STATE.RUN);
			return;
		}
	}
	update () {
		this.timer += GAME.delta;

		this.animate();

		if(this.isMoving && this.state != this.STATE.DAMAGED){
			var newX = this.x;
			var newY = this.y;
			if(this.right){
				newX += this.speed * GAME.delta;
			}else if(this.left){
				newX -= this.speed * GAME.delta;
			}

			if(this.up){
				newY -= this.speed * GAME.delta;
			}else if(this.down){
				newY += this.speed * GAME.delta;
			}


			// Add 25 because we want to check the center of the
			// player
			// Move on x scale
			
			//if(MAP.canWalkAtPoint(this.hitbox))
			this.hitbox.x = newX;
			this.hitbox.y = newY;
			this.x = newX;
			this.y = newY;

			// Move on y scale
			//if(MAP.canWalkAtPoint(this.hitbox))
		}
		this.regenTimer += GAME.delta;
		if (this.regenTimer > 5 - (this.skills.regen-1/10)) {
			this.regenTimer = 0;
			this.hp += this.skills.health / 2;
			if (this.hp > this.mhp) {this.hp = this.mhp};
		}

		if (this.hp < 1) {
			this.die();
		}
		if (this.xp >= this.getMXP(this.level)) {
			this.levelup();
		}
	}
	levelup () {
		this.xp = 0;
		this.level++;
		this.hp = this.mhp;
		this.sp++;
		if (classmap[this.class].level == this.level) {
			this.cp++;
		}
	}
	die () {
		this.x = 100; this.y = 100;
		GAME.camera.reset();
		this.mhp = 30;
		this.hp = 30;
		this.level = 1;
		this.xp = 0;
		this.sp = 0;
		this.speed = 200;
		this.skills = {
			speed: 		1,
			strength: 	1,
			health: 	1,
			regen: 		1,
		};
		this.setClass("man", "dagger");
	}
	animate (){
		switch(this.state){
		case this.STATE.ATTACK:
			if(this.timer > .1){
				this.resetAnimation(true);
				if(this.frame > this.getAnimation().length-1){
					this.setState(this.STATE.REST);
					this.fireAttack();
				}
			}
			break;
		case this.STATE.RUN:
			if(this.timer > .08){
				this.resetAnimation();
			}
			break;
		case this.STATE.WALK:
			if(this.timer > .1){
				this.resetAnimation();
			}
			break;
		case this.STATE.REST:
			if(this.timer > .5){
				this.resetAnimation();
			}
			break;
		case this.STATE.DAMAGED:
			if(this.timer > .1) {
				this.resetAnimation(true);
				if(this.frame > this.getAnimation().length-1){
					this.setState(this.STATE.REST);
				}
			}
			break;
		}
	}
	award (xp) {
		this.xp += xp;
	}
	getAnimation () {
		var anim = '';
		if (this.state == this.STATE.RUN) {
			anim = "RUN";
		} else if (this.state == this.STATE.REST) {
			anim = "REST";
		} else if (this.state == this.STATE.ATTACK) {
			anim = "ATTACK";
		} else if (this.state == this.STATE.DAMAGED) {
			anim = "DAMAGED";
		}
		return this.animations[this.A_KEYS[anim + (this.isRight ? '_R' : '_L')]];
	}
	getMXP (lvl) {
		return lvl*lvl*2;
	}
};

var attacks = {
	'dagger': function() {
		var w = new Box(this.x, this.y, 40, 50);
		if (this.isRight) {
			w.x += this.width;
		} else {
			w.x -= 50;
		}
		var e = GAME.objects;
		for (var i = 0; i < e.length; i++) {
			if (e[i] == player) continue;
			if (w.isCollidingWith(e[i].hitbox)) {
				e[i].attack(this.damage * this.skills.strength);
			}
		}
	},
	'bow': function() {
		new Arrow(this.x + (this.isRight ? this.width+1 : -31), this.y + 20, 300, this.isRight, this.damage * this.skills.strength);
	}
};

var classmap = {
	man: {
		weapon: 'dagger',
		level: 2,
		classes: ['archer', 'thief'],
	},
	archer: {
		weapon: 'bow',
		classes: [],
		level: 0
	},
	thief: {
		weapon: 'dagger',
		classes: [],
		level: 0
	}
}

/**
 * For the Animations they must be ordered in this order:
 * REST_L
 * REST_R
 * RUN_L
 * RUN_R
 * ATTACK_L
 * ATTACK_R
 * DAMAGED_L
 * DAMAGED_R
 */
var animations = {
	man: [
		[new P(0,0)],
		[new P(0,1)],
		[new P(1,0), new P(2,0), new P(3,0), new P(4,0), new P(5,0), new P(6,0), new P(7,0), new P(8,0), new P(9,0), new P(10,0), new P(11,0)],
		[new P(11,1), new P(10,1), new P(9,1), new P(8,1), new P(7,1), new P(6,1), new P(5,1), new P(4,1), new P(3,1), new P(2,1), new P(1,1)],
		[new P(12,1),new P(13,1),new P(14,1)],
		[new P(12,0),new P(13,0),new P(14,0)],
		[new P(15,0)],
		[new P(15,1)]
	],
	thief: [
		[new P(0,7)],
		[new P(0,8)],
		[new P(11,7), new P(10,7), new P(9,7), new P(8,7), new P(7,7), new P(6,7), new P(5,7), new P(4,7), new P(3,7), new P(2,7), new P(1,7)],
		[new P(1,8), new P(2,8), new P(3,8), new P(4,8), new P(5,8), new P(6,8), new P(7,8), new P(8,8), new P(9,8), new P(10,8), new P(11,8)],
		[new P(12,8),new P(13,8),new P(14,8)],
		[new P(12,7),new P(13,7),new P(14,7)],
		[new P(15,7)],
		[new P(15,8)]
	],
	archer: [
		[new P(0,4)],
		[new P(0,5)],
		[new P(11,4), new P(10,4), new P(9,4), new P(8,4), new P(7,4), new P(6,4), new P(5,4), new P(4,4), new P(3,4), new P(2,4), new P(1,4)],
		[new P(1,5), new P(2,5), new P(3,5), new P(4,5), new P(5,5), new P(6,5), new P(7,5), new P(8,5), new P(9,5), new P(10,5), new P(11,5)],
		[new P(12,5),new P(13,5),new P(14,5),new P(15,5),new P(16,5),new P(17,5)],
		[new P(12,4),new P(13,4),new P(14,4),new P(15,4),new P(16,4),new P(17,4)],
		[new P(18,4)],
		[new P(18,5)]
	],
	slime: [
		[new P(0,2),new P(1,2),new P(2,2),new P(3,2)],
		[new P(4,2)],
		[new P(5,2),new P(6,2),new P(7,2),new P(8,2),new P(9,2),new P(10,2),new P(11,2)]
	]
};

class Enemy extends Entity {
	constructor(x, y, width, height, speed, mhp, xp, animations) {
		super(x, y, width, height, speed, mhp);
		this.walkTimer = 0;
		this.xp = xp;
		this.STATE.DEAD = 2;
		this.state = this.STATE.REST;
		this.animations = animations;
	}
	getAnimation () {
		return this.animations[this.state];
	}
	die () {
		super.die();
		player.award(this.xp);
	}
	update () {
		// this is where an AI would go... IF I HAD ONE!
		this.timer += GAME.delta;			
		this.animate();
		this.hitbox.x = this.x;
		this.hitbox.y = this.y;

		if (this.state == this.STATE.REST){
			this.walkTimer += GAME.delta;
			this.x += this.speed * GAME.delta;
		}
		if (this.walkTimer > 20) {
			this.speed *= -1;
			this.walkTimer = 0;
		}
		if (this.state == this.STATE.REST)
			this.fireAttack();
	}
	animate () {
		switch(this.state){
		case this.STATE.REST:
			if (this.timer > .1) {
				this.resetAnimation();
			}
			break;
		case this.STATE.DAMAGED:
			if (this.timer > .5) {
				this.resetAnimation(true);
				if (this.frame > this.getAnimation().length-1) {
					if (this.hp < 1) {
						this.setState(this.STATE.DEAD);
					} else {
						this.setState(this.STATE.REST);
					}
				}
			}
			break;
		case this.STATE.DEAD:
			if (this.timer > .1) {
				this.resetAnimation(true);
				if (this.frame > this.getAnimation().length-1) {
					this.die();
				}
			}
			break;
		}
	}
};

class Slime extends Enemy {
	constructor(x, y) {
		super(x, y, 30, 30, 50, 10, 5, animations.slime);
	}
	fireAttack () {
		var offset = 5;
		var w = new Box(this.x + offset, this.y + offset, this.width - (offset*2), this.height - (offset*2));
		if (w.isCollidingWith(player.hitbox)) {
			player.attack(this.damage);
		}
	}
};

function letter(character, x, y){
	this.character = character;
	this.x = x;
	this.y = y;
};

GAME.typewriter = {
	init: function(){
		this.letters = [];
		this.isDisplaying = false;
		this.waiting = false;
		this.waitingSymbol = false;
		this.timer = 0;
		this.lineLength = 20;

		this.cursor = {
			x: 20,
			y: 2/3 * GAME.canvas.height,
			increment: function(){
				this.x += 30;
			},
			dropLine: function(){
				this.x = 20;
				this.y += 22.5;
			},
			reset: function(){
				this.x = 20;
				this.y = 2/3 * GAME.canvas.height;
			}
		}
	},
	display: function(lines){
		if(this.isDisplaying)
			console.log('Already displaying text!');

		this.text = lines[0];
		lines.shift();
		this.lines = lines;
		this.isDisplaying = true;
	},
	shiftUpwards: function(){
		this.letters.splice(0, this.lineLength);
		this.shiftingUpwards = true;
	},
	shiftStep: function(){
		var step = 1;
		var steps = 100;
		for(var i = 0; i < this.letters.length; i++){
			this.letters[i].y -= 22.5 / steps;
		}
		if(this.letters[0].y <= 2/3 * GAME.canvas.height){
			this.shiftingUpwards = false;
		}
	},
	hasNextChar: function(){
		return this.text.length > 0;
	},
	hasNextLine: function(){
		return this.lines.length > 0;
	},
	nextChar: function(){
		if(this.hasNextChar()){
			var character = this.text.substring(0, 1);
			this.text = this.text.substring(1);
			return character;
		}else if(!this.hasNextLine()){
			this.exit();
		}
	},
	addCharacter: function(){
		if(this.hasNextChar()){
			if(this.cursor.x > GAME.canvas.width - 30){
				if(this.cursor.y > GAME.canvas.height - 50){
					this.shiftUpwards();
					this.cursor.x = 20;
					return;
				}else{
					this.cursor.dropLine();
				}
			}

			this.letters.push(new letter(this.nextChar(), this.cursor.x, this.cursor.y));
			this.cursor.increment();
		}
	},
	handleInput: function(){
		if(this.waiting && (GAME.keys[key.enter] || GAME.mouse_click_pos.isDown)){
			if(!this.hasNextLine()){
				this.exit();
				return;
			}
			// Shift to next line
			this.letters = [];
			this.cursor.reset();
			this.text = this.lines[0];
			this.lines.shift();
			this.waiting = false;
		}
	},
	update: function(){
		if(this.isDisplaying){
			this.timer += GAME.delta;

			if(this.shiftingUpwards && this.timer > .005){
				this.shiftStep();
				this.timer = 0;
			}else if(this.waiting && this.timer > .25){
				this.waitingSymbol = !this.waitingSymbol;
				this.timer = 0;
			}else if(this.timer > .05 && !this.waiting && !this.shiftingUpwards){
				this.addCharacter();
				this.timer = 0;
			}

			if(!this.hasNextChar() && !this.waiting){
				this.waiting = true;
				this.waitingSymbol = true;
			}
		}
	},
	render: function(){
		if(this.isDisplaying){
			var width = GAME.canvas.width;
			var height = GAME.canvas.height;
			var offset = 10;

			GAME.drawUI.fillBox(offset, 
				(2/3 * height) - offset, 
				width - offset*2, 
				(1/3 * height), 'black');
			GAME.drawUI.box(offset, 
				(2/3 * height) - offset, 
				width - offset*2, 
				(1/3 * height), 'white', 1)

			if(this.isDisplaying){
				for(var i = 0; i < this.letters.length; i++){
					GAME.drawUI.text(this.letters[i].character, this.letters[i].x, this.letters[i].y, 'white');
				}

				if(this.waiting && this.waitingSymbol){
					GAME.drawUI.text('^', width - 40, height - 20);
				}
			}
		}
	},
	exit: function(){
		this.letters = [];
		this.lines = [];
		this.timer = 0;
		this.text = '';
		this.waiting = false;
		this.isDisplaying = false;
		this.waiting = false;
	}
};

// Store key references here, so we
// can see what key is which at a glance
var key = {
	up: 38,
	left: 37,
	right: 39,
	down: 40,
	space: 32,
	a: 65,
	s: 83,
	d: 68,
	w: 87,
	e: 69,
	r: 82,
	escape: 27,
	enter: 13,
	shift: 16
};

function Box(x, y, width, height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};
Box.prototype.isCollidingWith = function(box){
	return (isColliding(this, box) || isColliding(box, this));
};
Box.prototype.contains = function(box){
	return (box.x > this.x && box.x < this.x + this.width
		&& box.x + box.width > this.x && box.x + box.width < this.x + this.width)
		&& (box.y > this.y && box.y < this.y + this.height
		&& box.y + box.height > this.y && box.y + box.height < this.y + this.height)
};
var isColliding = function (box1, box2) {
	return (box1.x >= box2.x && box1.x <= box2.x + box2.width
		|| box1.x + box1.width >= box2.x && box1.x + box1.width <= box2.x + box2.width)
		&& (box1.y >= box2.y && box1.y <= box2.y + box2.height
		|| box1.y + box1.height >= box2.y && box1.y + box1.height <= box2.y + box2.height)
};

var UI = {
	buttons: [],
	classbuttons: [],
	showSkillMenu: false,
	init: function() {
		this.buttons.push(this.button(270, 402, '+', "#2C6000", "#00cc00", function(){player.sp--;player.skills.strength++;}));
		this.buttons.push(this.button(270, 432, '+', "#2C6000", "#00cc00", 
		function(){
			player.sp--;
			player.skills.speed++;
			player.speed = (player.skills.speed*20) + player.speed;
		}));
		this.buttons.push(this.button(270, 462, '+', "#2C6000", "#00cc00", function(){player.sp--;player.skills.regen++;}));
		this.buttons.push(this.button(270, 492, '+', "#2C6000", "#00cc00", 
		function(){
			player.sp--;
			player.skills.health++;
			player.mhp += player.skills.health-1 * 5;
			player.hp = player.mhp;
		}));
		this.shrinkButton = this.button(15, 380, '+', "#2C6000", "#00cc00", function() {
			if (UI.showSkillMenu) {
				UI.showSkillMenu = false;
				this.text = '+';
			} else {
				this.text = '-';
				UI.showSkillMenu = true;
			}
		});
		this.classbuttons.push(this.classbutton(10, 10, new P(1,6),'thief','dagger'));
		this.classbuttons.push(this.classbutton(10, 120, new P(2,6),'archer','bow'));
	},
	classbutton: function(x, y, p, pclass, weapon) {
		return {
			x:x,y:y,p:p,pclass:pclass,weapon:weapon,hovered:false,
			handleInput: function() {
				if (this.isInside(GAME.mouse_pos)) {
					if (this.isInside(GAME.mouse_click_pos) && GAME.mouse_click_pos.isDown) {
						player.setClass(this.pclass, this.weapon);
						player.cp--;
						GAME.mouse_click_pos.isDown = false;
					}
					this.hovered = true;
				} else {
					this.hovered = false;
				}
			},
			isInside: function(p) {
				return p.x > this.x && p.x < this.x+100 && p.y > this.y && p.y < this.y+100;
			},
			render: function() {
				GAME.drawUI.fillBox(this.x, this.y, 100, 100, this.hovered ? 'lightgray' : 'gray');
				GAME.drawUI.box(this.x, this.y, 100, 100, 'black', 1);
				GAME.drawUI.sprite(this.p, this.x, this.y, 100, 100);
			}
		}
	},
	button: function(x, y, text, light, dark, action) {
		return {
			x:x,y:y,text:text,hovered:false,dark:dark,light:light,action:action,
			handleInput: function() {
				if (this.isInside(GAME.mouse_pos)) {
					if (this.isInside(GAME.mouse_click_pos) && GAME.mouse_click_pos.isDown) {
						this.action();
						GAME.mouse_click_pos.isDown = false;
					}
					this.hovered = true;
				} else {
					this.hovered = false;
				}
			},
			isInside: function(p) {
				return p.x > this.x && p.x < this.x+20 && p.y > this.y && p.y < this.y+20;
			},
			update: function(){
			},
			render: function(){
				GAME.drawUI.fillBox(this.x, this.y, 20, 20, this.hovered ? this.dark : this.light);
				GAME.drawUI.box(this.x, this.y, 20, 20, 'black', 1);
				GAME.drawUI.text(this.text, this.x, this.y, 'black');
			}
		};
	},
	handleInput: function(){
		this.shrinkButton.handleInput();
		if (player.sp > 0) {
			for (var i = 0; i < this.buttons.length; i++) {
				this.buttons[i].handleInput();
			}
		}
		if (player.cp > 0) {
			for (var i = 0; i < this.classbuttons.length; i++) {
				this.classbuttons[i].handleInput();
			}
		}
	},
	update: function(){
	},
	render: function(){
		GAME.drawUI.fillBox(100, 725, 600, 50, 'gray');
		if (player.xp > 0 && player.xp <= player.getMXP(player.level))
			GAME.drawUI.fillBox(102, 727, (player.xp/player.getMXP(player.level))*596,46, "#5AD75A");
		GAME.drawUI.box(100, 725, 600, 50, 'black', 1);
		GAME.drawUI.centerText("Level " + player.level, 400, 730, "white");
		this.shrinkButton.render();

		if (player.sp > 0 || this.showSkillMenu) {
			// Render the select skill point menu
			GAME.drawUI.fillBox(15, 400, 290, 115, 'gray');
			GAME.drawUI.box(15, 400, 290, 115, 'black', 1);
			GAME.drawUI.text("Strength\t\t"+player.skills.strength, 20, 405, 'black');
			GAME.drawUI.text("Speed\t\t\t\t\t"+player.skills.speed, 20, 435, 'black');
			GAME.drawUI.text("Regen\t\t\t\t\t"+player.skills.regen, 20, 465, 'black');
			GAME.drawUI.text("Health\t\t\t\t"+player.skills.health, 20, 495, 'black');
			if (player.sp > 0) {
				for (var i = 0; i < this.buttons.length; i++) {
					this.buttons[i].render();
				}
			}
		}
		if (player.cp > 0) {
			for (var i = 0; i < this.classbuttons.length; i++) {
				this.classbuttons[i].render();
			}
		}
	}
};
var player = new Player();

$(document).ready(function(){
	// Init canvas
	GAME.canvas = $("#canvas")[0];
	GAME.canvas.width = 800;
	GAME.canvas.height = 800;

	// Init context
	GAME.ctx = GAME.canvas.getContext('2d');
	GAME.ctx.font = '20px Press-Start-2P';
	GAME.ctx.textBaseline = 'top';
	GAME.ctx.imageSmoothingEnabled = false;

	GAME.lastTime = Date.now();
	GAME.keys = [];
	GAME.mouse_pos = new P(0,0);
	GAME.mouse_click_pos = new P(0,0);
	GAME.mouse_click_pos.isDown = false;
	GAME.bindInput();

	// Init GAME objects
	GAME.typewriter.init();

	GAME.objects = [player];
	UI.init();
	GAME.camera.init();

	GAME.typewriter.display(['Welcome.']);
	// Start loop
	GAME.gameLoop();
});