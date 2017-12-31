let cols = 25;
let rows = 40;
let boxWidth = 40;
let xOffset = -cols * boxWidth / 2;
let yOffset = -rows * boxWidth + 195;
let noiseScale = 0.1;
let noiseYOffset = 0;

let heightMap = Array();
let heightMapOffset = 0;
let heightMapPosition = 0;

let maxHue = 40;
let hueMultiplier = maxHue / rows;
let hues = Array();

let fpsDiv;
let frameDurationAverage = 0;
let frameDurationReadings = 0;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    fpsDiv = createFPSElement();
    colorMode(HSB)

    for (var y = 0; y < rows+1; y++) {
        var row = Array();
        for (var x = 0; x < cols+1; x++) {
            row.push(map(noise(x * noiseScale, y * noiseScale), 0, 1, 0, 300));
        }

        heightMap.push(row);
        hues.push(maxHue - hueMultiplier * y);
    }
}

function draw() {
    var startTime = millis();
    background(10);

    translate(0, 200, 300);
    rotateX(PI / 3.5);

    translate(xOffset, yOffset, 0);

    noFill();
    
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
            var h1 = getHeight(y+1, x);
            var h2 = getHeight(y, x+1);

            stroke(hues[y], 100, 100);
            beginShape(TRIANGLES);
            vertex(x * boxWidth, y * boxWidth, getHeight(y, x));
            vertex(x * boxWidth, (y+1) * boxWidth, h1);
            vertex((x+1) * boxWidth, y * boxWidth, h2);

            vertex(x * boxWidth, (y+1) * boxWidth, h1);
            vertex((x+1) * boxWidth, y * boxWidth, h2);
            vertex((x+1) * boxWidth, (y+1) * boxWidth, getHeight(y+1, x+1));
            endShape();
        }
    }

    shiftHeightMapRows();
    addFrameDuration(millis() - startTime);
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

function createFPSElement(){
    var div = createDiv("Message");

    div.style('position', 'absolute');
    div.style('color', 'white');
    div.style('left', '0');
    div.style('top', '0');

    return div;
}

function addFrameDuration(frameDuration){
    frameDurationAverage = (frameDurationAverage * frameDurationReadings++ + frameDuration) / frameDurationReadings;

    fpsDiv.html("FPS: " + Math.round(1000/frameDurationAverage) + "<br>Frame duration: " + Math.round(frameDurationAverage));
}