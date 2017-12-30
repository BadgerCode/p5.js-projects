let particles = [];
const numParticles = 5;

function setup(){
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB);

    background(10);

    for(var i = 0; i < numParticles; i++){
        particles.push(new Particle());
    }
}

function draw(){
    if(keyIsDown(32))
        reset();

    for(var i = 0; i < particles.length; i++){
        particles[i].update();
        particles[i].draw();
    }
}

function reset(){
    background(10);

    for(var i = 0; i < particles.length; i++){
        delete particles[i];
    }

    particles = [];
    for(var i = 0; i < numParticles; i++){
        particles.push(new Particle());
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(10);
}

class Particle {
    constructor(x, y){
        this.x = Random(0, windowWidth);
        this.y = Random(0, windowHeight);
        this.width = Random(10, 17);

        this.pickVelocity();
        this.hue = Random(0, 365);
    }

    pickVelocity(){
        var min = 2;
        var max = 5;
        var decimalPlaces = 2;

        this.velocity = [];

        for(var i = 0; i < 2; i++){
            var velocity = Random(min, max, decimalPlaces);

            if(Random(0, 1) == 1)
                velocity *= -1;

            this.velocity.push(velocity);
        }
    }

    draw(){
        noStroke();
        fill(this.hue, 50, 75);
        ellipse(this.x, this.y, this.width);
    }

    update(){
        this.x += this.velocity[0];
        this.y += this.velocity[1];

        var halfSize = this.width / 2;

        if(this.velocity[0] < 0 && this.x - halfSize <= 0)
            this.velocity[0] = Math.abs(this.velocity[0]);
        
        else if(this.velocity[0] > 0 && this.x + halfSize >= windowWidth)
            this.velocity[0] = Math.abs(this.velocity[0]) * -1;

        if(this.velocity[1] < 0 && this.y - halfSize <= 0)
            this.velocity[1] = Math.abs(this.velocity[1]);
        
        else if(this.velocity[1] > 0 && this.y + halfSize >= windowHeight)
            this.velocity[1] = Math.abs(this.velocity[1]) * -1;
    }
}

function Random(min, max, decimalPlaces=0){
    var scale = 1;
    for(var i = 0; i < decimalPlaces; i++)
        scale *= 10;

    return Math.round((Math.random()*(max-min)+min) * scale) / scale;
}
