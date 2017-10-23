const VERSION = "webRCT2.0"

let number = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    ",": "comma",
    ".": "period"
  },
  tiles = {
    "uncut grass": [0, 0, 16, 16],
    "cut grass": [0, 16, 16, 16],
    "zero": [96, 32, 16, 16],
    "one": [112, 16, 16, 16],
    "two": [112, 32, 16, 16],
    "three": [112, 48, 16, 16],
    "four": [112, 64, 16, 16],
    "five": [112, 80, 16, 16],
    "six": [112, 96, 16, 16],
    "seven": [112, 112, 16, 16],
    "eight": [96, 0, 16, 16],
    "nine": [96, 16, 16, 16],
    "$": [112, 0, 16, 16],
    "dollar sign": [112, 0, 16, 16],
    "vertical rails": [0, 32, 16, 16],
    "horizantal rails": [0, 48, 16, 16],
    "comma": [96, 48, 16, 16],
    ",": [96, 48, 16, 16],
    ".": [96, 64, 16, 16],
    "dot": [96, 64, 16, 16],
    "period": [96, 64, 16, 16],
    image: new Image(),
    draw: function(t, c, x, y, w, h) {
      c.drawImage(tiles.image, tiles[t][0], tiles[t][1], tiles[t][2], tiles[t][3], x, y, w, h)
    }
  },
  canvas = document.createElement('canvas'),
  context = canvas.getContext('2d'),
  TILESIZE = 48;


document.body.appendChild(canvas);
document.body.style.padding = 0;
document.body.style.margin = 0;
canvas.style.padding = 0;
canvas.style.margin = 0;
canvas.width = canvas.height = 608;
tiles.image.src = 'tilemap.png';


class Tile {
  constructor(x = 0, y = 0, texture = "uncut grass") {
    this.x = x;
    this.y = y;
    this.texture = texture;
    if (texture.includes('grass')) this.lastCut = new Date().getTime() - (Math.random() * 8000);
  }
  show(c) {
    tiles.draw(this.texture, c, this.x, this.y, TILESIZE, TILESIZE);
    let x = this.x / TILESIZE;
    let y = this.y / TILESIZE;
    if(this.texture.includes('rail')) {
      let direction = 'vertical';
      if(TileMap[y+1][x].texture.includes('rail') || TileMap[y-1][x].texture.includes('rail')){
        direction = 'vertical'
        if(TileMap[y][x+1].texture.includes('rail') && TileMap[y][x-1].texture.includes('rail')) {
          direction = 'horizantal';
        }
      }
      if(TileMap[y][x+1].texture.includes('rail') || TileMap[y][x-1].texture.includes('rail')){
        direction = 'horizantal'
        if(TileMap[y+1][x].texture.includes('rail') && TileMap[y-1][x].texture.includes('rail')) {
          direction = 'vertical';
        }
      }
      this.texture = direction+' rails'
    }
    c.strokeStyle = '#0A3';
    c.strokeRect(this.x, this.y, TILESIZE, TILESIZE);
    if ('lastCut' in this && this.texture == "cut grass") {
      if (this.lastCut < new Date().getTime() - 60000) {
        this.lastCut = new Date() - (Math.random() * 1000);
        this.texture = "uncut grass";
      }
    }
  }
  toString() {
    return this.texture;
  }
}

let TileMap = new Array(Math.round(canvas.width / TILESIZE));
for (let y = 0; y < TileMap.length; y++) {
  TileMap[y] = new Array(Math.round(canvas.width / TILESIZE));
  for (let x = 0; x < TileMap[y].length; x++) {
    TileMap[y][x] = new Tile(x * TILESIZE, y * TILESIZE, 'cut grass');
  }
}

function Draw() {
  if(money >= 999999999.99) money = 999999999.98
  context.fillStyle = '#0A0';
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (let i in TileMap) {
    for (let h in TileMap[i]) {
      TileMap[i][h].show(context);
    }
  }
  tiles.draw('dollar sign', context, 8, canvas.height - TILESIZE*0.75, TILESIZE*0.625, TILESIZE*0.625);
  let cash = money.toLocaleString().split('');
  for(var i in cash){
    tiles.draw(number[cash[i]], context, TILESIZE*0.7 + TILESIZE*0.55*i, canvas.height - TILESIZE*0.74, TILESIZE*0.62, TILESIZE*0.62)
  }
  setTimeout(Draw, 1000 / 10);
};
canvas.oncontextmenu = function(e) {
  for (var i in TileMap) {
    for (var h in TileMap[i]) {
      if (e.pageX > h * TILESIZE && e.pageX < h * TILESIZE + TILESIZE &&
        e.pageY > i * TILESIZE && e.pageY < i * TILESIZE + TILESIZE) {
        TileMap[i][h].texture = 'cut grass';
      }
    }
  }
  return (('preventDefault' in e) ? e.preventDefault() : false);
};
canvas.onmousedown = function(e) {
  for (let i = 0; i < TileMap.length; i++) {
    for (let h = 0; h < TileMap[i].length; h++) {
      if (e.pageX > h * TILESIZE && e.pageX < h * TILESIZE + TILESIZE &&
        e.pageY > i * TILESIZE && e.pageY < i * TILESIZE + TILESIZE) {
        let direction;
        if(selected=='rails') direction = (TileMap[i+1][h].texture.includes('rail') || TileMap[i-1][h].texture.includes('rail')) ? 'vertical' : 'horizantal'
        if(selected=='rails') TileMap[i][h].texture = direction + ' rails';
      }
    }
  }
  return (('preventDefault' in e) ? e.preventDefault() : false);
};

let money = 12345678.98;
let selected = 'rails';
window.onload = function () {
  Draw();

};