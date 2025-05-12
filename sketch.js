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
  // 直接顯示 video，不做鏡像翻轉
  image(video, 0, 0, width, height);
  drawFaceMesh();
}

function drawFaceMesh() {
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;
    // 計算所有點的中心點
    let sumX = 0, sumY = 0, count = 0;
    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      if (keypoints[idx]) {
        sumX += keypoints[idx][0];
        sumY += keypoints[idx][1];
        count++;
      }
    }
    if (count === 0) return;
    const centerX = sumX / count;
    const centerY = sumY / count;
    // 計算畫布中心
    const canvasCenterX = width / 2;
    const canvasCenterY = height / 2;
    // 將線條平移到畫布中心
    stroke(255, 0, 0);
    strokeWeight(5);
    noFill();
    beginShape();
    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      if (keypoints[idx]) {
        const x = keypoints[idx][0] - centerX + canvasCenterX;
        const y = keypoints[idx][1] - centerY + canvasCenterY;
        vertex(x, y);
      }
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(windowWidth, windowHeight);
}
