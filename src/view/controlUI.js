var force = require("../core/init.js").force_layout;

if(localStorage.getItem("directed") == 1) {
  document.querySelector("#directed").checked = true;
  document.querySelector("#undirected").checked = false;
} 
else {
  document.querySelector("#directed").checked = false;
  document.querySelector("#undirected").checked = true;
}

directed.onclick = function() {
  localStorage.setItem("directed", Number(1));
  window.location.reload();
};

undirected.onclick = function() {
  localStorage.setItem("directed", Number(0));
  window.location.reload();
};

function setDirectionUnchecked() {
  document.querySelector("#directed").checked = false;
  document.querySelector("#undirected").checked = false;
}

function startStopForce() {
  //start force directed layout
  if(!document.querySelector("#myonoffswitch").checked) {
    document.querySelector("#updateAllNodesButton").style.visibility="hidden";
    document.querySelector("#chosenHideNodeButton").style.visibility="hidden";
    document.querySelector("#chosenUpdateNodeButton").style.visibility="hidden";
    force.fdLoop();
  }
  //stop force directed layout
  else {
    document.querySelector("#updateAllNodesButton").style.visibility="visible";
    document.querySelector("#chosenHideNodeButton").style.visibility="visible";
    document.querySelector("#chosenUpdateNodeButton").style.visibility="visible";
    force.fdStop();
  }
}

module.exports = {
  startStopForce: startStopForce,
  setDirectionUnchecked: setDirectionUnchecked
};
