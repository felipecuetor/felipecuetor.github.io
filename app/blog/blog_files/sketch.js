function setup() {
  var canvas = createCanvas(200, 200, WEBGL);
  canvas.parent('sketch-holder');
}

function draw() {
  background(200);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  box(50);
}
