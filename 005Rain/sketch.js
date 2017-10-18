let particles = [];
let iterationsTilSpawn = 0;
let hueStart = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  stroke(0, 0);
}

function draw() {
    background(10);

    for(var i = particles.length - 1; i >= 0; i--){
        particles[i].draw();
        particles[i].update();

        if(particles[i].shouldKill())
            particles.splice(i, 1);
    }

    if(iterationsTilSpawn <= 0){
        particles.push(new RainDrop());
        iterationsTilSpawn = Random(-1, 4);
    }
    else {
        iterationsTilSpawn--;
    }

    hueStart = (hueStart + 1) % 360;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  for(var i = 0; i < particles.length; i++){
    particles[i].updateMaxY();
  }
}

function Random(min, max){
    return Math.floor(RandomDouble(min, max));
}

function RandomDouble(min, max){
    return Math.random()*(max-min)+min;
}

class RainDrop {
    constructor(){
        this.x = Random(0, windowWidth);
        this.y = 0;

        this.width = 3;
        this.height = Random(30,50);

        this.hue = ((this.x / windowWidth) * 360 + hueStart) % 360;

        this.falling = true;
        this.speed = Random(30, 35);
        this.updateMaxY();

        this.puddleWidth = 3;
        this.puddleHeight = 6;
        this.puddleGrowthRate = RandomDouble(2, 6);
        this.maxPuddleWidth = this.puddleWidth + Random(5, 15) * this.puddleGrowthRate;
    }

    updateMaxY(){
        this.maxY = Math.floor(windowHeight - this.height);
    }

    update(){
        this.y += this.speed;

        if(this.falling){
            this.falling = this.y < this.maxY;
        }
        else {
            this.puddleWidth += this.puddleGrowthRate;
        }
    }

    shouldKill(){
        return this.puddleWidth > this.maxPuddleWidth;
    }

    draw(){
        fill(this.hue, 50, 75);
        rect(this.x, this.y, this.width, this.height);

        if(!this.falling){
            fill(this.hue, 50, 50);
            rect(this.x - this.puddleWidth / 2, windowHeight - this.puddleHeight, this.puddleWidth, this.puddleHeight);
        }
    }
}