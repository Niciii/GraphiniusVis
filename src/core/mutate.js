var network = require("./init.js").globals.network;
var update = require("./render.js").update;
var nodes_obj_idx = require("../layout/constant_layout.js").nodes_obj_idx;
var edges_obj_idx = require("../layout/constant_layout.js").edges_obj_idx;
var globals = require("./init.js").globals;
var dims = require("./init.js").globals.graph_dims;
var defaults = require("./init.js").defaults;

var segment_color_obj = {};

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

  if(globals.TWO_D_MODE) {
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

  if(globals.TWO_D_MODE) {
    z_ = 0;
  }

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

  //remove edge - directed
  var undEdges = [ network.children[1].geometry.getAttribute('position').array,
                    hide_node.undEdges()];
  //TODO - directed
  var in_out_edges = {};
  for (var e in hide_node.inEdges()) { in_out_edges[e] = hide_node.inEdges()[e]; }
  for (var e in hide_node.outEdges()) { in_out_edges[e] = hide_node.outEdges()[e]; }
  //----
  var dirEdges = [ network.children[2].geometry.getAttribute('position').array,
                    in_out_edges];

  [undEdges, dirEdges].forEach(function(all_edges_of_a_node) {
    var old_edges = all_edges_of_a_node[0];
    var edges = all_edges_of_a_node[1];
    for(var i = 0; i < Object.keys(edges).length; i++) {
      var edge = edges[Object.keys(edges)[i]];

      //update from-node
      var edge_index = edges_obj_idx[edge.getID()];
      old_edges[edge_index] = NaN;
      old_edges[edge_index + 1] = NaN;
      old_edges[edge_index + 2] = NaN;
      old_edges[edge_index + 3] = NaN;
      old_edges[edge_index + 4] = NaN;
      old_edges[edge_index + 5] = NaN;
    }
  });

  network.children[0].geometry.attributes.position.needsUpdate = true;
  network.children[1].geometry.attributes.position.needsUpdate = true;
  network.children[2].geometry.attributes.position.needsUpdate = true;
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
  var new_color = new THREE.Color(defaults.edge_color);
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
  var newColor = new THREE.Color(hexColor || defaults.node_color);
  var nodeColors = network.children[0].geometry.getAttribute('color').array;

  var node_id = node.getID();
  var index = nodes_obj_idx[node_id];
  nodeColors[index] = newColor.r;
  nodeColors[index + 1] = newColor.g;
  nodeColors[index + 2] = newColor.b;

  network.children[0].geometry.attributes.color.needsUpdate = true;
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

function colorSingleEdge(edge, hex_color_node_a, hex_color_node_b) {
  var new_color_a = new THREE.Color(hex_color_node_a || defaults.edge_color);
  var new_color_b = new THREE.Color(hex_color_node_b || defaults.edge_color);

  var index = 1;
  if(edge._directed) {
    index = 2;
  }
  var edge_colors = network.children[index].geometry.getAttribute('color').array;
  var edge_id = edge.getID();
  var idx = edges_obj_idx[edge_id];

  edge_colors[idx] = new_color_a.r;
  edge_colors[idx + 1] = new_color_a.g;
  edge_colors[idx + 2] = new_color_a.b;
  edge_colors[idx + 3] = new_color_b.r;
  edge_colors[idx + 4] = new_color_b.g;
  edge_colors[idx + 5] = new_color_b.b;

  network.children[index].geometry.attributes.color.needsUpdate = true;
}

function colorAllEdges(hexColor) {
  if(hexColor == 0) {
    var randomIndex = Math.floor((Math.random() * defaults.randomColors.length));
    hexColor = defaults.randomColors[randomIndex];
  }

  var newColor = new THREE.Color(hexColor);
  var edgeColors1 = network.children[1].geometry.getAttribute('color').array;
  var edgeColors2 = network.children[2].geometry.getAttribute('color').array;

  [edgeColors1, edgeColors2].forEach(function(edgesColor) {
    for(var i = 0; i < edgesColor.length;) {
      edgesColor[i] = newColor.r;
      edgesColor[i + 1] = newColor.g;
      edgesColor[i + 2] = newColor.b;
      i += 3;
    }
  });

  network.children[1].geometry.attributes.color.needsUpdate = true;
  network.children[2].geometry.attributes.color.needsUpdate = true;
  window.requestAnimationFrame(update);
}
//Hint: index = node id
function colorBFS(node) {
  segment_color_obj = {};
  var max_distance = 0,
      additional_node = false,
      infinity_node = false,
      start_node = graph.getRandomNode();
  if(node != null) {
    start_node = node;
  }
  var bfs = $G.search.BFS(graph, start_node);
  for(index in bfs) {
    if(bfs[index].distance !== Number.POSITIVE_INFINITY) {
      max_distance = Math.max(max_distance, bfs[index].distance);
    }
  }

  var start_color = new THREE.Color(defaults.bfs_gradient_start_color),
      middle_color = new THREE.Color(defaults.bfs_gradient_middle_color),
      end_color = new THREE.Color(defaults.bfs_gradient_end_color),
      gradient = [],
      firstColor = start_color,
      secondColor = middle_color,
      half = max_distance / 2;

  for(var i = 0; i <= max_distance; i++) {
    if(i > half) {
      firstColor = middle_color;
      secondColor = end_color;
    }

    var i_mod_half = (i % half) ? (i % half) : ((i-1) % half);
    var newColor = new THREE.Color();
    newColor.r = firstColor.r + (secondColor.r - firstColor.r) / half * i_mod_half;
    newColor.g = firstColor.g + (secondColor.g - firstColor.g) / half * i_mod_half;
    newColor.b = firstColor.b + (secondColor.b - firstColor.b) / half * i_mod_half;
    gradient.push(newColor);
  }

  for(index in bfs) {
    var hex_color = '#ffffff';
    if(bfs[index].distance !== Number.POSITIVE_INFINITY) {
      hex_color = gradient[bfs[index].distance].getHex();
    }

    colorSingleNode(graph.getNodeById(index), hex_color);
    segment_color_obj[index] = hex_color;
  }

  [und_edges, dir_edges].forEach(function(edges) {
    for(edge_index in edges) {
      var edge = edges[edge_index];
      var node_a_id = edge._node_a.getID();
      var node_b_id = edge._node_b.getID();

      if(segment_color_obj[node_a_id] !== 'undefined' &&
         segment_color_obj[node_b_id] !== 'undefined') {
        colorSingleEdge(edge, segment_color_obj[node_a_id], segment_color_obj[node_b_id]);
      }
    }
  });
  window.requestAnimationFrame(update);
}

//Hint: index = node id
function colorDFS(node) {
  segment_color_obj = {};
  var start_node = graph.getRandomNode(),
      colors = [];
  if(node != null) {
    start_node = node;
  }
  var dfs = $G.search.DFS(graph, start_node);
  //console.log(dfs);

  for (var i = 0; i < dfs.length; i++) {
    var new_color = new THREE.Color();
    new_color.r = Math.floor(Math.random() * 256) / 256.0;
    new_color.g = Math.floor(Math.random() * 256) / 256.0;
    new_color.b = Math.floor(Math.random() * 256) / 256.0;
    colors.push(new_color.getHex());
  }

  //for constant layout
  for(var i = 0; i < dfs.length; i++) {
    for(index in dfs[i]) {
      colorSingleNode(graph.getNodeById(index), colors[i]);
      segment_color_obj[index] = colors[i];
    }
  }

  [und_edges, dir_edges].forEach(function(edges) {
    for(edge_index in edges) {
    var edge = edges[edge_index];
    var node_a_id = edge._node_a.getID();
    var node_b_id = edge._node_b.getID();

      if(segment_color_obj[node_a_id] !== 'undefined' &&
         segment_color_obj[node_b_id] !== 'undefined') {
        colorSingleEdge(edge, segment_color_obj[node_a_id], segment_color_obj[node_b_id]);
      }
    }
  });
  window.requestAnimationFrame(update);
}

function hideNodeClick() {
  hideNode(globals.selected_node);
}

function colorSingleNodeClick() {
  var randomIndex = Math.floor((Math.random() * defaults.randomColors.length)),
      hexColor = defaults.randomColors[randomIndex];
  colorSingleNode(globals.selected_node, hexColor);
  window.requestAnimationFrame(update);
}

function colorBFSclick() {
  colorBFS(globals.selected_node);
}

function colorDFSclick() {
  colorDFS(globals.selected_node);
}

module.exports = {
  addNode: addNode,
  addRandomNodes: addRandomNodes,
  hideNode: hideNode,
  hideNodeClick: hideNodeClick,
  addEdge: addEdge,
  colorSingleNode: colorSingleNode,
  colorSingleNodeClick: colorSingleNodeClick,
  colorAllNodes: colorAllNodes,
  colorSingleEdge: colorSingleEdge,
  colorAllEdges: colorAllEdges,
  colorBFS: colorBFS,
  colorDFS: colorDFS,
  colorBFSclick: colorBFSclick,
  colorDFSclick: colorDFSclick
};
