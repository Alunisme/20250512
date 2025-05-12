let facemesh;
let video;
let predictions = [];
const indices = [409,270,269,267,0,37,39,40,185,61,146,91,181,84,17,314,405,321,375,291];

function setup() {
  createCanvas(400, 400);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on('predict', gotResults);
}

function modelReady() {
  // console.log('Model ready!');
}

function gotResults(results) {
  predictions = results;
}

function draw() {
  background(220);
  // 鏡像翻轉，讓臉部定位與畫面一致
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  drawFaceMesh();
  pop();
}

function drawFaceMesh() {
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;
    stroke(255, 0, 0);
    strokeWeight(5);
    noFill();
    beginShape();
    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      const [x, y] = keypoints[idx];
      vertex(width - x, y); // x座標鏡像
    }
    endShape(CLOSE);
  }
}
