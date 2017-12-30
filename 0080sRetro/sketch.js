let cols = 20;
let rows = 40;
let boxWidth = 40;
let xOffset = -cols * boxWidth / 2;
let yOffset = -rows * boxWidth / 2;
let noiseScale = 0.0055;
let noiseYOffset = 0;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    colorMode(HSB)
}

function draw() {
    background(0);

    translate(0, 200, 300);
    rotateX(PI / 2.5);

    translate(xOffset, yOffset, 0);

    noFill();
    stroke(280, 100, 100);

    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
            beginShape(TRIANGLES);
            drawPoint(x * boxWidth, y * boxWidth);
            drawPoint(x * boxWidth, (y+1) * boxWidth);
            drawPoint((x+1) * boxWidth, y * boxWidth);
            endShape();
            beginShape(TRIANGLES);
            drawPoint(x * boxWidth, (y+1) * boxWidth);
            drawPoint((x+1) * boxWidth, y * boxWidth);
            drawPoint((x+1) * boxWidth, (y+1) * boxWidth);
            endShape();
        }
    }

    //noiseYOffset -= 30;
}

function drawPoint(x, y){
    vertex(x, y, map(noise(x * noiseScale, (y+noiseYOffset) * noiseScale), 0, 1, 0, 200));
}