let facemesh;
let video;
let predictions = [];
const indices = [409,270,269,267,0,37,39,40,185,61,146,91,181,84,17,314,405,321,375,291];

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
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
      if (keypoints[idx]) {
        // 直接用 keypoints 的 x, y，不做 width-x 鏡像
        vertex(keypoints[idx][0], keypoints[idx][1]);
      }
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(windowWidth, windowHeight);
}
