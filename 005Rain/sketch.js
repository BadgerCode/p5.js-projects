const WIDTH = 640;
const HEIGHT = 480;

let particles = [];
let iterationsTilSpawn = 0;

function setup() {
  createCanvas(WIDTH, HEIGHT);
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
        iterationsTilSpawn = Random(3, 6);
    }
    else {
        iterationsTilSpawn--;
    }
}

function Random(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

class RainDrop {
    constructor(){
        this.x = Random(10, 640);
        this.y = 0;

        this.width = 7;
        this.height = 30;

        this.hue = Random(230, 255);

        this.falling = true;
        this.speed = Random(5, 10);
        this.maxY = Math.floor(HEIGHT - this.width / 2);
    }

    update(){
        if(this.falling){
            this.y += this.speed;
            this.falling = this.y < this.maxY;
        }
        else {
            this.y++;
            this.width += 2;
            this.height -= 2;
        }
    }

    shouldKill(){
        return this.height < 15;
    }

    draw(){
        fill(this.hue, 50, 75);
        ellipse(this.x, this.y, this.width, this.height);
    }
}