const WIDTH = 800;
const HEIGHT = 800;
const TILE_SIZE = 80;

const TILE_WIDTH = WIDTH / TILE_SIZE;
const TILE_HEIGHT = HEIGHT / TILE_SIZE;

let snake;
let food;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  snake = new Snake();
  food = new Food();
}

function draw() {
  update();

  background(125);
  food.draw();
  snake.draw();
}

function update(){
  var newDirection = snake.direction;

  if(keyIsDown(68))
    newDirection = 0;
  else if(keyIsDown(83))
    newDirection = 1;
  else if(keyIsDown(65))
    newDirection = 2;
  else if(keyIsDown(87))
    newDirection = 3;

  if(newDirection % 2 != snake.direction % 2)
    snake.direction = newDirection;
  snake.update();
}

class Food {
  constructor(){
    this.x = 80;
    this.y = 80;
  }

  draw(){
    fill(255, 0, 0);
    noStroke();
    rect(this.x, this.y, TILE_SIZE, TILE_SIZE);
  }

  respawn() {
    while(snake.hasSegementAtLocation(this.x, this.y)){
      this.x = Math.round(random(TILE_WIDTH - 1)) * TILE_SIZE;
      this.y = Math.round(random(TILE_HEIGHT - 1)) * TILE_SIZE;
    }
  }
}

class Snake {
  constructor(){
    this.respawn();
  }

  respawn(){
    this.lastMove = millis();
    this.direction = 0;
    this.segments = [ createVector(320, 320), createVector(240, 320) ];
  }

  update(){
    if(!this.timeToMove())
      return;

    this.lastMove = millis();

    var tail = this.segments[this.segments.length - 1];
    var previousTailPos = createVector(tail.x, tail.y);

    for(var i = this.segments.length - 1; i > 0; i--){
      var segment = this.segments[i];
      var previousSegment = this.segments[i - 1];

      segment.x = previousSegment.x;
      segment.y = previousSegment.y;
    }

    var firstSegment = this.segments[0];
    var newHeadPos = createVector(firstSegment.x, firstSegment.y);
    switch(this.direction){
      case 0:
        newHeadPos.x = (newHeadPos.x + TILE_SIZE) % WIDTH;
        break;
      case 1:
        newHeadPos.y = (newHeadPos.y + TILE_SIZE) % HEIGHT;
        break;
      case 2:
        newHeadPos.x -= TILE_SIZE;
        if(newHeadPos.x < 0)
          newHeadPos.x = WIDTH - TILE_SIZE;
        break;
      case 3:
        newHeadPos.y -= TILE_SIZE;
        if(newHeadPos.y < 0)
          newHeadPos.y = HEIGHT - TILE_SIZE;
        break;
    }

    if(this.hasSegementAtLocation(newHeadPos.x, newHeadPos.y)){
      this.respawn();
      food.respawn();
      return;
    }

    this.segments[0] = newHeadPos;

    if(food.x == newHeadPos.x && food.y == newHeadPos.y){
      this.segments.push(previousTailPos);
      food.respawn();
    }
  }

  draw(){
    noStroke();
    fill(0, 0, 0);
    for(var i = 0; i < this.segments.length; i++){
      var segment = this.segments[i];
      rect(segment.x, segment.y, TILE_SIZE, TILE_SIZE);
    }
  }

  hasSegementAtLocation(x, y){
    for(var i = 0; i < this.segments.length; i++){
      var segment = this.segments[i];

      if(segment.x == x && segment.y == y)
        return true;
    }
    return false;
  }

  timeToMove(){
    return millis() - this.lastMove >= 250;
  }
}