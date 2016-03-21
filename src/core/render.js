var container = require("./init.js").container;
var defaults = require("./init.js").defaults;
var mouse = require("./init.js").globals.mouse;
var dims = require("./init.js").globals.graph_dims;

//basics
var network = new THREE.Group(),
    camera = new THREE.PerspectiveCamera(
      70,
      container.WIDTH / container.HEIGHT,
      0.1, 1000),
    scene = new THREE.Scene(),
    renderer = new THREE.WebGLRenderer({antialias: false}),
    //tmp object to find indices
    nodes_obj_idx = {},
    edges_obj_idx = {};

function renderGraph(graph) {
  console.log("render graph");

  var graph = graph || window.graph;
  if (!graph) {
    throw new Error("No graph object present, unable to render anything.");
  }

  if ( !window.nodes_obj || !window.node_keys ) {
    window.nodes_obj = window.graph.getNodes();
    window.node_keys = Object.keys(window.nodes_obj);
    window.und_edges = window.graph.getUndEdges();
    window.und_edges_keys = Object.keys(window.und_edges);
    window.dir_edges = window.graph.getDirEdges();
    window.dir_edges_keys = Object.keys(window.dir_edges);
  }

  dims.MIN_X = dims.MAX_X = nodes_obj[0].getFeature('coords').x;
  dims.MIN_Y = dims.MAX_Y = nodes_obj[0].getFeature('coords').y;
  dims.MIN_Z = dims.MAX_Z = nodes_obj[0].getFeature('coords').z;

  for(node in nodes_obj) {
    var x = nodes_obj[node].getFeature('coords').x;
    var y = nodes_obj[node].getFeature('coords').y;
    var z = nodes_obj[node].getFeature('coords').z;

    dims.MIN_X = Math.min(dims.MIN_X, x);
    dims.MIN_Y = Math.min(dims.MIN_Y, y);
    dims.MIN_Z = Math.min(dims.MIN_Z, z);

    dims.MAX_X = Math.max(dims.MAX_X, x);
    dims.MAX_Y = Math.max(dims.MAX_Y, y);
    dims.MAX_Z = Math.max(dims.MAX_Z, z);
  }
  dims.AVG_X = (dims.MAX_X - dims.MIN_X) / 2;
  dims.AVG_Y = (dims.MAX_Y - dims.MIN_Y) / 2;
  dims.AVG_Z = (dims.MAX_Z - dims.MIN_Z) / 2;

  renderer.setSize(container.WIDTH, container.HEIGHT);
  renderer.setClearColor(defaults.background_color, 1);

  var element = document.getElementById("containerGraph");
  element.appendChild(renderer.domElement);

  var i = 0;
  var vertices = new Float32Array(graph.nrNodes() * 3);
  var nodeColors = new Float32Array(graph.nrNodes() * 3);
  var nodeSizes = new Float32Array(graph.nrNodes());
  for(node in nodes_obj) {
    var x = nodes_obj[node].getFeature('coords').x;
    var y = nodes_obj[node].getFeature('coords').y;
    var z = nodes_obj[node].getFeature('coords').z;

    vertices[i*3] = x - dims.AVG_X;
    vertices[i*3 + 1] = y - dims.AVG_Y;
    vertices[i*3 + 2] = z - dims.AVG_Z;

    // Trying to set original color
    nodeColors[i*3] = nodes_obj[node].getFeature('color').r/256.0;
    nodeColors[i*3 + 1] = nodes_obj[node].getFeature('color').g/256.0;
    nodeColors[i*3 + 2] = nodes_obj[node].getFeature('color').b/256.0;

    nodeSizes[i] = 6;
    nodes_obj_idx[node]= i*3;
    i++;
  }

  var geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.addAttribute('color', new THREE.BufferAttribute(nodeColors, 3));
  geometry.addAttribute('size', new THREE.BufferAttribute(nodeSizes, 1));

  var material = new THREE.PointsMaterial({
    vertexColors: THREE.VertexColors,
    size: defaults.node_size
  });

  var particles = new THREE.Points(geometry, material);
  network.add(particles);

  //EDGE
  var materialLine = new THREE.LineBasicMaterial({
    transparent : defaults.tranparent,
    opacity: defaults.opacity,
    vertexColors: THREE.VertexColors,
    linewidth: defaults.linewidth
  });

  [und_edges, dir_edges].forEach(function(edges) {
    var i = 0;
    var positionLine = new Float32Array(Object.keys(edges).length * 6); //2 vertices * 3 xyz
    var lineColors = new Float32Array(positionLine.length);
    for (var edge_index in edges) {
      var edge = edges[edge_index];
      var node_a_id = edge._node_a.getID();
      var node_b_id = edge._node_b.getID();

      positionLine[i * 6] = nodes_obj[node_a_id].getFeature('coords').x - dims.AVG_X;
      positionLine[i * 6 + 1] = nodes_obj[node_a_id].getFeature('coords').y - dims.AVG_Y;
      positionLine[i * 6 + 2] = nodes_obj[node_a_id].getFeature('coords').z - dims.AVG_Z;
      positionLine[i * 6 + 3] = nodes_obj[node_b_id].getFeature('coords').x - dims.AVG_X;
      positionLine[i * 6 + 4] = nodes_obj[node_b_id].getFeature('coords').y - dims.AVG_Y;
      positionLine[i * 6 + 5] = nodes_obj[node_b_id].getFeature('coords').z - dims.AVG_Z;

      lineColors[i * 6] = nodes_obj[node_a_id].getFeature('color').r/256.0;
      lineColors[i * 6 + 1] = nodes_obj[node_a_id].getFeature('color').g/256.0;
      lineColors[i * 6 + 2] = nodes_obj[node_a_id].getFeature('color').b/256.0;
      lineColors[i * 6 + 3] = nodes_obj[node_b_id].getFeature('color').r/256.0;
      lineColors[i * 6 + 4] = nodes_obj[node_b_id].getFeature('color').g/256.0;
      lineColors[i * 6 + 5] = nodes_obj[node_b_id].getFeature('color').b/256.0;

      edges_obj_idx[edge_index] = i*6;
      i++;
    }

    var geometryLine = new THREE.BufferGeometry();
    geometryLine.addAttribute('position', new THREE.BufferAttribute(positionLine, 3));
    geometryLine.addAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    var line = new THREE.LineSegments(geometryLine, materialLine);
    network.add(line);
  });

  scene.add(network);
  camera.position.z = Math.max(dims.MAX_X, dims.MAX_Y);
  window.requestAnimationFrame(updateGraph);
};


function updateGraph () {
  renderer.render(scene, camera);
};

module.exports = {
    network: network,
    camera: camera,
    nodes_obj_idx: nodes_obj_idx,
    edges_obj_idx: edges_obj_idx,
    renderGraph: renderGraph,
    update: updateGraph
};
