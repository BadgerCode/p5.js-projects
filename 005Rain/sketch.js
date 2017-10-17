let particles = [];
let iterationsTilSpawn = 0;

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
        iterationsTilSpawn = Random(2, 4);
    }
    else {
        iterationsTilSpawn--;
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function Random(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

class RainDrop {
    constructor(){
        this.x = Random(0, windowWidth);
        this.y = 0;

        this.width = 3;
        this.height = 30;

        this.hue = (this.x / windowWidth) * 365;

        this.falling = true;
        this.speed = Random(8, 15);
        this.maxY = Math.floor(windowHeight - this.height / 2);

        this.puddleWidth = 2;
        this.puddleHeight = 4;
        this.maxPuddleWidth = Random(20, 30);
    }

    update(){
        if(this.falling){
            this.y += this.speed;
            this.falling = this.y < this.maxY;
        }
        else {
            this.y++;
            this.puddleWidth+=2;
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