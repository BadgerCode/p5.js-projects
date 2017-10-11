let particles = [];
let iterationsTilSpawn = 0;

function setup() {
  createCanvas(640, 480);

  stroke(0, 0);
}

function draw() {
    background(255);

    for(var i = particles.length - 1; i >= 0; i--){
        particles[i].draw();
        particles[i].update();

        if(particles[i].shouldKill())
            particles.splice(i, 1);
    }

    if(iterationsTilSpawn <= 0){
        particles.push(new Particle());
        iterationsTilSpawn = Random(3, 8);
    }
    else {
        iterationsTilSpawn--;
    }
}

function Random(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

class Particle {
    constructor(){
        this.x = 320;
        this.y = 465;
        this.fill = 255;
    }

    update(){
        this.fill -= 2;
        this.x += Random(-1, 1);
        this.y += Random(-5, -2);
    }

    shouldKill(){
        return this.fill <= 0;
    }

    draw(){
        fill(255, 204, 0, this.fill);
        ellipse(this.x, this.y, 20);
    }
}