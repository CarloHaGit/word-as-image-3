var mic;
var fft;
var waveform;
var spectrum;

let avg = 0;
let weightMap = 0;
let avgCounter = 0; //Um die ersten falschen Messdaten zu überspringen
let lowestAvg;
let highestAvg;

let avgLow = 0;
let widthMap = 0;
let avgCounterLow = 0; //Um die ersten falschen Messdaten zu überspringen
let lowestAvgLow;
let highestAvgLow;

let avgHigh = 0;
let weightMapHigh = 0;
let avgCounterHigh = 0; //Um die ersten falschen Messdaten zu überspringen
let lowestAvgHigh;
let highestAvgHigh;

let startingX = 0;
let startingY = 0;
let typeSize;
let typeSpacing;
let typeWidth;
let typeWeight;
let typeRadius;
let typeColor = color(255,0,0);
let defaultTypeColor = color(0); 
let colorCounter = 255;

let maxWeight;

let charSlider;
let threshholdSlider;

let spaceNeeded = true;

let charString = ["g"];

function setup() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
      console.log("You let me use your mic!");
    })
    .catch(function (err) {
      console.log("No mic for you!");
    });
  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT(0.95, 256);
  fft.setInput(mic);

  createCanvas(displayWidth, displayHeight);

  startingX = displayHeight * 0.01;
  startingY = displayHeight * 0.01;
  typeSpacing = 43;
  typeSize = 1;

  charSlider = createSlider(0, 25, 0, 1);
  charSlider.position(displayWidth / 2, displayHeight * 0.95);

  threshholdSlider = createSlider(0, 100, 0, 0.5);
  threshholdSlider.position(displayWidth / 2, displayHeight * 0.85);
}

/*function mousePressed() {
  if (
    mouseX > 0 &&
    mouseX < displayWidth &&
    mouseY > 0 &&
    mouseY < displayHeight
  ) {
    let fs = fullscreen();
    fullscreen(true);
  }
}*/

function touchStarted() {
  getAudioContext().resume();
}

function draw() {
  //translate(startingX,startingY);
  background(255);
  fill(100, 100, 100);

  drawType();
}

function drawType() {
  micLevel = mic.getLevel(1); //(0.005)
  micLevelMap = map(micLevel, 0, 1, 5, 35);

  spectrum = fft.analyze();

  //AVG für alle Frequenzbänder
  avg = 0;
  weightMap = 0;
  for (var i = 0; i < 255; i++) {
    avg += spectrum[i];
  }

  if (avgCounter < 46) {
    avg = 40;
    avgCounter++;
    radiusMap = map(40, 0, 255, 30, 0);
    widthMap = map(40, 15, 200, typeWeight * 2 + 10, displayWidth);
    weightMap = map(40, 0, 100, 80, 1);
  } else {
    radiusMap = map(calculateAverage(0, 255), 0, 255, 35, -50);
    if (radiusMap < 0) {
      radiusMap = 0;
    }
    widthMap = map(
      calculateAverage(0, 10),
      15,
      255,
      typeWeight * 2 + 10,
      displayWidth
    );
    weightMap = map(calculateAverage(0, 255), 0, 255, 75, 1);
  }

  currentX = startingX + weightMap / 2;
  currentY = startingY;

  translate(currentX, currentY);

  typeRadius = radiusMap;

  ascenders = 0 + weightMap / 2; //windowHeight * 0.01;
  stroke(2);
  line(0, ascenders, displayWidth, ascenders);
  text("ascenders", displayWidth / 2, ascenders);
    
  unders = displayHeight * 0.94 - weightMap / 2;
  line(0, unders, displayWidth, unders);
  text("descenders", displayWidth / 2, unders);

  typeWeight = weightMap;

  let length = unders - ascenders;

  xHeight = length * 0.27745664739 + weightMap;
  line(0, xHeight, displayWidth, xHeight);
  text("xHeight", displayWidth / 2, xHeight);

  marki = length * 0.10789980732 + weightMap;
  line(0, marki, displayWidth, marki);
  text("marki", displayWidth / 2, marki);

  mark1 = length * 0.36223506743 + weightMap;
  line(0, mark1, displayWidth, mark1);
  text("mark1", displayWidth / 2, mark1);

  mark2 = length * 0.53179190751;
  line(0, mark2, displayWidth, mark2);

  text("mark2", displayWidth / 2, mark2);

  mark3 = length * 0.70134874759;
  line(0, mark2, displayWidth, mark2);

  text("mark3", displayWidth / 2, mark3);

  baseLine = length * 0.82851637764 + weightMap / 2;
  line(0, baseLine, displayWidth, baseLine);

  text("baseline", displayWidth / 2, baseLine);

  //typeWidth = widthSlider.value() - typeWeight;
  typeWidth = widthMap - typeWeight;

  // startingX = displayWidth/2 - typeWeight/2;
  // startingY = displayHeight/2 - length*0.5;

  // console.log("charwidth: " + typeWidth + " charWeight: " + typeWeight + " verhaeltnis: " + typeWeight/typeWidth);
  /*if (mark2 - typeWeight / 2 - (mark1 + typeWeight / 2) < 5) {
    ellipse(20, 20, 20, 20);
  }*/

  noStroke();
  fill(typeColor);
    if(typeColor != defaultTypeColor){
        colorCounter--;
    }
    else{
       colorCounter=255; 
    }
    
    typeColor = color(colorCounter, 0,0);

  var ca = [
    [0, mark1],
    [0, xHeight],
    [typeWidth, xHeight],
    [typeWidth, baseLine],
    [0, baseLine],
    [0, mark2],
    [typeWidth, mark2],
  ];

  var cb = [
    [0, ascenders],
    [0, baseLine],
    [typeWidth, baseLine],
    [typeWidth, xHeight],
    [0, xHeight],
  ];

  var cc = [
    [typeWidth, mark2],
    [typeWidth, xHeight],
    [0, xHeight],
    [0, baseLine],
    [typeWidth, baseLine],
    [typeWidth, mark3],
  ];

  var cd = [
    [typeWidth, ascenders],
    [typeWidth, baseLine],
    [0, baseLine],
    [0, xHeight],
    [typeWidth, xHeight],
  ];

  var ce = [
    [typeWidth, mark3],
    [typeWidth, baseLine],
    [0, baseLine],
    [0, xHeight],
    [typeWidth, xHeight],
    [typeWidth, mark2],
    [0, mark2],
  ];

  var cf = [
    [0, baseLine],
    [0, ascenders],
    [typeWidth, ascenders],
    [typeWidth, mark1],
    ["NEWSHAPE"],
    [0, mark2],
    [typeWidth, mark2],
  ];

  var cg = [
    [0, unders],
    [typeWidth, unders],
    [typeWidth, xHeight],
    [0, xHeight],
    [0, baseLine],
    [typeWidth, baseLine],
  ];

  var ch = [
    [0, ascenders],
    [0, baseLine],
    ["NEWSHAPE"],
    [0, xHeight],
    [typeWidth, xHeight],
    [typeWidth, baseLine],
  ];

  var ci = [
    [0, ascenders],
    [0, marki],
    ["NEWSHAPE"],
    [0, xHeight],
    [0, baseLine],
  ];

  var cj = [
    [typeWidth, ascenders],
    [typeWidth, marki],
    ["NEWSHAPE"],
    [typeWidth, xHeight],
    [typeWidth, unders],
    [0, unders],
    [0, xHeight],
  ];

  var ck = [
    [0, ascenders],
    [0, baseLine],
    ["NEWSHAPE"],
    [0, mark2],
    [typeWidth, mark2],
    ["NEWSHAPE"],
    [typeWidth, xHeight],
    [typeWidth, baseLine],
  ];

  var cl = [
    [0, ascenders],
    [0, baseLine],
    [typeWidth, baseLine],
    [typeWidth, baseLine],
    [typeWidth, xHeight + 42 * typeSize],
  ];

  var cm = [
    [0, baseLine],
    [0, xHeight],
    [typeWidth, xHeight],
    [typeWidth, baseLine],
    [typeWidth, xHeight],
    [typeWidth * 2, xHeight],
    [typeWidth * 2, baseLine],
  ];

  var cn = [
    [0, baseLine],
    [0, xHeight],
    [typeWidth, xHeight],
    [typeWidth, baseLine],
  ];

  var co = [
    [0, xHeight],
    [typeWidth, xHeight],
    [typeWidth, baseLine],
    [0, baseLine],
    [0, xHeight],
  ];

  var cp = [
    [0, unders],
    [0, xHeight],
    [typeWidth, xHeight],
    [typeWidth, baseLine],
    [0, baseLine],
  ];

  var cq = [
    [typeWidth, unders],
    [typeWidth, xHeight],
    [0, xHeight],
    [0, baseLine],
    [typeWidth, baseLine],
  ];

  var cr = [
    [0, baseLine],
    [0, xHeight],
    [typeWidth, xHeight],
    [typeWidth, mark2],
  ];

  var cs = [
    [typeWidth, mark1],
    [typeWidth, xHeight],
    [0, xHeight],
    [0, mark2],
    [typeWidth, mark2],
    [typeWidth, baseLine],
    [0, baseLine],
    [0, mark3],
  ];

  var ct = [
    [0, ascenders],
    [0, baseLine],
    [typeWidth, baseLine],
    [typeWidth, xHeight + 120 * typeSize],
    ["NEWSHAPE"],
    [0, xHeight],
    [typeWidth, xHeight],
  ];

  var cu = [
    [0, xHeight],
    [0, baseLine],
    [typeWidth, baseLine],
    [typeWidth, xHeight],
  ];

  var cv = [
    [0, xHeight],
    [0, baseLine - 14],
    ["NEWSHAPE"],
    [typeWidth, xHeight],
    [typeWidth, baseLine - 14],
    ["NEWSHAPE"],
    [20, baseLine],
    [typeWidth - 20 * typeSize, baseLine],
  ];

  var cw = [
    [0, xHeight],
    [0, baseLine],
    [typeWidth, baseLine],
    [typeWidth, xHeight],
    [typeWidth, baseLine],
    [typeWidth * 2, baseLine],
    [typeWidth * 2, xHeight],
  ];

  var cx = [
    [0, xHeight],
    [0, mark2],
    [typeWidth, mark2],
    [typeWidth, xHeight],
    ["NEWSHAPE"],
    [0, baseLine],
    [0, mark3],
    [typeWidth, mark3],
    [typeWidth, baseLine],
    ["NEWSHAPE"],
    [typeWidth / 2, mark3],
    [typeWidth / 2, mark2],
  ];

  var cy = [
    [0, xHeight],
    [0, baseLine],
    [typeWidth, baseLine],
    ["NEWSHAPE"],
    [typeWidth, xHeight],
    [typeWidth, unders],
    [0, unders],
  ];

  var cz = [
    [0, mark1],
    [0, xHeight],
    [typeWidth, xHeight],
    [typeWidth, mark2],
    [0, mark2],
    [0, baseLine],
    [typeWidth, baseLine],
    [typeWidth, mark3],
  ];

  var cspace = []; // [["SPACE"], ["SPACE"]];
  var chenter = [["ENTER"], ["ENTER"]];

  currentChar = [];
  previousChar = [];

  //for (let j = 0; j < charString.length; j++) {
  for (let j = 0; j < 1; j++) {
    if (j > 0) {
      previousChar = currentChar;
    }
    //switch (charString[j]) {

    switch (charSlider.value()) {
      case 0:
        currentChar = ca;
        break;
      case 1:
        currentChar = cb;
        break;
      case 2:
        currentChar = cc;
        break;
      case 3:
        currentChar = cd;
        break;
      case 4:
        currentChar = ce;
        break;
      case 5:
        currentChar = cf;
        break;
      case 6:
        currentChar = cg;
        break;
      case 7:
        currentChar = ch;
        break;
      case 8:
        currentChar = ci;
        break;
      case 9:
        currentChar = cj;
        break;
      case 10:
        currentChar = ck;
        break;
      case 11:
        currentChar = cl;
        break;
      case 12:
        currentChar = cm;
        break;
      case 13:
        currentChar = cn;
        break;
      case 14:
        currentChar = co;
        break;
      case 15:
        currentChar = cp;
        break;
      case 16:
        currentChar = cq;
        break;
      case 17:
        currentChar = cr;
        break;
      case 18:
        currentChar = cs;
        break;
      case 19:
        currentChar = ct;
        break;
      case 20:
        currentChar = cu;
        break;
      case 21:
        currentChar = cv;
        break;
      case 22:
        currentChar = cw;
        break;
      case 23:
        currentChar = cx;
        break;
      case 24:
        currentChar = cy;
        break;
      case 25:
        currentChar = cz;
        break;
      case " ":
        currentChar = cspace;
        break;
      case "'":
        currentChar = cspace;
        break;
      case "Enter":
        spaceNeeded = false;
        currentChar = chenter;
        currentY = currentY + 20 * typeSize;
        currentX = startingX;
        break;
      default:
        break;
    }

    var theta;
    var dx;
    var dy;
    let previousPoint = [];
    let currentPoint = [];
    //  translate(currentX, currentY); //HÄ?

    beginShape();

    for (let i1 = 0; i1 < currentChar.length; i1++) {
      if (i1 > 0) {
        previousPoint = currentPoint; //fehleranfällig falls prev       leer ist?
      }
      currentPoint = [currentChar[i1][0], currentChar[i1][1]];

      if (i1 > 0) {
        if (currentChar[i1][0] == "NEWSHAPE") {
          endShape();
          beginShape();
        } else {
          dy = currentPoint[1] - previousPoint[1];
          dx = currentPoint[0] - previousPoint[0];

          theta = Math.atan2(dy, dx);
          theta *= 180 / Math.PI;

          switch (theta) {
            case 0: //rechts
              rect(
                previousPoint[0] - typeWeight / 2,
                previousPoint[1] - typeWeight / 2,
                dx + typeWeight,
                typeWeight,
                typeRadius
              );
              break;
            case 90: //runter
              rect(
                previousPoint[0] - typeWeight / 2,
                previousPoint[1] - typeWeight / 2,
                typeWeight,
                dy + typeWeight,
                typeRadius
              );
              break;
            case 180: //links
              rect(
                previousPoint[0] + typeWeight / 2,
                previousPoint[1] - typeWeight / 2,
                dx - typeWeight,
                typeWeight,
                typeRadius
              );
              break;
            case -90: //hoch
              rect(
                previousPoint[0] - typeWeight / 2,
                previousPoint[1] + typeWeight / 2,
                typeWeight,
                dy - typeWeight,
                typeRadius
              );
              break;
            default:
              break;
          }
        }
      }

      endShape();
    }

    if (currentChar == cm || currentChar == cw) {
      typeSpacing = typeWidth * 2;
    } else if (currentChar == ci) {
      typeSpacing = 0;
    } else {
      typeSpacing = 43;
    }

    if (spaceNeeded) {
      if (currentChar == cspace) {
        typeSpacing = 36;
        currentX += typeSpacing;
        spaceNeeded = false;
      } else {
        currentX += typeWidth + typeSpacing; // das sind die buchstaben
      }
    }
    spaceNeeded = true;
  }
}

function calculateAverage(min, max) {
  avg = 0;
  for (var i = min; i < max; i++) {
    avg += spectrum[i];
  }
  let frequencies = max - min;
  avg = avg / frequencies;

  console.log(avg);

  
  //////OPTIONAL TRESHHOLD
  let threshAvg = 0;
  for (var j = 0; j < 255; j++) {
    threshAvg += spectrum[j];
  }
  threshAvg = threshAvg / 255;
  

  if (threshAvg < threshholdSlider.value()) {
    avg = 40;
  }
  ////////////

  //////records for colors
  if (lowestAvg == null) {
    lowestAvg = avg;
  } else if (avg < lowestAvg) {
    lowestAvg = avg;
  }
  if (highestAvg == null) {
    highestAvg = avg;
  } else if (avg > highestAvg) {
    highestAvg = avg;
    color(255,0,0);
  }
  
  return avg;
}
