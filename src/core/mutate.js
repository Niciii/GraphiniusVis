var network = require("./render.js").network;
var update = require("./render.js").update;
var nodes_obj_idx = require("./render.js").nodes_obj_idx;
var edges_obj_idx = require("./render.js").edges_obj_idx;
var dims = require("./init.js").globals.graph_dims;
var defaults = require("./init.js").defaults;
var TWO_D_MODE = require("../view/interaction.js").TWO_D_MODE;

//add node to graph but without edges
function addNode(new_node) {
  var old_nodes = network.children[0].geometry.getAttribute('position').array;
  var old_colors = network.children[0].geometry.getAttribute('color').array;
  var new_nodes = new Float32Array(old_nodes.length + 3);
  var new_colors = new Float32Array(new_nodes.length);
  var new_color = new THREE.Color(0xff7373);

  for(var i = 0; i < old_nodes.length; i++) {
    new_nodes[i] = old_nodes[i];
    new_colors[i] = old_colors[i];
  }

  new_nodes[new_nodes.length - 3] = new_node.getFeature('coords').x;
  new_nodes[new_nodes.length - 2] = new_node.getFeature('coords').y;
  new_nodes[new_nodes.length - 1] = new_node.getFeature('coords').z;
  new_colors[new_nodes.length - 3] = new_color.r;
  new_colors[new_nodes.length - 2] = new_color.g;
  new_colors[new_nodes.length - 1] = new_color.b;

  if(TWO_D_MODE) {
    new_nodes[new_nodes.length - 1] = 0;
  }

  //index: last element of old_nodes array
  nodes_obj_idx[new_node.getID()] = old_nodes.length;

  network.children[0].geometry.addAttribute('position', new THREE.BufferAttribute(new_nodes, 3));
  network.children[0].geometry.addAttribute('color', new THREE.BufferAttribute(new_colors, 3));
  network.children[0].geometry.attributes.position.needsUpdate = true;
  network.children[0].geometry.attributes.color.needsUpdate = true;
  window.requestAnimationFrame(update);
}

function addRandomNodes() {
  var x_ = Math.floor((Math.random() * dims.MAX_X) - dims.AVG_X),
      y_ = Math.floor((Math.random() * dims.MAX_Y) - dims.AVG_Y),
      z_ = Math.floor((Math.random() * dims.MAX_Z) - dims.AVG_Z),
      idx = Object.keys(nodes_obj_idx).length;
  var new_node = graph.addNode(idx, {coords: {x: x_, y: y_, z:z_}});
  addNode(new_node);
}

//remove node and their edges
function hideNode(hide_node) {
  //remove node
  var node_id = hide_node.getID();
  var index = nodes_obj_idx[node_id];

  var old_nodes = network.children[0].geometry.getAttribute('position').array;
  old_nodes[index] = NaN;
  old_nodes[index + 1] = NaN;
  old_nodes[index + 2] = NaN;

  //remove edge
  var old_edges = network.children[1].geometry.getAttribute('position').array;
  var und_edges = hide_node.undEdges();
  for(var i = 0; i < Object.keys(und_edges).length; i++) {
    var edge = und_edges[Object.keys(hide_node.undEdges())[i]];

    //update from-node
    var edge_index = edges_obj_idx[edge.getID()];
    old_edges[edge_index] = NaN;
    old_edges[edge_index + 1] = NaN;
    old_edges[edge_index + 2] = NaN;
    old_edges[edge_index + 3] = NaN;
    old_edges[edge_index + 4] = NaN;
    old_edges[edge_index + 5] = NaN;
  }
  network.children[0].geometry.attributes.position.needsUpdate = true;
  network.children[1].geometry.attributes.position.needsUpdate = true;
  //TODO for directed and undirected edges
  //network.children[2].geometry.attributes.position.needsUpdate = true;
 window.requestAnimationFrame(update);
}

function addEdge(edge) {
  var index = 1;
  if(edge._directed) {
    index = 2;
  }

  var old_edges = network.children[index].geometry.getAttribute('position').array;
  var old_colors = network.children[index].geometry.getAttribute('color').array;
  var new_edges = new Float32Array(old_edges.length + 6); // 3 xyz-coordinate * 2 nodes
  var new_colors = new Float32Array(old_colors.length + 6);
  var new_color = new THREE.Color(0xff7373);
  for(var i = 0; i < old_edges.length; i++) {
    new_edges[i] = old_edges[i];
    new_colors[i] = old_colors[i];
  }

  new_edges[new_edges.length - 6] = edge._node_a.getFeature('coords').x;
  new_edges[new_edges.length - 5] = edge._node_a.getFeature('coords').y;
  new_edges[new_edges.length - 4] = edge._node_a.getFeature('coords').z;
  new_edges[new_edges.length - 3] = edge._node_b.getFeature('coords').x;
  new_edges[new_edges.length - 2] = edge._node_b.getFeature('coords').y;
  new_edges[new_edges.length - 1] = edge._node_b.getFeature('coords').z;

  new_colors[new_colors.length - 6] = new_color.r;
  new_colors[new_colors.length - 5] = new_color.g;
  new_colors[new_colors.length - 4] = new_color.b;
  new_colors[new_colors.length - 3] = new_color.r;
  new_colors[new_colors.length - 2] = new_color.g;
  new_colors[new_colors.length - 1] = new_color.b;

  //network.children[index].geometry.removeAttribute ('position');
  network.children[index].geometry.addAttribute('position', new THREE.BufferAttribute(new_edges, 3));
  network.children[index].geometry.addAttribute('color', new THREE.BufferAttribute(new_colors, 3));
  network.children[index].geometry.attributes.position.needsUpdate = true;
  network.children[index].geometry.attributes.color.needsUpdate = true;
  window.requestAnimationFrame(update);
}

function colorSingleNode(node, hexColor) {
  var newColor = new THREE.Color(hexColor);
  var nodeColors = network.children[0].geometry.getAttribute('color').array;

  var node_id = node.getID();
  var index = nodes_obj_idx[node_id];
  nodeColors[index] = newColor.r;
  nodeColors[index + 1] = newColor.g;
  nodeColors[index + 2] = newColor.b;
  network.children[0].geometry.attributes.color.needsUpdate = true;

  window.requestAnimationFrame(update);
}

function colorAllNodes(hexColor) {
  if(hexColor == 0) {
    var randomIndex = Math.floor((Math.random() * defaults.randomColors.length));
    hexColor = defaults.randomColors[randomIndex];
  }

  var newColor = new THREE.Color(hexColor);
  var nodeColors = network.children[0].geometry.getAttribute('color').array;

  for(var i = 0; i < nodeColors.length;) {
    nodeColors[i] = newColor.r;
    nodeColors[i + 1] = newColor.g;
    nodeColors[i + 2] = newColor.b;
    i += 3;
  }
  network.children[0].geometry.attributes.color.needsUpdate = true;
  window.requestAnimationFrame(update);
}

function colorSingleEdge(edge, hexColor) {
  var new_color = new THREE.Color(hexColor);
  var index = 1;
  if(edge._directed) {
    index = 2;
  }
  var edge_olors = network.children[index].geometry.getAttribute('color').array;
  var edge_id = edge.getID();
  var idx = edges_obj_idx[edge_id];

  edge_olors[idx] = new_color.r;
  edge_olors[idx + 1] = new_color.g;
  edge_olors[idx + 2] = new_color.b;
  edge_olors[idx + 3] = new_color.r;
  edge_olors[idx + 4] = new_color.g;
  edge_olors[idx + 5] = new_color.b;

  network.children[index].geometry.attributes.color.needsUpdate = true;
  window.requestAnimationFrame(update);
}

function colorAllEdges(hexColor) {
  if(hexColor == 0) {
    var randomIndex = Math.floor((Math.random() * defaults.randomColors.length));
    hexColor = defaults.randomColors[randomIndex];
  }

  var newColor = new THREE.Color(hexColor);
  var edgeColors1 = network.children[1].geometry.getAttribute('color').array;
  var edgeColors2 = network.children[2].geometry.getAttribute('color').array;

  for(var i = 0; i < edgeColors1.length;) {
    edgeColors1[i] = newColor.r;
    edgeColors1[i + 1] = newColor.g;
    edgeColors1[i + 2] = newColor.b;
    i += 3;
  }
  for(var i = 0; i < edgeColors2.length;) {
    edgeColors2[i] = newColor.r;
    edgeColors2[i + 1] = newColor.g;
    edgeColors2[i + 2] = newColor.b;
    i += 3;
  }

  network.children[1].geometry.attributes.color.needsUpdate = true;
  network.children[2].geometry.attributes.color.needsUpdate = true;
  window.requestAnimationFrame(update);
}

module.exports = {
  addNode: addNode,
  addRandomNodes: addRandomNodes,
  hideNode: hideNode,
  addEdge: addEdge,
  colorSingleNode: colorSingleNode,
  colorAllNodes: colorAllNodes,
  colorSingleEdge: colorSingleEdge,
  colorAllEdges: colorAllEdges
}
