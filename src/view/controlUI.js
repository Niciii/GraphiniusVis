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
    force.fdLoop();
  }
  //stop force directed layout
  else {
    force.fdStop();
  }
}

module.exports = {
  startStopForce: startStopForce,
  setDirectionUnchecked: setDirectionUnchecked
};
