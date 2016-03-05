var container = require("./init.js").container;
var defaults = require("./init.js").defaults;
var mouse = require("../view/navigation.js").mouse;

    //basics
var network = new THREE.Group(),
    camera = new THREE.PerspectiveCamera(
      70, 
      container.WIDTH / container.HEIGHT, 
      0.1, 1000),
    scene = new THREE.Scene(),
    renderer = new THREE.WebGLRenderer({antialias: false}),
    raycaster = new THREE.Raycaster(),
    
    //tmp object to find indices
    nodes_obj_idx = new Object(),
    edges_obj_idx = new Object(),
    
    //coordinates
    MIN_X = MAX_X = MIN_Y = MAX_Y = MIN_Z = MAX_Z =
    AVG_X = AVG_Y = AVG_Z = 0;


var renderGraph = function() {
  console.log("render graph");
  if ( !window.nodes_obj || !window.node_keys ) {
    window.nodes_obj = window.graph.getNodes();
    window.node_keys = Object.keys(window.nodes_obj);
    window.und_edges = window.graph.getUndEdges();
    window.und_edges_keys = Object.keys(window.und_edges);
    window.dir_edges = window.graph.getDirEdges();
    window.dir_edges_keys = Object.keys(window.dir_edges);
  }
  
  MIN_X = MAX_X = nodes_obj[0].getFeature('coords').x;
  MIN_Y = MAX_Y = nodes_obj[0].getFeature('coords').y;
  MIN_Z = MAX_Z = nodes_obj[0].getFeature('coords').z;  

  for(node in nodes_obj) {
    var x = nodes_obj[node].getFeature('coords').x;
    var y = nodes_obj[node].getFeature('coords').y;
    var z = nodes_obj[node].getFeature('coords').z;

    MIN_X = Math.min(MIN_X, x);
    MIN_Y = Math.min(MIN_Y, y);
    MIN_Z = Math.min(MIN_Z, z);

    MAX_X = Math.max(MAX_X, x);
    MAX_Y = Math.max(MAX_Y, y);
    MAX_Z = Math.max(MAX_Z, z);
  }
  AVG_X = (MAX_X - MIN_X) / 2;
  AVG_Y = (MAX_Y - MIN_Y) / 2;
  AVG_Z = (MAX_Z - MIN_Z) / 2;

  renderer.setSize(container.WIDTH, container.HEIGHT); 
  renderer.setClearColor(defaults.background_color, 1);

  var element = document.getElementById("containerGraph");
  element.appendChild(renderer.domElement);

  var i = 0;
  var vertices = new Float32Array(graph.nrNodes() * 3);
  var nodeColors = new Float32Array(graph.nrNodes() * 3);
  for(node in nodes_obj) {
    var x = nodes_obj[node].getFeature('coords').x;
    var y = nodes_obj[node].getFeature('coords').y;
    var z = nodes_obj[node].getFeature('coords').z;

    vertices[i*3] = x - AVG_X;
    vertices[i*3 + 1] = y - AVG_Y;
    vertices[i*3 + 2] = z - AVG_Z;

    // Trying to set original color
    nodeColors[i*3] = nodes_obj[node].getFeature('color').r/256.0;
    nodeColors[i*3 + 1] = nodes_obj[node].getFeature('color').g/256.0;
    nodeColors[i*3 + 2] = nodes_obj[node].getFeature('color').b/256.0;

    nodes_obj_idx[node]= i*3;
    i++;
  }

  var geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.addAttribute('color', new THREE.BufferAttribute( nodeColors, 3));

  var material = new THREE.PointsMaterial({
    vertexColors: THREE.VertexColors,
    size: defaults.node_size
  });

  particles = new THREE.Points(geometry, material);
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

      positionLine[i * 6] = nodes_obj[node_a_id].getFeature('coords').x - AVG_X;
      positionLine[i * 6 + 1] = nodes_obj[node_a_id].getFeature('coords').y - AVG_Y;
      positionLine[i * 6 + 2] = nodes_obj[node_a_id].getFeature('coords').z - AVG_Z;
      positionLine[i * 6 + 3] = nodes_obj[node_b_id].getFeature('coords').x - AVG_X;
      positionLine[i * 6 + 4] = nodes_obj[node_b_id].getFeature('coords').y - AVG_Y;
      positionLine[i * 6 + 5] = nodes_obj[node_b_id].getFeature('coords').z - AVG_Z;

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
  camera.position.z = Math.max(MAX_X, MAX_Y);
  window.requestAnimationFrame(updateGraph);
}


var updateGraph = function () {
  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);
  //raycaster.params.Points.threshold = 15;
  // calculate objects intersecting the picking ray
  //TODO 
  var test = new Array();
  test.push(network.children[0]);
  intersects = raycaster.intersectObjects(test); //network.children
  ////console.log(particles);
  //if ( intersects.length > 0 ) {
    //console.log("intersected objects");
    //console.log(intersects);
    //intersects[0].object.material.color.set( 0xe0f600 );
    //intersects[0].object.material.needsUpdate = true;
  //}
  
  
  //for ( var i = 0; i < intersects.length; i++ ) {
    //intersects[ i ].object.material.color.set( 0xff0000 );
  //}
  
  
  //var intersects = raycaster.intersectObjects( scene.children );

  //if ( intersects.length > 0 ) {
    //if ( INTERSECTED != intersects[0].object ) {
      //if ( INTERSECTED ) { //INTERSECTED.material.program = programStroke;
         //console.log("> 0");
      //}
      //INTERSECTED = intersects[ 0 ].object;
      ////INTERSECTED.material.program = programFill;
    //}

  //} else {
    //if ( INTERSECTED ) { //INTERSECTED.material.program = programStroke; 
      //console.log("< 0");
    //}
    //INTERSECTED = null;
  //}
  
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
