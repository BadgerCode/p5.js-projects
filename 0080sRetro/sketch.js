let cols = 55;
let rows = 56;
let boxWidth = 30;
let xOffset;
let yOffset;
let noiseScale = 0.1;
let noiseYOffset = 0;

let heightMap = Array();
let heightMapOffset = 0;
let heightMapPosition = 0;

let maxHue = 40;
let hues = Array();

let fpsDiv;

let lastFrameStart;

var fpsCountEnabled = 0;
let framesBetweenShifts = 3;
let framesTilShift = framesBetweenShifts;
let cameraShiftPerFrame;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    fpsDiv = createFPSElement();
    colorMode(HSB)

    xOffset = -cols * boxWidth / 2;
    yOffset = -rows * boxWidth * 0.80;
    cameraShiftPerFrame = boxWidth / (framesBetweenShifts+1);

    var hueMultiplier = maxHue / rows;

    for (var y = 0; y < rows+1; y++) {
        var row = Array();
        for (var x = 0; x < cols+1; x++) {
            row.push(map(noise(x * noiseScale, y * noiseScale), 0, 1, 0, 300));
        }

        heightMap.push(row);
        hues.push(maxHue - hueMultiplier * y);
    }

    lastFrameStart = millis();
}

function keyPressed(){
    if(keyCode == 32){
        fpsCountEnabled = ++fpsCountEnabled % 2;
        fpsDiv.style('display', fpsCountEnabled ? 'block' : 'none');
    }
}

function draw() {

    if(fpsCountEnabled)
        setFrameDuration(millis() - lastFrameStart);

    lastFrameStart = millis();
    background(10);

    translate(0, 200, 300);
    rotateX(PI / 3.5);

    translate(xOffset, yOffset, 0);

    var shouldShiftHeightMapRows = framesTilShift <= 0;

    if(shouldShiftHeightMapRows){
        shiftHeightMapRows();
    }
    else {
        var yShift = cameraShiftPerFrame * (framesBetweenShifts - framesTilShift + 1);
        translate(0, yShift, 0);
        framesTilShift--;
    }

    noStroke();
    beginShape(LINES);

    for (var y = 1; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
            var heightTL = getHeight(y, x);
            var heightBL = getHeight(y+1, x);
            var heightTR = getHeight(y, x+1);

            fill(hues[y], 100, 100);
            vertex(x * boxWidth, y * boxWidth, heightTL);
            vertex(x * boxWidth, (y+1) * boxWidth, heightBL);

            vertex(x * boxWidth, y * boxWidth, heightTL);
            vertex((x+1) * boxWidth, y * boxWidth, heightTR);

            vertex(x * boxWidth, (y+1) * boxWidth, heightBL);
            vertex((x+1) * boxWidth, y * boxWidth, heightTR);
        }

        vertex(cols * boxWidth, y * boxWidth, heightTR);
        vertex(cols * boxWidth, (y+1) * boxWidth, getHeight(y+1, cols));
    }

    endShape();
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

    framesTilShift = framesBetweenShifts;
}

function createFPSElement(){
    var div = createDiv("Message");

    div.style('position', 'absolute');
    div.style('color', 'white');
    div.style('left', '0');
    div.style('top', '0');
    div.style('display', 'none');

    return div;
}

function setFrameDuration(frameDuration){
    fpsDiv.html("FPS: " + Math.round(1000/frameDuration) + "<br>Frame duration: " + Math.round(frameDuration));
}