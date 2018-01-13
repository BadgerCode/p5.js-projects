let cols = 55;
let rows = 56;
let boxWidth = 30;
let xOffset;
let yOffset;
let noiseScale = 0.1;
let xMinHeights = [];
let xMaxHeights = [];
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

let backgroundWidth;
let backgroundHeight;
const backgroundRows = 75;
const startBackgroundColour = [168, 53.6, 11];
const endBackgroundColour = [312, 42, 69];
const backgroundColourChange = [
    (endBackgroundColour[0]-startBackgroundColour[0])/backgroundRows, 
    (endBackgroundColour[1]-startBackgroundColour[1])/backgroundRows, 
    (endBackgroundColour[2]-startBackgroundColour[2])/backgroundRows
];

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    fpsDiv = createFPSElement();
    colorMode(HSB)

    xOffset = -cols * boxWidth / 2;
    yOffset = -rows * boxWidth * 0.80;
    cameraShiftPerFrame = boxWidth / (framesBetweenShifts+1);

    backgroundWidth = windowWidth * 2;
    backgroundHeight = windowHeight * 2;

    var hueMultiplier = maxHue / rows;

    generateXHeights();
    generateHeightMap();

    for (var y = 0; y < rows+1; y++) {
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

    drawbackground();

    push();
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
    pop();
}

function drawbackground() {
    var rowHeight = backgroundHeight / backgroundRows;
    var currentColour = startBackgroundColour.slice();

    background(25);

    push();
    translate(-backgroundWidth/2, -backgroundHeight/2, -500);
    

    for(var i = 0; i < backgroundRows; i++){
        var y = i * rowHeight;

        beginShape();
        fill(currentColour);
        vertex(0, y, 0);
        vertex(backgroundWidth, y, 0);
        vertex(backgroundWidth, y + rowHeight, 0);
        vertex(0, y + rowHeight, 0);
        endShape(CLOSE);

        currentColour[0] += backgroundColourChange[0];
        currentColour[1] += backgroundColourChange[1];
        currentColour[2] += backgroundColourChange[2];
    }
    pop();
}

function generateXHeights(){
    for(let x = 0; x < cols+1; x++){
        
        var minHeight = 0;
        var maxHeight = minHeight + 500;

        xMinHeights.push(minHeight);
        xMaxHeights.push(maxHeight);
    }
}

function getHeight(y, x){
    var yIndex = (y+heightMapOffset) % (rows+1);
    return heightMap[yIndex][x];
}

function generateHeightMap(){
    for (var y = 0; y < rows+1; y++) {
        var row = Array();
        for (var x = 0; x < cols+1; x++) {
            row.push(generateHeight(x, y));
        }

        heightMap.push(row);
    }
}

function shiftHeightMapRows(){
    heightMapPosition--;

    var row = Array();
    for (var x = 0; x < cols+1; x++) {
        row.push(generateHeight(x, heightMapPosition));
    }

    heightMap[heightMapOffset] = row;

    heightMapOffset--;
    if(heightMapOffset < 0)
        heightMapOffset = rows;

    framesTilShift = framesBetweenShifts;
}

function generateHeight(x, y){
    return map(noise(x * noiseScale, y * noiseScale), 0, 1, xMinHeights[x], xMaxHeights[x]);
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