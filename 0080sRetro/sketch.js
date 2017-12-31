let cols = 40;
let rows = 30;
let boxWidth = 40;
let xOffset = -cols * boxWidth / 2;
let yOffset = -rows * boxWidth * 0.80;
let noiseScale = 0.1;
let noiseYOffset = 0;

let heightMap = Array();
let heightMapOffset = 0;
let heightMapPosition = 0;

let maxHue = 40;
let hueMultiplier = maxHue / rows;
let hues = Array();

let fpsDiv;

let lastFrameStart;

let framesBetweenShifts = 3;
let framesTilShift = framesBetweenShifts;
let cameraShiftPerFrame = boxWidth / (framesBetweenShifts+1);

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

    lastFrameStart = millis();
}

function draw() {
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

    return div;
}

function setFrameDuration(frameDuration){
    fpsDiv.html("FPS: " + Math.round(1000/frameDuration) + "<br>Frame duration: " + Math.round(frameDuration));
}