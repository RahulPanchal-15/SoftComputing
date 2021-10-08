window.onload = calculateOutput();

function listenToSlider(event, sliderId){
  var slider = document.getElementById(sliderId);
  var slideValue = event.value;
  slider.value = slideValue*100;
}

var w1 = document.getElementById("w1");
w1.addEventListener('input', function () {
  var e = document.getElementById("w1Text");
  e.value = w1.value*0.01;
  calculateOutput();
}, false);

var w2 = document.getElementById("w2");
w2.addEventListener('input', function () {
  var e = document.getElementById("w2Text");
  e.value = w2.value*0.01;
  calculateOutput();
}, false);

var thr = document.getElementById("threshold");
thr.addEventListener('input', function () {
  var e = document.getElementById("thresholdText");
  e.value = thr.value*0.01;
  calculateOutput();
}, false);

var bs = document.getElementById("bias");
bs.addEventListener('input', function () {
  var e = document.getElementById("biasText");
  e.value = bs.value*0.01;
  calculateOutput();
}, false);

var x1 = document.getElementById("x1");
x1.addEventListener('input', function () {
  var e = document.getElementById("x1Text");
  e.value = x1.value*0.01;
  calculateOutput();
}, false);

var x2 = document.getElementById("x2");
x2.addEventListener('input', function () {
  var e = document.getElementById("x2Text");
  e.value = x2.value*0.01;
  calculateOutput();
}, false);

function calculateOutput(){
  const w1 = parseFloat(document.getElementById("w1Text").value);
  const w2 = parseFloat(document.getElementById("w2Text").value);
  const threshold = parseFloat(document.getElementById("thresholdText").value);
  const bias = parseFloat(document.getElementById("biasText").value);
  const x1 = parseFloat(document.getElementById("x1Text").value)<0.5?0:1;
  const x2 = parseFloat(document.getElementById("x2Text").value)<0.5?0:1;
  
  const result = compute(w1,w2,threshold,x1,x2,bias);

  document.getElementById("outputText").value = result;
  document.getElementById("gate").value = whichGate(w1,w2,threshold,bias);
}

function compute(w1,w2,threshold,x1,x2,bias){
  const net = (w1*x1)+(w2*x2)+bias;
  const result = net<threshold?0:1;
  return result;
}


function whichGate(w1,w2,threshold,bias){

  var v1 = compute(w1,w2,threshold,0,0,bias);
  document.getElementById("v1").innerText = v1;
  var v2 = compute(w1,w2,threshold,0,1,bias);
  document.getElementById("v2").innerText = v2;
  var v3 = compute(w1,w2,threshold,1,0,bias);
  document.getElementById("v3").innerText = v3;
  var v4 = compute(w1,w2,threshold,1,1,bias);
  document.getElementById("v4").innerText = v4;

  if(v1===0 && v2===0 && v3==0 && v4===1) return "AND"; // 0.24 , 0.18 , 0.36
  else if(v1===0 && v2===1 && v3===1 && v4===1) return "OR";
  else if(v1===0 && v2===1 && v3===1 && v4===0) return "XOR";
  else if(v1===1 && v2===1 && v3===1 && v4===0) return "NAND";
  else if(v1===1 && v2===0 && v3===0 && v4===0) return "NOR";
  else return "---";
  
}