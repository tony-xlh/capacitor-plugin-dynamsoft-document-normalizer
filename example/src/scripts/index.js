import '../styles/index.scss';
import { CameraPreview } from "capacitor-plugin-dynamsoft-camera-preview";
import { DocumentNormalizer,intersectionOverUnion } from "capacitor-plugin-dynamsoft-document-normalizer";

console.log('webpack starterkit');

let photoTaken = null;
let onPlayedListener;
let interval;
let previousResults = [];
let scanning = false;
let torchStatus = false;
let startBtn = document.getElementById("startBtn");
let toggleTorchBtn = document.getElementById("toggleTorchButton");
startBtn.addEventListener("click",startCamera);
toggleTorchBtn.addEventListener("click",toggleTorch);

initialize();

async function initialize(){
  startBtn.innerText = "Initializing...";
  await DocumentNormalizer.initLicense({license:"DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAwMjI3NzYzLVRYbFhaV0pRY205cVgyUmtiZyIsIm9yZ2FuaXphdGlvbklEIjoiMTAwMjI3NzYzIiwiY2hlY2tDb2RlIjotMTY2NDUwOTcxMH0="});
  await DocumentNormalizer.initialize();
  await CameraPreview.initialize();
  if (onPlayedListener) {
    await onPlayedListener.remove();
  }
  onPlayedListener = await CameraPreview.addListener('onPlayed', async (res) => {
    console.log(res);
    updateResolutionSelect(res.resolution);
    updateCameraSelect();
    let width = res.resolution.split("x")[0];
    let height = res.resolution.split("x")[1];
    let svg = document.getElementById("overlay");
    svg.setAttribute("viewBox","0 0 "+width+" "+height);
  });
  
  await CameraPreview.requestCameraPermission();
  await loadCameras();
  loadResolutions();
  startBtn.innerText = "Start Scanning";
  startBtn.disabled = "";
}

async function startCamera(){
  await CameraPreview.startCamera();
  toggleControlsDisplay(true);
  startScanning();
}

function toggleControlsDisplay(show){
  if (show) {
    document.getElementsByClassName("home")[0].style.display = "none";
    document.getElementsByClassName("controls")[0].style.display = "";
  }else {
    document.getElementsByClassName("home")[0].style.display = "";
    document.getElementsByClassName("controls")[0].style.display = "none";
  }
}

async function loadCameras(){
  let cameraSelect = document.getElementById("cameraSelect");
  cameraSelect.innerHTML = "";
  let result = await CameraPreview.getAllCameras();
  let cameras = result.cameras;
  for (let i = 0; i < cameras.length; i++) {
    cameraSelect.appendChild(new Option(cameras[i], i));
  }
  cameraSelect.addEventListener("change", async function() {
    console.log("camera changed");
    let camSelect = document.getElementById("cameraSelect");
    await CameraPreview.selectCamera({cameraID:camSelect.selectedOptions[0].label});
  });
}

function loadResolutions(){
  let resSelect = document.getElementById("resolutionSelect");
  resSelect.innerHTML = "";
  resSelect.appendChild(new Option("ask 480P", 1));
  resSelect.appendChild(new Option("ask 720P", 2));
  resSelect.appendChild(new Option("ask 1080P", 3));
  resSelect.appendChild(new Option("ask 2K", 4));
  resSelect.appendChild(new Option("ask 4K", 5));
  resSelect.addEventListener("change", async function() {
    let resSelect = document.getElementById("resolutionSelect");
    let lbl = resSelect.selectedOptions[0].label;
    if (lbl.indexOf("ask") != -1) {
      let res = parseInt(resSelect.selectedOptions[0].value);
      await CameraPreview.setResolution({resolution:res});
    }
  });
}

async function updateResolutionSelect(newRes){
  let resSelect = document.getElementById("resolutionSelect");
  for (let index = resSelect.options.length - 1; index >=0 ; index--) {
    let option = resSelect.options[index];
    if (option.label.indexOf("got") != -1) {
      resSelect.removeChild(option);
    }
  }
  resSelect.appendChild(new Option("got "+newRes,"got "+newRes));
  resSelect.selectedIndex = resSelect.length - 1;
}

async function updateCameraSelect(){
  let cameraSelect = document.getElementById("cameraSelect");
  let selectedCamera = (await CameraPreview.getSelectedCamera()).selectedCamera;
  for (let i = 0; i < cameraSelect.options.length; i++) {
    if (cameraSelect.options[i].label === selectedCamera) {
      cameraSelect.selectedIndex = i;
      return;
    }
  }
}

async function toggleTorch(){
  try {
    let desiredStatus = !torchStatus;
    await CameraPreview.toggleTorch({on:desiredStatus});
    torchStatus = desiredStatus;   
  } catch (error) {
    alert(error);
  }
}

function startScanning(){
  photoTaken = null;
  scanning = false;
  interval = setInterval(captureAndDetect,100);
  //setInterval(captureAndDetect,100);
}

function stopScanning(){
  clearInterval(interval);
  scanning = false;
}

async function captureAndDetect(){
  if (scanning === true) {
    return;
  }
  if (photoTaken) {
    return;
  }
  let results = [];
  let frame;
  //let base64;
  scanning = true;
  try {
    //if (Capacitor.isNativePlatform()) {
    //  let result = await CameraPreview.takeSnapshot({quality:85});
    //  base64 = result.base64;
    //  results = await DocumentNormalizer.detect({source:base64});
    //} else {
      let result = await CameraPreview.takeSnapshot2();
      frame = result.frame;
      results = await DocumentNormalizer.detect({source:frame});
    //}
    drawOverlay(results);
    await checkIfSteady(results);
  } catch (error) {
    console.log(error);
  }
  scanning = false;
  console.log(results);
}

function drawOverlay(results){
  let svg = document.getElementById("overlay");
  svg.innerHTML = "";
  results.forEach(result => {
    let polygon = document.createElementNS("http://www.w3.org/2000/svg","polygon");
    polygon.setAttribute("points",getPointsData(result));
    polygon.setAttribute("stroke","green");
    polygon.setAttribute("stroke-width","1");
    polygon.setAttribute("fill","lime");
    polygon.setAttribute("opacity","0.3");
    svg.appendChild(polygon);
  });
}

function getPointsData(result){
  let location = result.location;
  let pointsData = location.points[0].x + "," + location.points[0].y + " ";
  pointsData = pointsData + location.points[1].x + "," + location.points[1].y +" ";
  pointsData = pointsData + location.points[2].x + "," + location.points[2].y +" ";
  pointsData = pointsData + location.points[3].x + "," + location.points[3].y;
  return pointsData;
}

async function checkIfSteady(results) {
  if (results.length>0) {
    let result = results[0];
    if (previousResults.length >= 3) {
      if (steady() == true) {
        console.log("steady");
        stopScanning();
        await takePhoto();
        dispalyPhotoAndShowConfirmation();
      }else{
        console.log("shift and add result");
        previousResults.shift();
        previousResults.push(result);
      }
    }else{
      console.log("add result");
      previousResults.push(result);
    }
  }

  async function takePhoto() {
    photoTaken = (await CameraPreview.takePhoto()).base64;
    console.log(photoTaken);
  }

  function dispalyPhotoAndShowConfirmation(){
    let img = new Image();
    img.onload = function(){
      let svgElement = document.getElementById("overlay");
      let svgImage = document.createElementNS("http://www.w3.org/2000/svg", "image");
      svgImage.setAttribute("href",img.src);
      let polygons = svgElement.getElementsByTagName("polygon");
      if (polygons.length>0) {
        svgElement.insertBefore(svgImage,polygons[0]);
      }else{
        svgElement.appendChild(svgImage);
      }
    };
    img.src = photoTaken;
  }

  function steady(){
    if (previousResults[0] && previousResults[1] && previousResults[2]) {
      let iou1 = intersectionOverUnion(previousResults[0].location.points,previousResults[1].location.points);
      let iou2 = intersectionOverUnion(previousResults[1].location.points,previousResults[2].location.points);
      let iou3 = intersectionOverUnion(previousResults[2].location.points,previousResults[1].location.points);
      console.log(iou1);
      console.log(iou2);
      console.log(iou3);
      if (iou1>0.9 && iou2>0.9 && iou3>0.9) {
        return true;
      }else{
        return false;
      }
    }
    return false;
  }
}

