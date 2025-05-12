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

    // 嘴唇（原本的 indices）
    drawMeshLine(keypoints, [409,270,269,267,0,37,39,40,185,61,146,91,181,84,17,314,405,321,375,291], true, color(255,0,0));

    // 左眼外部（綠色）
    drawMeshLine(keypoints, [243,190,56,28,27,29,30,247,130,25,110,24,23,22,26,112,243], true, color(0,255,0));
    // 左眼內部（綠色）
    drawMeshLine(keypoints, [133,173,157,158,159,160,161,246,33,7,163,144,145,153,154,155,133], true, color(0,255,0));
    // 右眼外部（藍色）
    drawMeshLine(keypoints, [359,467,260,259,257,258,286,414,463,341,256,252,253,254,339,255,359], true, color(0,0,255));
    // 右眼內部（藍色）
    drawMeshLine(keypoints, [263,466,388,387,386,385,384,398,362,382,381,380,374,373,390,249,263], true, color(0,0,255));
  }
}

function drawMeshLine(keypoints, arr, closeShape = true, col = color(255,0,0)) {
  stroke(col);
  strokeWeight(5);
  noFill();
  beginShape();
  for (let i = 0; i < arr.length; i++) {
    const idx = arr[i];
    if (keypoints[idx]) {
      vertex(keypoints[idx][0], keypoints[idx][1]);
    }
  }
  if (closeShape) {
    endShape(CLOSE);
  } else {
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(windowWidth, windowHeight);
}
