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
    // 取得臉部所有點的包圍盒
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      if (keypoints[idx]) {
        const [x, y] = keypoints[idx];
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
    if (minX === Infinity) return;
    // 臉部中心點
    const faceCenterX = (minX + maxX) / 2;
    const faceCenterY = (minY + maxY) / 2;
    // 畫布中心
    const canvasCenterX = width / 2;
    const canvasCenterY = height / 2;
    // 平移量
    const offsetX = canvasCenterX - faceCenterX;
    const offsetY = canvasCenterY - faceCenterY;
    stroke(255, 0, 0);
    strokeWeight(5);
    noFill();
    beginShape();
    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      if (keypoints[idx]) {
        const x = keypoints[idx][0] + offsetX;
        const y = keypoints[idx][1] + offsetY;
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
