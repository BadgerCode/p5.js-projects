var thing;
var img;

var yRot = 0;
var z = 0;

function setup(){
  createCanvas(500, 500, WEBGL);

  thing = loadModel('thing.obj', true);
  img = loadImage("picture.png");
}

function draw(){
  background(200);
  
  update();

  translate(0, 0, z);
  rotateY(yRot);

  texture(img);

  push();
    model(thing);
  pop();
}

function update() {
    if(keyIsDown(UP_ARROW))
        z += 5;
    else if(keyIsDown(DOWN_ARROW))
        z -= 5;

    if(keyIsDown(LEFT_ARROW))
        yRot -= 0.2;
    else if(keyIsDown(RIGHT_ARROW))
        yRot += 0.2;
}