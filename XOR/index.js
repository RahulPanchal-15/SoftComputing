
let NN = {};

function init(){
  getValues();
}

function getValues(){

  NN = {};

  const layers = document.getElementsByClassName("layerflex");
  const x1 = document.getElementById("x1").value;
  const x2 = document.getElementById("x2").value;
  
  NN[0] = [x1,x2];
  
  for(i=1; i< layers.length-1; i++){
    let nuerons = layers[i].getElementsByClassName("nueron"); 
    // console.log(nuerons);
    let NUERONS = [];
    for(j=0; j < nuerons.length; j++){
      let w1 = nuerons[j].querySelector(`#l${i}n${j}w${"0"}`).value;
      let w2 = nuerons[j].querySelector(`#l${i}n${j}w${"1"}`).value;
      let b = nuerons[j].querySelector(`#l${i}n${j}b`).value;
      let t = nuerons[j].querySelector(`#l${i}n${j}t`).value;
      // console.log(w1,w2,b,t)
      NUERONS[j] = [w1,w2,b,t];
    }
    NN[i] = NUERONS;
  }
  
  console.log("Network : ",NN);
  
  document.getElementById('outputText').value = calculateOutput(NN);  
  
  getFinalGate(NN);
}

function getPositions(id){
  let indexOfL = id.indexOf('l');
  let indexOfN = id.indexOf('n');
  let indexOfW = id.indexOf('w');
  let isThreshold = false;
  let isBias = false;
  let weight = 0;
  let layer = Number(id.substring(indexOfL+1,indexOfN));
  let nueron = Number(id.substring(indexOfN+1,indexOfW));
  if(indexOfW!=-1){
    weight = Number(id.substring(indexOfW+1));
    if(id.indexOf('b')!=-1){
      isBias = true;
    } else if(id.indexOf('t')!=-1){
      isThreshold = true;
    }
  }
  return [layer,nueron,weight,isBias,isThreshold];
}



function calculateOutput(NN){
  
  const layers = Object.keys(NN);
  const outputs = {};
  outputs[0] = NN[0];

  //Traverse all layers
  for(i = 1; i < layers.length; i++){
    let layer = NN[i];
    // console.log(`layer${i}: `,layer);
    let nuerons = Object.keys(layer);
    let output = [];


    //Traverse all nuerons
    for(j=0; j < nuerons.length; j++){
      // console.log(`nueron${j} : `,layer[j]);
      // console.log(`inputs : `,outputs[i-1]);
      var w1 = layer[j][0];
      var w2 = layer[j][1];
      var bias = layer[j][2];
      var threshold = layer[j][3];
      var result = compute(w1,w2,threshold,outputs[i-1][0],outputs[i-1][1],bias);
      // console.log("result: ",result);
      var gate = getBasicGate(w1,w2,threshold,bias);
      document.getElementById(`gl${i}n${j}`).value= gate;
      if(i==layers.length-1){
        outputGate = gate;
      }
      output.push(result);
    }
    outputs[i] = output;
  }
  return outputs[layers.length-1][0]
}

function compute(w1,w2,threshold,x1,x2,bias){
  const net = (Number(w1)*Number(x1))+(Number(w2)*Number(x2))+Number(bias);
  const result = net<=Number(threshold)?0:1;
  return result;
}

function getBasicGate(w1,w2,threshold,bias){    
  var v1 = compute(w1,w2,threshold,0,0,bias);
  var v2 = compute(w1,w2,threshold,0,1,bias);
  var v3 = compute(w1,w2,threshold,1,0,bias);
  var v4 = compute(w1,w2,threshold,1,1,bias);
  
  
  if(v1===0 && v2===0 && v3==0 && v4===1) return "AND"; // 0.24 , 0.18 , 0.36
  else if(v1===0 && v2===1 && v3===1 && v4===1) return "OR";
  else if(v1===0 && v2===1 && v3===1 && v4===0) return "XOR";
  else if(v1===1 && v2===1 && v3===1 && v4===0) return "NAND";
  else if(v1===1 && v2===0 && v3===0 && v4===0) return "NOR";
  else return "---";
}

function getFinalGate(NN){
  // console.log("\t\t0,0");
  let n1 = Object.assign({},NN)
  n1[0] = [0,0];
  var v1 = calculateOutput(n1);
  // console.log("\t\t0,1");
  n1[0] = [0,1];
  var v2 = calculateOutput(n1);
  // console.log("\t\t1,0");
  n1[0] = [1,0];
  var v3 = calculateOutput(n1);
  // console.log("\t\t1,1");
  n1[0] = [1,1];
  var v4 = calculateOutput(n1);
  
  document.getElementById("v1").innerText = v1;
  document.getElementById("v2").innerText = v2;
  document.getElementById("v3").innerText = v3;
  document.getElementById("v4").innerText = v4;
  
  var gate="";

  if(v1===0 && v2===0 && v3==0 && v4===1) gate="AND"; // 0.24 , 0.18 , 0.36
  else if(v1===0 && v2===1 && v3===1 && v4===1) gate="OR";
  else if(v1===0 && v2===1 && v3===1 && v4===0) gate="XOR";
  else if(v1===1 && v2===1 && v3===1 && v4===0) gate="NAND";
  else if(v1===1 && v2===0 && v3===0 && v4===0) gate="NOR"; 
  else gate = "---";

  // console.log("gate: ",gate)
  document.getElementById('outputGate').value = gate;
  
}


window.onload = init();