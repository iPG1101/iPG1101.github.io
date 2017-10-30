var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BUILD_NUMBER = "1.0-RC1_291017956p";
var c = document.createElement("canvas"), ctx = c.getContext("2d");
var WIDTH = 720, HEIGHT = 360;
var Entity = (function () {
    function Entity(l, r, x, y) {
        this.x = 0;
        this.y = 0;
        this.velX = 0;
        this.velY = 0;
        this.facing = 0;
        this.texture = [new Image(), new Image()];
        this.show = function () {
            ctx.drawImage(this.texture[this.facing], this.x - 32 - Game.player.x + WIDTH / 2 - 32, this.y - 48, 64, 96);
        };
        this.update = function () {
            this.x += this.velX;
            this.y += this.velY;
            // this.velY += Game.getLevel().gravityForce || 0.01;
        };
        this.checkCollision = function (x, y) {
            return !(this.x > x - 32 && this.x - 32 < x && this.y > y - 48 && this.y - 48 < y + 8);
        };
        if (l)
            this.texture[0].src = l;
        if (r)
            this.texture[1].src = r;
        if (l == r && !l) {
            this.texture = [];
        }
        this.x = x;
        this.y = y;
    }
    ;
    return Entity;
}());
;
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(texture, x, y, w, h, animData) {
        var _this = _super.call(this, texture, undefined, x, y) || this;
        _this.w = 0;
        _this.h = 0;
        _this.checkCollision = function (x, y) {
            var nc = !(this.x < x && this.x + this.w > x && this.y <= y && this.y + this.h >= y); //Not colliding
            if ((!nc) && Game.player.y < this.y) {
                this.die();
                Game.player.velY *= -0.35;
                return "Died!";
            }
            if (!nc /*if colliding*/) {
                Game.player.y += 1000;
            }
            return nc;
        };
        _this.frame = 0;
        _this.show = function () {
            this.frame++;
            this.frame = this.frame % this.animData.length;
            ctx.drawImage(this.texture[0], this.animData[this.frame][0], this.animData[this.frame][1], this.animData[this.frame][2], this.animData[this.frame][3], this.x - Game.player.x + WIDTH / 2 - 32, this.y, this.w, this.h);
            ctx.drawImage(this.texture[0], this.x - Game.player.x + WIDTH / 2 - 32, this.y, this.w, this.h);
            // ctx.drawImage(this.texture[0], this.x - Game.player.x+WIDTH/2-32, this.y, this.w, this.h);
            this.update();
        };
        _this.velX = 0;
        _this.velY = -0.1;
        _this.die = function () {
            this.update = this.show = this.checkCollision = function () { return true; };
        };
        _this.jetpacking = false;
        _this.flame = new Image();
        _this.jetpack = function () {
            if (this.fuel <= 5)
                return this.jetpacking = false;
            if (this.velY == 0)
                this.velY -= 0.225;
            this.fuel -= 2;
            this.velY -= 0.065;
            if (this.velY < -2)
                this.velY = -2;
        };
        _this.update = function () {
            //Q: Do I want to jetpack?
            //A: Figure it out, dipshit. Do you want to die? Or jetpack?
            //EDIT: Disabled, he kept doin' too much!
            // this.jetpacking = true;
            // for(let i: number = 0; i < HEIGHT; i+=5){
            // 	for(let i2 in Game.entities) if(Game.entities[i2].checkCollision(this.x, i)&&Game.entities[i2].y>this.y+this.h/2) this.jetpacking = false;
            // }
            // if(this.jetpacking) this.jetpack();
            if (Game.player.x > this.x)
                this.velX += 0.1;
            if (Game.player.x < this.x)
                this.velX -= 0.1;
            if (this.velX > 0.25)
                this.velX = 0.25;
            if (this.velX < -0.25)
                this.velX = -0.25;
            var moveX = true;
            if (this.y > HEIGHT)
                this.die();
            if (this.velX < 0)
                this.facing = 0;
            else if (this.velX > 0)
                this.facing = 1;
            this.fuel += 0.35;
            for (var i in Game.entities) {
                if (!Game.entities[i].checkCollision(this.x + this.velX * 2.5, this.y - 2)) {
                    // this.velX = 0;
                    moveX = false; //If you are going to collide with an object if you go any more to the side, then do not do it!
                }
            }
            if (moveX)
                this.x += this.velX * 2.15 + (this.jetpacking ? this.velX : 0);
            if (this.fuel >= 100)
                this.fuel = 99.9;
            for (var i in Game.entities) {
                if (!Game.entities[i].checkCollision(this.x, this.y + this.velY) || !Game.entities[i].checkCollision(this.x, this.y + this.velY + this.h)) {
                    this.velY = 0;
                    return; //If you are going to collide with an object if you go any lower, then do not do it!
                }
            }
            this.velY += Game.getLevel().gravityForce || 0.02;
            this.y += this.velY;
        };
        _this.animData = [[0, 0, 16, 16]];
        _this.w = w;
        _this.h = h;
        _this.animData = animData;
        return _this;
    }
    return Enemy;
}(Entity));
;
var Block = (function (_super) {
    __extends(Block, _super);
    function Block(x, y, w, h, c) {
        var _this = _super.call(this, 'block.png', undefined, x, y) || this;
        _this.w = 0;
        _this.h = 0;
        _this.coords = new Array(2);
        _this.checkCollision = function (x, y, z) {
            var nc = !(this.x < x && this.x + this.w > x && this.y <= y - 8 && this.y + this.h >= y); //Not colliding
            if (!nc /*if colliding*/) {
                if (x < this.x + this.w / 2 && x == Game.player.x)
                    Game.player.velX -= 0.25;
                if (x > this.x + this.w / 2 && x == Game.player.x)
                    Game.player.velX += 0.25;
            }
            if ((this.x < x && this.x + this.w > x && this.y <= y && this.y + this.h + 2 >= y) && z instanceof Player) {
                if (this.coords[0] == 2 || this.coords[1] == 2) {
                    var coords = this.coords;
                    //Special powers...?!?!
                    if (coords.join(',') == '2,0') {
                        //Quick regen of jetpack fuel
                        z.fuel += 3;
                        z.fuel = z.fuel < 100 ? z.fuel : 100;
                    }
                    if (coords.join(',') == '2,1') {
                        z.velX = z.velX > 0 ? 6 : z.velX < 0 ? -6 : 0;
                    }
                    if (coords.join(',') == '2,2') {
                        //Bounce
                        z.bouncing = z.velY * 0.6;
                        if (Math.abs(z.velY) < 0.9)
                            z.velY = z.bouncing = 0;
                    }
                    if (coords.join(',') == '0,2') {
                        setTimeout(function () { this.falling = true; }.bind(this), 300);
                    }
                }
            }
            return !(this.x < x && this.x + this.w > x && this.y <= y && this.y + this.h + 2 >= y);
        };
        _this.falling = false;
        _this.show = function () {
            var coords = [this.coords[0] * 16, this.coords[1] * 16];
            ctx.drawImage(this.texture[0], coords[0], coords[1], 16, 16, this.x - Game.player.x + WIDTH / 2 - 32, this.y, this.w, this.h);
            // this.update();
        };
        _this.update = function () {
            this.x += this.velX;
            this.y += this.velY;
            if (this.falling)
                this.velY += Game.getLevel().gravityForce * 1.02;
        };
        if (c != undefined) {
            _this.coords[0] = c[0];
            _this.coords[1] = c[1];
        }
        else {
            _this.coords[0] = 1;
            _this.coords[1] = 0;
        }
        _this.w = w;
        _this.h = h;
        return _this;
    }
    return Block;
}(Entity));
;
var Decoration = (function (_super) {
    __extends(Decoration, _super);
    function Decoration(image, x, y, w, h, otherdata, finalArgument) {
        var _this = 
        // constructor(image: string, x: number, y: number, w: number, h: number, image2: string | null, finalArgument: null | boolean){
        _super.call(this, image, undefined, x, y) || this;
        _this.w = 0;
        _this.h = 0;
        _this.frames = 0;
        _this.crFrame = 0;
        _this.canCollide = true;
        _this.checkCollision = function (x, y) {
            var nc = !(this.x < x && this.x + this.w > x && this.y <= y + 4 && this.y + this.h >= y + 4); //Not colliding
            if (!this.canCollide && !nc /*if colliding*/) {
                if (x - 3 < this.x + 8)
                    Game.player.velX -= 0.25;
                if (x + 3 > this.x + this.w - 8)
                    Game.player.velX += 0.25;
            }
            // if() return false;
            return !(!this.canCollide && this.x < x && this.x + this.w > x && this.y <= y && this.y + this.h + 2 >= y);
        };
        _this.show = function () {
            this.frames++;
            if (this.frames >= 15) {
                this.frames = 0;
                this.crFrame++;
            }
            if (this.crFrame >= 2)
                this.crFrame = 0;
            if (this.otherdata[0] >= 1)
                ctx.drawImage(this.texture[0], 16 * (this.crFrame % this.otherdata[0]), 0, 16, 16, this.x - Game.player.x + WIDTH / 2 - 32, this.y, this.w, this.h);
            else
                ctx.drawImage(this.texture[0], this.x - Game.player.x + WIDTH / 2 - 32, this.y, this.w, this.h);
        };
        _this.otherdata = [];
        _this.otherdata = otherdata;
        _this.w = w;
        _this.h = h;
        _this.canCollide = finalArgument || true;
        return _this;
    }
    return Decoration;
}(Entity));
;
var Finish = (function (_super) {
    __extends(Finish, _super);
    function Finish(x) {
        var _this = _super.call(this, 'finish.png', undefined, x, 0) || this;
        _this.w = 0;
        _this.h = 0;
        _this.checkCollision = function (x, y) {
            return !(this.x < x && this.x + this.w > x && this.y <= y && this.y + this.h + 2 >= y && !(Game.crLevel++, (Game.crLevel < Game.levels.length) ? (Game.player.lives++, Game.refreshLevel()) : (Game.crLevel = 0, Game.popupbox('You win!', ['Play again!', 'Go to homepage'], [function () { document.location.reload(); }, function () { document.location.href = 'https://iPG1101.github.io'; }]))));
        };
        _this.show = function () {
            ctx.drawImage(this.texture[0], this.x - Game.player.x + WIDTH / 2 - 32, this.y, this.w, this.h);
        };
        _this.w = 64;
        _this.h = HEIGHT;
        return _this;
    }
    return Finish;
}(Entity));
;
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(id) {
        var _this = _super.call(this, undefined, undefined, WIDTH / 5, HEIGHT / 3) || this;
        _this.skinDimensions = {
            'char0.png': [290, 800],
            'char1.png': [140, 150]
        };
        _this.facing = 1;
        _this.fuel = 100;
        _this.lives = 3;
        _this.velY = 2;
        _this.jetpacking = false;
        _this.bouncing = 0;
        _this.image = new Image();
        _this.jp = new Image();
        _this.flame = new Image();
        _this.jetpack = function () {
            if (this.fuel <= 5)
                return this.jetpacking = false;
            if (this.velY == 0)
                this.velY -= 0.225;
            this.fuel -= 2;
            this.velY -= 0.065;
            if (this.velY < -2.5)
                this.velY = -2.5;
        };
        _this.bounce = function () {
            this.velY -= 0.225;
            this.bouncing -= 0.225;
            if (this.velY >= 0)
                this.velY -= 0.225;
            if (this.bouncing < 0.1)
                this.bouncing = 0;
            this.velY -= 0.065;
            if (this.velY < -2.5)
                this.velY = -2.5;
        };
        _this.die = function () {
            if (this.lives > 0) {
                this.velX = 0;
                this.velY = 1;
                this.x = WIDTH / 5;
                this.y = HEIGHT / 3;
                this.lives--;
            }
            else {
                //Game over sequence
                Game.popupbox('Game over. Do you want to be revived?', ['Yes, revive me!', 'No, I will be done for now...'], [function () { location.reload(); }, function () { document.location.href = 'https://iPG1101.github.io'; }]);
                this.velX = 0;
                this.velY = 1;
                this.x = WIDTH / 5;
                this.y = HEIGHT / 3;
                this.lives--;
            }
        };
        _this.update = function () {
            var moveX = true;
            if (this.bouncing)
                this.bounce();
            if (this.jetpacking)
                this.jetpack();
            if (this.y - this.velY - this.velY > HEIGHT)
                this.die();
            if (this.velX < 0)
                this.facing = 0;
            else if (this.velX > 0)
                this.facing = 1;
            this.fuel += 0.35;
            for (var i in Game.entities) {
                var temp = Game.entities[i].checkCollision(this.x + this.velX, this.y - 2, this) &&
                    Game.entities[i].checkCollision(this.x + this.velX, this.y - 31, this) &&
                    Game.entities[i].checkCollision(this.x + this.velX, this.y - 46, this) &&
                    Game.entities[i].checkCollision(this.x + this.velX, this.y - 71, this) &&
                    Game.entities[i].checkCollision(this.x + this.velX, this.y - 96, this);
                if (!(temp)) {
                    // this.velX = 0;
                    moveX = false; //If you are going to collide with an object if you go any more to the side, then do not do it!
                }
            }
            if (moveX)
                this.x += this.velX * 2;
            if (this.fuel >= 100)
                this.fuel = 99.9;
            for (var i in Game.entities) {
                if (!(Game.entities[i].checkCollision(this.x, this.y + this.velY, this))) {
                    this.velY = 0;
                    return; //If you are going to collide with an object if you go any lower, then do not do it!
                }
            }
            this.velY += Game.getLevel().gravityForce || 0.02;
            this.y += this.velY;
        };
        _this.animFrame = 0;
        _this.show = function () {
            // ctx.drawImage(this.texture[this.facing], this.x-32, this.y-96, 64, 96);
            this.animFrame += this.velX / 16;
            // ctx.drawImage(this.jp, WIDTH/2-72, this.y - 80, 64, 64);
            if (this.jetpacking) {
                ctx.drawImage(this.flame, 16 * Math.floor(Math.abs(this.fuel / 8 % 3)), 0, 16, 24, WIDTH / 2 - 64, this.y - 64, 64, 96);
            }
            if (Math.abs(this.velX) < 0.1)
                this.animFrame = 0;
            // console.log(this.image.src);
            var temp = this.image.src.split('/')[this.image.src.split('/').length - 1];
            ctx.drawImage(this.image, this.facing * this.skinDimensions[temp][0], Math.floor(Math.abs(this.animFrame) % (this.image.height / this.skinDimensions[temp][1])) * this.skinDimensions[temp][1], this.skinDimensions[temp][0], this.skinDimensions[temp][1], WIDTH / 2 - 64, this.y - 96, 64, 96);
            ctx.font = '20px Ariel';
            ctx.fillStyle = 'rgb(0,127,255)';
            ctx.fillText('Lives: ' + this.lives, 4, 18);
            ctx.fillStyle = 'rgb(RED,GREEN,0)'
                .replace(/RED/g, (255 - Math.floor(2.55 * this.fuel)).toString())
                .replace(/GREEN/g, (Math.floor(2.55 * this.fuel)).toString());
            ctx.drawImage(this.jp, 520, 4, 70, 50);
            ctx.fillRect(640 - ctx.measureText('Fuel').width * 1.5, 28, this.fuel, 16);
            ctx.strokeStyle = '#09F';
            ctx.lineWidth = 2;
            ctx.strokeRect(640 - ctx.measureText('Fuel').width * 1.5, 28, 100, 16);
            ctx.fillText(Math.round(this.fuel).toString() + '%', 640 - (ctx.measureText(Math.round(this.fuel) + '%').width) * 1.5, 28);
        };
        _this.image = new Image();
        _this.image.src = 'char' + id + '.png';
        _this.jp.src = 'jetpack.png';
        _this.flame.src = 'flame.png';
        return _this;
    }
    ;
    return Player;
}(Entity));
;
var Game = {
    loadFile: function (url) {
        var request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send(null);
        return eval(request.responseText);
    },
    levels: new Array(7),
    crLevel: 0,
    getLevel: function () {
        return Game.levels[Game.crLevel];
    },
    player: new Player(0),
    entities: [],
    framerate: 60,
    behindTheScenes: {
        lastFrame: new Date().getTime()
    },
    frame: function () {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        Game.framerate = Math.floor(1 / ((new Date().getTime() - Game.behindTheScenes.lastFrame) / 10)) / 100;
        Game.behindTheScenes.lastFrame = new Date().getTime();
        for (var i in Game.entities) {
            Game.entities[i].show();
            Game.entities[i].update();
        }
        Game.player.show();
        Game.player.update();
        setTimeout(Game.frame, 1000 / 60);
    },
    refreshLevel: function () {
        var lives = Game.player.lives;
        Game.player = new Player(Game.levels[Game.crLevel].playertexture);
        Game.entities = Game.levels[Game.crLevel].entities;
        Game.player.x = WIDTH / 5;
        Game.player.y = HEIGHT / 3;
        Game.player.lives = lives;
        Game.player.velX = 0;
        Game.player.velY = 1;
    },
    initialize: function () {
        c.style.background = 'url(background.png)';
        c.style.backgroundSize = 'cover';
        c.width = WIDTH;
        c.height = HEIGHT;
        ctx.imageSmoothingEnabled = false;
        Game.refreshLevel();
        Game.popupbox('<b>Oh no!</b><br/><br/>You were flying your SpaceCraft, but you got hit by a meteorite while moving at '
            + Math.floor(Math.random() * 500 + 500) + ' kilometres per hour! You need to get to the nearest village, SunTown!\
			 It is 2 kilometres away from where you ended up stopping. You have a jetpack, and 3 lives. Good luck!<br/>\
			 <b style=\'color: green\'>\
			  Game is no longer in beta!\
			   You\'re on build <a style=\'font-size: 60%\'>' + BUILD_NUMBER + '</a>, report bugs/glitches/crashes!</b><br/>Credits: <br/>Mr. Stahlmann, Mr. Velasco, Lazy Jimmy (levels)<br/>Jimmy (art)<br/>iPhoneGuy1101 (Programming/Animation)<br/>', ["Ok, I'm ready!"], [Game.frame]);
    },
    showLoadingScreen: function () {
        var mobile = /iPad|iPhone|iPod|Android|Phone|Touch|Tablet|Mobi/i.test(navigator.userAgent || navigator.vendor || window['opera']);
        var dpad_stylesheet = document.createElement('link');
        dpad_stylesheet.rel = 'stylesheet';
        if (mobile)
            dpad_stylesheet.href = 'mobile.css';
        else
            dpad_stylesheet.href = 'nonmobile.css';
        document.head.appendChild(dpad_stylesheet);
        document.body.appendChild(c);
        var s = new Image();
        s.src = 'background.png';
        c.style.background = s.src;
        ctx.drawImage(s, 0, 0, c.width, c.height);
        for (var i = 0; i < Game.levels.length; i++)
            Game.levels[i] = Game.loadFile('levels/level' + (i + 1) + '.json');
        for (var j in Game.dpad.buttons)
            Game.dpad.buttons[j].ontouchstart = Game.dpad.handlers.down[j];
        for (var j in Game.dpad.buttons)
            Game.dpad.buttons[j].onmousedown = Game.dpad.handlers.down[j];
        for (var j in Game.dpad.buttons)
            Game.dpad.buttons[j].ontouchend = Game.dpad.handlers.up[j];
        for (var j in Game.dpad.buttons)
            Game.dpad.buttons[j].onmouseup = Game.dpad.handlers.up[j];
        setTimeout(Game.initialize);
    },
    keyhandler: {
        keydown: function (e) {
            var key = e.keyCode || e.charCode || e.which || 0;
            if (key != 117 && key != 17 && key != 82)
                e.preventDefault();
            if (key == 38 || key == 87)
                Game.player.jetpacking = true;
            if (key == 65 || key == 37)
                Game.player.velX = -1;
            if (key == 68 || key == 39)
                Game.player.velX = +1;
        },
        keyup: function (e) {
            var key = e.keyCode || e.charCode || e.which || 0;
            if (key != 117 && key != 17 && key != 82)
                e.preventDefault();
            if (key == 38 || key == 87)
                Game.player.jetpacking = false;
            if (key == 65 || key == 37)
                Game.player.velX = 0;
            if (key == 68 || key == 39)
                Game.player.velX = 0;
        }
    },
    popupbox: function (q, a, b) {
        var popup = document.createElement('div');
        popup.style.position = 'absolute';
        popup.style.width = '75%';
        popup.style.height = '75%';
        popup.style.top = '12.5%';
        popup.style.left = '12.5%';
        popup.style.border = 'double 4px gold';
        popup.style.overflow = 'auto';
        popup.style.fontSize = '24px';
        popup.style.background = 'black';
        popup.style.color = 'white';
        document.body.appendChild(popup);
        popup.innerHTML = q;
        for (var i in a) {
            var temp = document.createElement('div');
            temp.innerHTML = a[i];
            temp.onclick = function () {
                popup.style.display = 'none';
                document.body.removeChild(popup);
                popup = undefined;
                b[this.id]();
            }.bind(temp);
            temp.id = i;
            temp.style.background = '#333';
            temp.style.position = 'absolute';
            temp.style.bottom = '0';
            temp.style.padding = '2%';
            temp.style.borderRadius = '50%';
            temp.style[(a[i] == a[0]) ? 'left' : 'right'] = '0';
            popup.appendChild(temp);
        }
        ;
    },
    dpad: {
        handlers: {
            down: {
                up: function (e) {
                    e.preventDefault();
                    var temp = { keyCode: 38, charCode: 87, which: 38, preventDefault: function () { } };
                    Game.keyhandler.keydown(temp);
                },
                left: function (e) {
                    e.preventDefault();
                    var temp = { keyCode: 65, charCode: 37, which: 65, preventDefault: function () { } };
                    Game.keyhandler.keydown(temp);
                },
                right: function (e) {
                    e.preventDefault();
                    var temp = { keyCode: 68, charCode: 39, which: 68, preventDefault: function () { } };
                    Game.keyhandler.keydown(temp);
                }
            },
            up: {
                up: function (e) {
                    e.preventDefault();
                    var temp = { keyCode: 38, charCode: 87, which: 38, preventDefault: function () { } };
                    Game.keyhandler.keyup(temp);
                },
                left: function (e) {
                    e.preventDefault();
                    var temp = { keyCode: 65, charCode: 37, which: 65, preventDefault: function () { } };
                    Game.keyhandler.keyup(temp);
                },
                right: function (e) {
                    e.preventDefault();
                    var temp = { keyCode: 68, charCode: 39, which: 68, preventDefault: function () { } };
                    Game.keyhandler.keyup(temp);
                }
            }
        },
        buttons: {
            up: document.querySelector('#up'),
            left: document.querySelector('#left'),
            right: document.querySelector('#right')
        }
    }
};
window.onkeydown = Game.keyhandler.keydown;
window.onkeyup = Game.keyhandler.keyup;
window.onload = Game.showLoadingScreen;
var fuck = {
    "this": function () {
        Game.player.jetpack = function () {
            if (this.fuel <= 5)
                return this.jetpacking = false;
            if (this.velY == 0)
                this.velY -= 0.225;
            this.fuel -= 0.5;
            this.velY -= 0.075;
            if (this.velY < -2)
                this.velY = -2;
        };
    }
};
