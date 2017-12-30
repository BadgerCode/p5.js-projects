function setup(){
    createCanvas(windowWidth, windowHeight, WEBGL);
    colorMode(HSB);
}

function draw(){
    background(15);

    noFill();
    stroke(255);

    push();
        rotateY(frameCount * 0.1);
        rect(10, 10, 40, 40);
    pop();
}