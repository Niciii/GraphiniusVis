var network = require("../core/render.js").network;
var camera = require("../core/render.js").camera;
var update = require("../core/render.js").update;
var nodes_obj_idx = require("../core/render.js").nodes_obj_idx;
var edges_obj_idx = require("../core/render.js").edges_obj_idx;
var dims = require("../core/init.js").globals.graph_dims;
var mouse = require("../core/init.js").globals.mouse;
var defaults = require("../core/init.js").defaults;

var TWO_D_MODE = 0,
    INTERSECTED = {
      index: 0, color: new THREE.Color()
    },
    raycaster = new THREE.Raycaster();

//update node and edge position
function updateNodePosition(update_node) {

  var node_id = update_node.getID();
  var index = nodes_obj_idx[node_id];

  //update nodes
  var old_nodes = network.children[0].geometry.getAttribute('position').array;
  old_nodes[index] = update_node.getFeature('coords').x;
  old_nodes[index + 1] = update_node.getFeature('coords').y;
  old_nodes[index + 2] = update_node.getFeature('coords').z;

  if(TWO_D_MODE) {
    old_nodes[index + 2] = 0;
  }
  network.children[0].geometry.attributes.position.needsUpdate = true;

  //update edges
  var old_edges = network.children[1].geometry.getAttribute('position').array;
  var und_edges = update_node.undEdges();
  for(var i = 0; i < Object.keys(und_edges).length; i++) {
    var edge = und_edges[Object.keys(update_node.undEdges())[i]];

    //update from-node
    var edge_index = edges_obj_idx[edge.getID()];
    if(edge._node_a === update_node) {
      old_edges[edge_index] = update_node.getFeature('coords').x;
      old_edges[edge_index + 1] = update_node.getFeature('coords').y;
      old_edges[edge_index + 2] = update_node.getFeature('coords').z;
    }
    //update to-node
    else if(edge._node_b === update_node) {
      old_edges[edge_index + 3] = update_node.getFeature('coords').x;
      old_edges[edge_index + 4] = update_node.getFeature('coords').y;
      old_edges[edge_index + 5] = update_node.getFeature('coords').z;
    }
  }
  network.children[1].geometry.attributes.position.needsUpdate = true;
  //TODO for directed and undirected edges
  //network.children[2].geometry.attributes.position.needsUpdate = true;
  window.requestAnimationFrame(update);
}

function updateAll() {
  window.old_coordinates = new Float32Array( graph.nrNodes() * 3 );
  var node_obj = graph.getNodes();
  var i = 0;
  for(node in nodes_obj) {
    old_coordinates[i] = node_obj[node].getFeature('coords').x;
    old_coordinates[i + 1] = node_obj[node].getFeature('coords').y;
    old_coordinates[i + 2] = node_obj[node].getFeature('coords').z;
    i += 3;
  }
  window.cnt = 0;
  requestAnimationFrame(updateRandomPostions);
}

function updateRandomPostions() {
  var node_obj = graph.getNodes();
  var old_nodes = network.children[0].geometry.getAttribute('position').array;
  var old_edges = network.children[1].geometry.getAttribute('position').array;
  for(node in node_obj) {
    var index = nodes_obj_idx[node];
    node_obj[node].getFeature('coords').x = old_coordinates[index] + Math.random() * 20 - 10 - dims.AVG_X;
    node_obj[node].getFeature('coords').y = old_coordinates[index + 1] + Math.random() * 20 - 10 - dims.AVG_Y;
    node_obj[node].getFeature('coords').z = old_coordinates[index + 2] + Math.random() * 20 - 10 - dims.AVG_Z;

    old_nodes[index] = node_obj[node].getFeature('coords').x;
    old_nodes[index + 1] = node_obj[node].getFeature('coords').y;
    old_nodes[index + 2] = node_obj[node].getFeature('coords').z;
  }

  var und_edges = graph.getUndEdges();
  var dir_edges = graph.getDirEdges();
  [und_edges, dir_edges].forEach(function(edges) {
    var i = 0;
    for (var edge_index in edges) {
      var edge = edges[edge_index];
      var node_a_id = edge._node_a.getID();
      var node_b_id = edge._node_b.getID();

      old_edges[i] = node_obj[node_a_id].getFeature('coords').x;
      old_edges[i + 1] = node_obj[node_a_id].getFeature('coords').y;
      old_edges[i + 2] = node_obj[node_a_id].getFeature('coords').z;
      old_edges[i + 3] = node_obj[node_b_id].getFeature('coords').x;
      old_edges[i + 4] = node_obj[node_b_id].getFeature('coords').y;
      old_edges[i + 5] = node_obj[node_b_id].getFeature('coords').z;
      i += 6;
    }
  });

  network.children[0].geometry.attributes.position.needsUpdate = true;
  network.children[1].geometry.attributes.position.needsUpdate = true;
  network.children[2].geometry.attributes.position.needsUpdate = true;
  window.requestAnimationFrame(update);

  if(window.cnt++ < 100) {
    requestAnimationFrame(updateRandomPostions);
  }
  else {
    var i = 0;
    for(node in node_obj) {
      var index = nodes_obj_idx[node];
      node_obj[node].getFeature('coords').x = window.old_coordinates[i];
      node_obj[node].getFeature('coords').y = window.old_coordinates[i + 1];
      node_obj[node].getFeature('coords').z = window.old_coordinates[i + 2];
      i += 3;

      old_nodes[index] = node_obj[node].getFeature('coords').x - dims.AVG_X;
      old_nodes[index + 1] = node_obj[node].getFeature('coords').y - dims.AVG_Y;
      old_nodes[index + 2] = node_obj[node].getFeature('coords').z - dims.AVG_Z;
    }
    [und_edges, dir_edges].forEach(function(edges) {
      var i = 0;
      for (var edge_index in edges) {
        var edge = edges[edge_index];
        var node_a_id = edge._node_a.getID();
        var node_b_id = edge._node_b.getID();

        old_edges[i] = node_obj[node_a_id].getFeature('coords').x - dims.AVG_X;
        old_edges[i + 1] = node_obj[node_a_id].getFeature('coords').y - dims.AVG_Y;
        old_edges[i + 2] = node_obj[node_a_id].getFeature('coords').z - dims.AVG_Z;
        old_edges[i + 3] = node_obj[node_b_id].getFeature('coords').x - dims.AVG_X;
        old_edges[i + 4] = node_obj[node_b_id].getFeature('coords').y - dims.AVG_Y;
        old_edges[i + 5] = node_obj[node_b_id].getFeature('coords').z - dims.AVG_Z;
        i += 6;
      }
    });
    network.children[0].geometry.attributes.position.needsUpdate = true;
    network.children[1].geometry.attributes.position.needsUpdate = true;
    network.children[2].geometry.attributes.position.needsUpdate = true;
    window.requestAnimationFrame(update);
  }
}

function switchTo2D() {
  TWO_D_MODE = true;
  var array = network.children[0].geometry.attributes.position.array;
  for(var i = 0; i < array.length;) {
    array[i + 2] = 0;
    i+=3;
  }
  network.children[0].geometry.attributes.position.needsUpdate = true;

  array = network.children[1].geometry.attributes.position.array;
  for(var i = 0; i < array.length;) {
    array[i + 2] = 0;
    i+=3;
  }
  network.children[1].geometry.attributes.position.needsUpdate = true;

  array = network.children[2].geometry.attributes.position.array;
  for(var i = 0; i < array.length;) {
    array[i + 2] = 0;
    i+=3;
  }
  network.children[2].geometry.attributes.position.needsUpdate = true;

  window.requestAnimationFrame(update);
}

function switchTo3D() {
  TWO_D_MODE = false;
  var array = network.children[0].geometry.attributes.position.array;
  var i = 0;
  for(node in nodes_obj) {
    var z = nodes_obj[node].getFeature('coords').z;
    array[i + 2] = z;
    i+=3;
  }
  network.children[0].geometry.attributes.position.needsUpdate = true;

  array = network.children[1].geometry.attributes.position.array;
  var i = 0;
  for (var edge_index in und_edges) {
    var edge = und_edges[edge_index];
    var node_a_id = edge._node_a.getID();
    var node_b_id = edge._node_b.getID();

    array[i + 2] = nodes_obj[node_a_id].getFeature('coords').z;
    array[i + 5] = nodes_obj[node_b_id].getFeature('coords').z;
    i += 6;
  }
  network.children[1].geometry.attributes.position.needsUpdate = true;

  i = 0;
  array = network.children[2].geometry.attributes.position.array;
  for (var edge_index in dir_edges) {
    var edge = dir_edges[edge_index];
    var node_a_id = edge._node_a.getID();
    var node_b_id = edge._node_b.getID();

    array[i + 2] = nodes_obj[node_a_id].getFeature('coords').z;
    array[i + 5] = nodes_obj[node_b_id].getFeature('coords').z;
    i += 6;
  }
  network.children[2].geometry.attributes.position.needsUpdate = true;
  window.requestAnimationFrame(update);
}

function nodeIntersection() {
  var attributes = network.children[0].geometry.attributes;
  raycaster.setFromCamera(mouse, camera);
  raycaster.params.Points.threshold = 2;

  var particlesToIntersect = [];
  particlesToIntersect.push(network.children[0]);
  var intersects = raycaster.intersectObjects(particlesToIntersect);

  if(intersects.length > 0 && intersects[0].index != INTERSECTED.index) {    
    //console.log("intersected objects");
    //console.log(intersectsParticles);

    //set previous node
    attributes.color.array[INTERSECTED.index*3] = INTERSECTED.color.r;
    attributes.color.array[INTERSECTED.index*3 + 1] = INTERSECTED.color.g;
    attributes.color.array[INTERSECTED.index*3 + 2] = INTERSECTED.color.b;
    
    INTERSECTED.index = intersects[0].index;
    INTERSECTED.color.setRGB(
      attributes.color.array[intersects[0].index*3], 
      attributes.color.array[intersects[0].index*3 + 1],
      attributes.color.array[intersects[0].index*3 + 2]
    );
    
    //set new node
    attributes.color.array[intersects[0].index*3] = defaults.highlight_node_color.r;
    attributes.color.array[intersects[0].index*3 + 1] = defaults.highlight_node_color.g;
    attributes.color.array[intersects[0].index*3 + 2] = defaults.highlight_node_color.b;
    attributes.color.needsUpdate = true;

    //TODO resize node
    //attributes.size.array[intersects[0].index] = 20;
    //attributes.size.needsUpdate = true;
    
    //get key by index
    var nodeID = Object.keys(nodes_obj_idx)[intersects[0].index];
    console.log(window.graph.getNodeById(nodeID));
    //Hint: update is called in navigation
    //window.requestAnimationFrame(update);
  }
}

module.exports = {
    TWO_D_MODE: TWO_D_MODE,
    updateNodePosition: updateNodePosition,
    updateAll: updateAll,
    updateRandomPostions: updateRandomPostions,
    switchTo2D: switchTo2D,
    switchTo3D: switchTo3D,
    nodeIntersection
};
