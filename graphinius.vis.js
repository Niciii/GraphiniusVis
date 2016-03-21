/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var init			= __webpack_require__(1),
	    render          = __webpack_require__(2),
	    mutate          = __webpack_require__(3),
	    hist_reader     = __webpack_require__(7),
	    main_loop       = __webpack_require__(8),
	    readCSV         = __webpack_require__(9),
	    readJSON        = __webpack_require__(10),
	    const_layout    = __webpack_require__(11),
	    force_layout    = __webpack_require__(12),
	    generic_layout  = __webpack_require__(13),
	    fullscreen      = __webpack_require__(14),
	    interaction     = __webpack_require__(4),
	    navigation      = __webpack_require__(15);


	var out = typeof window !== 'undefined' ? window : global;

	out.$GV = {
	  core: {
	    init: init,
	    render: render,
	    mutate: mutate
	  },
	  history: {
	    reader: hist_reader,
	    loop: main_loop
	  },
	  input: {
	    csv: readCSV,
	    json: readJSON
	  },
	  layout: {
	    const: const_layout,
	    force: force_layout,
	    generic: generic_layout
	  },
	  view: {
	    fullscreen: fullscreen,
	    interaction: interaction,
	    navigation: navigation
	  }
	};

	module.exports = {
	  $GV:	out.$GV
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports) {

	var config = {
	  // keys for handling events
	  keys: {
	    KEY_A: 97,
	    KEY_D: 100,
	    KEY_W: 119,
	    KEY_S: 115,
	    KEY_R: 114,
	    KEY_F: 102,
	    KEY_X: 120,
	    KEY_Y: 121,
	    KEY_C: 99,
	    KEY_SX: 88,
	    KEY_SY: 89,
	    KEY_SC: 67
	  },
	  // default size of canvas/container
	  container: {
	    WIDTH: 1500,
	    HEIGHT: 900
	  },
	  // default render parameters
	  defaults: {
	    node_size: 6,
	    background_color: 0x000000,
	    tranparent: true,
	    opacity: 0.5, //default is 1; range: 0.0 - 1.0
	    linewidth: 1,
	    
	    //raycaster
	    highlight_node_color: new THREE.Color(0xf1ecfb),

	    //zoom
	    ZOOM_FACTOR: 0.05,
	    MAX_FOV: 100, //zoom out
	    MIN_FOV: 20, //zoom in

	    //distance to move
	    delta_distance: 10,
	    //rotation step
	    delta_rotation: 0.05,

	    //for coloring
	    randomColors: [
	      0xc4d0db, 0xf6b68a, 0xffff33, 0x003fff,
	      0xec2337, 0x008744, 0xffa700, 0x1df726,
	      0x8fd621, 0x2d049b, 0x873bd3, 0x85835f
	    ],
	    
	    //for bfs and dfs coloring
	    bfs_gradient_start_color: '#1a3ff6', //blue
	    bfs_gradient_middle_color: '#81cf28', //green
	    bfs_gradient_end_color: '#f61a1a', //red
	    dfs_gradient_start_color: '#ff0000',
	    dfs_gradient_end_color: '#00abff'
	  },
	  globals: {
	    mouse: new THREE.Vector2(),
	    graph_dims: {
	      MIN_X: 0,
	      MAX_X: 0,
	      AVG_X: 0,
	      MIN_Y: 0,
	      MAX_Y: 0,
	      AVG_Y: 0,
	      MIN_Z: 0,
	      MAX_Z: 0,
	      AVG_Z: 0
	    },
	    selected_node: null
	  },
	  callbacks: {
	    node_intersects: []
	  }
	};
	module.exports = config;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var container = __webpack_require__(1).container;
	var defaults = __webpack_require__(1).defaults;
	var mouse = __webpack_require__(1).globals.mouse;
	var dims = __webpack_require__(1).globals.graph_dims;

	    //basics
	var network = new THREE.Group(),
	    camera = new THREE.PerspectiveCamera(
	      70,
	      container.WIDTH / container.HEIGHT,
	      0.1, 1000),
	    scene = new THREE.Scene(),
	    renderer = new THREE.WebGLRenderer({antialias: false}),
	    //raycaster = new THREE.Raycaster(),
	    //tmp object to find indices
	    nodes_obj_idx = {},
	    edges_obj_idx = {};
	    //INTERSECTED = {
	      //index: 0, color: new THREE.Color()
	    //};


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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var network = __webpack_require__(2).network;
	var update = __webpack_require__(2).update;
	var nodes_obj_idx = __webpack_require__(2).nodes_obj_idx;
	var edges_obj_idx = __webpack_require__(2).edges_obj_idx;
	var dims = __webpack_require__(1).globals.graph_dims;
	var selected_node = __webpack_require__(1).globals.selected_node;
	var defaults = __webpack_require__(1).defaults;
	var TWO_D_MODE = __webpack_require__(4).TWO_D_MODE;
	var INTERSECTED = __webpack_require__(4).INTERSECTED;

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

	  //window.requestAnimationFrame(update);
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
	  var new_color_a = new THREE.Color(hex_color_node_a);
	  var new_color_b = new THREE.Color(hex_color_node_b);
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
	  //window.requestAnimationFrame(update);
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

	//Hint: index = node id
	function colorBFS(node) {
	  segment_color_obj = {};
	  var max_distance = 0,
	      additional_node = false,
	      infinity_node = false;
	  var start_node = graph.getRandomNode();;
	  if(node != null) {
	    start_node = node;
	  }
	  var bfs = $G.search.BFS(graph, start_node);  
	  for(index in bfs) {
	    if(bfs[index].distance == 0) {
	      additional_node = true;
	    }
	    else if(bfs[index].distance == Infinity) {
	      infinity_node = true;
	    }
	    else {
	      max_distance = Math.max(max_distance, bfs[index].distance);
	    }
	  }
	  if(additional_node) {
	    max_distance += 1;
	  }
	  if(infinity_node) {
	    max_distance += 1;
	  }

	  var start_color = new THREE.Color(defaults.bfs_gradient_start_color);
	  var middle_color = new THREE.Color(defaults.bfs_gradient_middle_color);  
	  var end_color = new THREE.Color(defaults.bfs_gradient_end_color);  
	  var gradient = [],
	      firstColor = start_color,
	      secondColor = middle_color;
	  
	  var half = max_distance / 2;
	  for(var i = 0; i < max_distance; i++) {
	    if(i > half) {
	      firstColor = middle_color;
	      secondColor = end_color;
	    }

	    var newColor = new THREE.Color();
	    newColor.r = firstColor.r + (secondColor.r - firstColor.r) / max_distance * i;
	    newColor.g = firstColor.g + (secondColor.g - firstColor.g) / max_distance * i;
	    newColor.b = firstColor.b + (secondColor.b - firstColor.b) / max_distance * i;
	    gradient.push(newColor);
	  }
	  
	  for(index in bfs) {
	    var hex_color = '#ffffff';
	    if(bfs[index].distance != Infinity) {
	      hex_color = gradient[bfs[index].distance].getHex();
	    }
	    colorSingleNode(graph.getNodeById(index), hex_color);
	    segment_color_obj[index] = hex_color;
	  }
	  
	  //TODO directed
	  //[und_edges, dir_edges].forEach(function(edges) {
	  //});
	  for(edge_index in und_edges) {
	    var edge = und_edges[edge_index];
	    var node_a_id = edge._node_a.getID();
	    var node_b_id = edge._node_b.getID();
	    
	    if(segment_color_obj[node_a_id] !== 'undefined' && 
	       segment_color_obj[node_b_id] !== 'undefined') {
	      colorSingleEdge(edge, segment_color_obj[node_a_id], segment_color_obj[node_b_id]);
	    }
	  }
	  //console.log(bfs);
	  window.requestAnimationFrame(update);
	}

	//Hint: index = node id
	function colorDFS(node) {
	  segment_color_obj = {};
	  var start_node = graph.getRandomNode();;
	  if(node != null) {
	    start_node = node;
	  }
	  var dfs = $G.search.DFS(graph, start_node);
	  //console.log(dfs);

	  //var Gradient = require('gradient');  
	  //var grad = Gradient(defaults.dfs_gradient_start_color, 
	                      //defaults.dfs_gradient_end_color, 
	                      //dfs.length);
	  //var colors = grad.toArray('hexString');
	  
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

	function colorBFSclick() {
	  //console.log(selected_node);
	  colorBFS(selected_node);
	}

	function colorDFSclick() {
	  colorDFS(selected_node);
	}

	module.exports = {
	  addNode: addNode,
	  addRandomNodes: addRandomNodes,
	  hideNode: hideNode,
	  addEdge: addEdge,
	  colorSingleNode: colorSingleNode,
	  colorAllNodes: colorAllNodes,
	  colorSingleEdge: colorSingleEdge,
	  colorAllEdges: colorAllEdges,
	  colorBFS: colorBFS,
	  colorDFS: colorDFS,
	  colorBFSclick: colorBFSclick,
	  colorDFSclick: colorDFSclick
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var network = __webpack_require__(2).network;
	var camera = __webpack_require__(2).camera;
	var update = __webpack_require__(2).update;
	var nodes_obj_idx = __webpack_require__(2).nodes_obj_idx;
	var edges_obj_idx = __webpack_require__(2).edges_obj_idx;
	var dims = __webpack_require__(1).globals.graph_dims;
	var mouse = __webpack_require__(1).globals.mouse;
	var defaults = __webpack_require__(1).defaults;

	var TWO_D_MODE = 0,
	    INTERSECTED = {
	      index: 0, color: new THREE.Color(), node: null
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
	  window.old_coordinates = new Float32Array(graph.nrNodes() * 3);
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
	  raycaster.params.Points.threshold = 1;

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
	    INTERSECTED.node = window.graph.getNodeById(nodeID);
	    
	    //Hint: update is called in navigation
	    //window.requestAnimationFrame(update);
	  }
	}

	module.exports = {
	    INTERSECTED: INTERSECTED,
	    TWO_D_MODE: TWO_D_MODE,
	    updateNodePosition: updateNodePosition,
	    updateAll: updateAll,
	    updateRandomPostions: updateRandomPostions,
	    switchTo2D: switchTo2D,
	    switchTo3D: switchTo3D,
	    nodeIntersection: nodeIntersection
	};


/***/ },
/* 5 */,
/* 6 */,
/* 7 */
/***/ function(module, exports) {

	

/***/ },
/* 8 */
/***/ function(module, exports) {

	
	/**
	 * delta t stuff
	 */

	function main_loop() {
	  /**
	   * Check for changes,
	   * - if none, do nothing
	   * - if changes, invoke reader and GO!
	   */

	  window.requestAnimationFrame(main_loop);
	}

	window.requestAnimationFrame(main_loop);


/***/ },
/* 9 */
/***/ function(module, exports) {

	

/***/ },
/* 10 */
/***/ function(module, exports) {

	input.onchange = function(event, explicit, direction, weighted_mode) {

	  var explicit = typeof explicit === 'undefined' ? false : explicit;
	  var direction = typeof direction === 'undefined' ? false : direction;
	  var weighted_mode = typeof weighted_mode === 'undefined' ? false : weighted_mode;
	  
	  var json = new $G.input.JsonInput(explicit, direction, weighted_mode);

	  //checks if the browser supports the file API
	  if (!window.File && window.FileReader && window.FileList && window.Blob) {
	    alert("Browser does not support the File API.");
	  }

	  var files = document.getElementById('input').files;
	  if (!files.length) {
	    alert("No file selected.");
	    return;
	  }

	  //only json files
	  splitFileName = files[0].name.split(".");
	  if(!splitFileName.pop().match('json')) {
	    alert("Invalid file type - it must be a json file.");
	    return;
	  }
	  // -> only works in firefox - chrome has no file.type
	  /*if (!files[0].type.match('json')){
	    alert('Wrong file type.');
	    return;
	  }*/

	  var reader = new FileReader();
	  var result = null;

	  reader.onloadend = function(event){
	    if (event.target.readyState == FileReader.DONE) {
	      //console.log(event.target.result);
	      var parsedFile = JSON.parse(event.target.result);
	      window.graph = json.readFromJSON(parsedFile);

	      document.querySelector("#nodes").innerHTML = parsedFile.nodes;
	      document.querySelector("#edges").innerHTML = parsedFile.edges;
	      //document.querySelector("#time").innerHTML = parsedFile.edges;

	      //console.log(parsedFile.data);
	      result = parsedFile.data;
	    }
	  }
	  reader.readAsText(files[0]);

	  return result;
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	

/***/ },
/* 12 */
/***/ function(module, exports) {

	

/***/ },
/* 13 */
/***/ function(module, exports) {

	

/***/ },
/* 14 */
/***/ function(module, exports) {

	var FSelem = {
	      el: null,
	      width: null,
	      height: null
	    };

	function switchToFullScreen(elem_string) {
	  var elem = document.querySelector(elem_string);
	  var canvas = document.querySelector(elem_string + " canvas");
	  console.log(canvas);
	  if (elem) {
	    FSelem = {
	      el: elem,
	      width: elem.clientWidth,
	      height: elem.clientHeight
	    }
	    // console.log(elem);
	    if (elem.requestFullscreen) {
	      elem.requestFullscreen();
	    } else if (elem.msRequestFullscreen) {
	      elem.msRequestFullscreen();
	    } else if (elem.mozRequestFullScreen) {
	      elem.mozRequestFullScreen();
	    } else if (elem.webkitRequestFullscreen) {
	      elem.webkitRequestFullscreen();
	    }
	    canvas.focus();
	  }
	  else {
	    alert("Element to full-screen does not exist...");
	  }
	}

	function FShandler( event ) {
	  var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
	  var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
	  if ( fullscreenElement ) {
	      // console.log("fullscreen enabled!");
	      fullscreenElement.style.width = "100%";
	      fullscreenElement.style.height = "100%";
	  }
	  else {
	      // console.log("fullscreen disabled!");
	      // we can't get the element that WAS in fullscreen,
	      // so we fall back to a manual entry...
	      // console.log(FSelem);
	      FSelem.el.style.width = FSelem.width+"px";
	      FSelem.el.style.height = FSelem.height+"px";
	  }
	}

	function setAndUpdateNrMutilate() {
	  var val = document.querySelector("#nr_mutilate_per_frame").value;
	  document.querySelector("#nr_mutilate_per_frame_val").innerHTML = val;
	  window.$GV.setNrMutilate(val);
	}

	document.addEventListener("fullscreenchange", FShandler);
	document.addEventListener("webkitfullscreenchange", FShandler);
	document.addEventListener("mozfullscreenchange", FShandler);
	document.addEventListener("MSFullscreenChange", FShandler);


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var keys = __webpack_require__(1).keys;
	var globals = __webpack_require__(1).globals;
	var selected_node = __webpack_require__(1).globals.selected_node;
	var camera = __webpack_require__(2).camera;
	var defaults = __webpack_require__(1).defaults;
	var update = __webpack_require__(2).update;
	var network = __webpack_require__(2).network;
	var container = __webpack_require__(1).container;
	var mouse = __webpack_require__(1).globals.mouse;
	var nodeIntersection = __webpack_require__(4).nodeIntersection;
	var INTERSECTED = __webpack_require__(4).INTERSECTED;
	var callbacks = __webpack_require__(1).callbacks;

	// for testing purposes
	var intersect_cb1 = function(node) {  
	  document.querySelector("#nodeID").innerHTML = node._id;  
	}
	callbacks.node_intersects.push(intersect_cb1);


	//rotation
	var axis_x = new THREE.Vector3( 1, 0, 0 ),
	    axis_y = new THREE.Vector3( 0, 1, 0 ),
	    axis_z = new THREE.Vector3( 0, 0, 1 );

	window.addEventListener('keypress', key, false);
	function key(event) {
	  switch (event.charCode) {
	    case keys.KEY_W: //zoom in
	      camera.position.y = camera.position.y - defaults.delta_distance; break;
	    case keys.KEY_S: //zoom out
	      camera.position.y = camera.position.y + defaults.delta_distance; break;
	    case keys.KEY_A: //move left
	      camera.position.x = camera.position.x + defaults.delta_distance; break;
	    case keys.KEY_D: //move right
	      camera.position.x = camera.position.x - defaults.delta_distance; break;
	    case keys.KEY_R:
	      network.translateZ(defaults.delta_distance); break;
	    case keys.KEY_F:
	      network.translateZ(-defaults.delta_distance); break;

	    case keys.KEY_X:
	      network.rotateOnAxis(axis_x, defaults.delta_rotation);
	      axis_y.applyAxisAngle(axis_x, -defaults.delta_rotation);
	      break;
	    case keys.KEY_SX:
	      network.rotateOnAxis(axis_x, -defaults.delta_rotation);
	      axis_y.applyAxisAngle(axis_x, defaults.delta_rotation);
	      break;
	    case keys.KEY_Y:
	      network.rotateOnAxis(axis_y, defaults.delta_rotation);
	      axis_x.applyAxisAngle(axis_y, -defaults.delta_rotation);
	      break;
	    case keys.KEY_SY:
	      network.rotateOnAxis(axis_y, -defaults.delta_rotation);
	      axis_x.applyAxisAngle(axis_y, defaults.delta_rotation);
	      break;
	    case keys.KEY_C:
	      network.rotateOnAxis(axis_z, defaults.delta_rotation);
	      axis_x.applyAxisAngle(axis_z, -defaults.delta_rotation);
	      axis_y.applyAxisAngle(axis_z, -defaults.delta_rotation);
	      break;
	    case keys.KEY_SC:
	      network.rotateOnAxis(axis_z, -defaults.delta_rotation);
	      axis_x.applyAxisAngle(axis_z, defaults.delta_rotation);
	      axis_y.applyAxisAngle(axis_z, defaults.delta_rotation);
	      break;
	    default:
	      break;
	  }
	  window.requestAnimationFrame(update);
	}

	//zoom in and out
	window.addEventListener('mousewheel', mousewheel, false);
	function mousewheel(event) {
	  //wheel down: negative value
	  //wheel up: positive value
	  if(event.shiftKey) {
	    console.log("wheel");
	    if(event.wheelDelta < 0) {
	      network.rotateOnAxis(axis_y, -defaults.delta_rotation);
	      axis_x.applyAxisAngle(axis_y, defaults.delta_rotation);
	    }
	    else {
	      network.rotateOnAxis(axis_y, defaults.delta_rotation);
	      axis_x.applyAxisAngle(axis_y, -defaults.delta_rotation);
	    }
	  }
	  else {
	    camera.fov -= defaults.ZOOM_FACTOR * event.wheelDeltaY;
	    camera.fov = Math.max( Math.min( camera.fov, defaults.MAX_FOV ), defaults.MIN_FOV );
	    camera.projectionMatrix = new THREE.Matrix4().makePerspective(camera.fov, container.WIDTH / container.HEIGHT, camera.near, camera.far);
	  }
	  window.requestAnimationFrame(update);
	}

	window.addEventListener( 'mousemove', mouseMove, false );
	function mouseMove(event) {
	  
	  if(event.shiftKey && event.buttons == 1) {
	    if(event.movementX > 0) {
	      network.rotateOnAxis(axis_z, defaults.delta_rotation);
	      axis_x.applyAxisAngle(axis_z, -defaults.delta_rotation);
	      axis_y.applyAxisAngle(axis_z, -defaults.delta_rotation);
	    }
	    else if(event.movementX < 0) {
	      network.rotateOnAxis(axis_z, -defaults.delta_rotation);
	      axis_x.applyAxisAngle(axis_z, defaults.delta_rotation);
	      axis_y.applyAxisAngle(axis_z, defaults.delta_rotation);
	    }
	    else if(event.movementY > 0) {
	      network.rotateOnAxis(axis_x, defaults.delta_rotation);
	      axis_y.applyAxisAngle(axis_x, -defaults.delta_rotation);
	    }
	    else if(event.movementY < 0) {
	      network.rotateOnAxis(axis_x, -defaults.delta_rotation);
	      axis_y.applyAxisAngle(axis_x, defaults.delta_rotation);
	    }
	  }
	  //left mouse button
	  else if(event.buttons == 1) {
	    var mouseX = event.clientX / container.WIDTH;
	    var mouseY = event.clientY / container.HEIGHT;

	    var rest = (container.WIDTH/2) - (globals.graph_dims.MAX_X/2);
	    var max_x = globals.graph_dims.MAX_X/2;
	    var max_y = globals.graph_dims.MAX_Y/2;    
	    
	    if(camera.position.x > max_x) {
	      camera.position.x = max_x;
	    }
	    else if(camera.position.x < -max_x) {
	      camera.position.x = -max_x;
	    }
	    else if(camera.position.y > max_y) {
	      camera.position.y = max_y;
	    }
	    else if(camera.position.y < -max_y) {
	      camera.position.y = -max_y;
	    }
	    
	    //movement in y: up is negative, down is positive
	    camera.position.x = camera.position.x - (mouseX * event.movementX);
	    camera.position.y = camera.position.y + (mouseY * event.movementY);
	  }

	  //raycaster
	  // calculate mouse position in normalized device coordinates
	  // (-1 to +1) for both components
	  event.preventDefault();  
	  var element = document.querySelector('#containerGraph');
	  var rect = element.getBoundingClientRect();  
	  mouse.x = ((event.clientX - rect.left) / container.WIDTH) * 2 - 1;
	  mouse.y = - ((event.clientY - rect.top) / container.HEIGHT) * 2 + 1;
	  //intersect after init grap
	  if(network.children[0] != null) {
	    window.requestAnimationFrame(nodeIntersection);
	  }
	  window.requestAnimationFrame(update);
	}

	window.addEventListener('click', click, false);
	function click(event) {  
	  if(INTERSECTED.node != null) {
	    selected_node = INTERSECTED.node;
	    document.querySelector("#nodeInfo").style.visibility = 'visible';
	    var ni = callbacks.node_intersects;
	    for (var cb in ni) {
	      if (typeof ni[cb] === 'function') {
	        ni[cb](INTERSECTED.node);
	      }
	    }
	  }
	}

	module.exports = {
	  mouse: mouse
	};


/***/ }
/******/ ]);