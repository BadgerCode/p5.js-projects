let cols = 25;
let rows = 40;
let boxWidth = 40;
let xOffset = -cols * boxWidth / 2;
let yOffset = -rows * boxWidth + 400;
let noiseScale = 0.1;
let noiseYOffset = 0;

let heightMap;
let heightMapOffset = 0;
let heightMapPosition = 0;

let maxHue = 40;
let hueMultiplier = maxHue / rows;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    colorMode(HSB)

    heightMap = Array();
    for (var y = 0; y < rows+1; y++) {
        var row = Array();
        for (var x = 0; x < cols+1; x++) {
            row.push(map(noise(x * noiseScale, y * noiseScale), 0, 1, 0, 300));
        }

        heightMap.push(row);
    }
}

function draw() {
    background(10);

    translate(0, 200, 300);
    rotateX(PI / 2.5);

    translate(xOffset, yOffset, 0);

    noFill();
    
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
            stroke(maxHue - hueMultiplier * y, 100, 100);
            beginShape(TRIANGLES);
            vertex(x * boxWidth, y * boxWidth, getHeight(y, x));
            vertex(x * boxWidth, (y+1) * boxWidth, getHeight(y+1, x));
            vertex((x+1) * boxWidth, y * boxWidth, getHeight(y, x+1));

            vertex(x * boxWidth, (y+1) * boxWidth, getHeight(y+1, x));
            vertex((x+1) * boxWidth, y * boxWidth, getHeight(y, x+1));
            vertex((x+1) * boxWidth, (y+1) * boxWidth, getHeight(y+1, x+1));
            endShape();
        }
    }

    shiftHeightMapRows();
}

function getHeight(y, x){
    var yIndex = (y+heightMapOffset) % (rows+1);
    return heightMap[yIndex][x];
}

function shiftHeightMapRows(){
    heightMapPosition--;

    var row = Array();
    for (var x = 0; x < cols+1; x++) {
        row.push(map(noise(x * noiseScale, heightMapPosition * noiseScale), 0, 1, 0, 300));
    }

    heightMap[heightMapOffset] = row;

    heightMapOffset--;
    if(heightMapOffset < 0)
        heightMapOffset = rows;
}