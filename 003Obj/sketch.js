var thing;
var img;
var zTranslate = 0;

function setup(){
  createCanvas(500, 500, WEBGL);

  thing = loadModel('thing.obj', true);
  img = loadImage("picture.jpg");
}

function draw(){
  background(200);
  
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);

  texture(img);

  push();
    translate(0, -50, zTranslate);
    model(thing);
  pop();

  push();
    translate(0, 50, 0);
    rotateY(frameCount * 0.1);
    rotateX(frameCount * 0.5);
    rotateZ(PI);
    model(thing);
  pop();

  push();
    translate(100, 0, 0);
    rotateY(frameCount * 0.1);
    model(thing);
  pop();
  
}