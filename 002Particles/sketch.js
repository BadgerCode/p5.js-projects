let particles = [];
let iterationsTilSpawn = 0;
let hue = 5;
let hueDir = 5;

function setup() {
  createCanvas(640, 480);
  colorMode(HSB);

  stroke(0, 0);
}

function draw() {
    background(0);

    for(var i = particles.length - 1; i >= 0; i--){
        particles[i].draw();
        particles[i].update();

        if(particles[i].shouldKill())
            particles.splice(i, 1);
    }

    if(iterationsTilSpawn <= 0){
        particles.push(new Particle(hue));
        hue += hueDir;
        if(hue <= 5 || hue >= 45)
            hueDir *= -1;

        iterationsTilSpawn = Random(6, 13);
    }
    else {
        iterationsTilSpawn--;
    }
}

function Random(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

class Particle {
    constructor(hue){
        this.x = 320;
        this.y = 465;
        this.alpha = 255;
        this.hue = hue;
    }

    update(){
        this.alpha -= 3;
        this.x += Random(-1, 1);
        this.y += Random(-5, -2);
    }

    shouldKill(){
        return this.alpha <= 0;
    }

    draw(){
        fill(this.hue, 255, this.alpha);
        ellipse(this.x, this.y, 50);
    }
}