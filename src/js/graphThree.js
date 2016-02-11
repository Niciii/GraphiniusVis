renderButton.onclick = function() {
  initGraph();
  window.$GV.render();
}

function render() {
  var scene = new THREE.Scene(); // Create a Three.js scene object.
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Define the perspective camera's attributes.
  camera.position.z = 500; // Move the camera away from the origin, down the positive z-axis.

  var renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer(); // Fallback to canvas renderer, if necessary.
  renderer.setSize(window.innerWidth, window.innerHeight); // Set the size of the WebGL viewport.
  document.body.appendChild(renderer.domElement); // Append the WebGL viewport to the DOM.

  // Be aware that a light source is required for MeshPhongMaterial to work:
  var pointLight = new THREE.PointLight(0xFFFFFF); // Set the color of the light source (white).
  pointLight.position.set(100, 100, 250); // Position the light source at (x, y, z).
  scene.add(pointLight); // Add the light source to the scene.

  //NODE
  //var texture = THREE.ImageUtils.loadTexture(bitmap.src); // Create texture object based on the given bitmap path.
  //material = new THREE.MeshBasicMaterial({ color: 0xFF00FF, wireframe: true });
  //new THREE.MeshLambertMaterial ({color: 0xCC0000}); 
  var material = new THREE.MeshPhongMaterial({ color: 0x1f9ed5/*0xCC0000*/ }); // Create a material (for the spherical mesh) that reflects light, potentially causing sphere surface shadows.
  var geometry = new THREE.SphereGeometry(5, 64, 64); // Radius size, number of vertical segments, number of horizontal rings.

  for(node in node_keys) {
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(
      nodes_obj[node].getFeature('coords').x, 
      nodes_obj[node].getFeature('coords').y, 
      nodes_obj[node].getFeature('coords').z
    );
    scene.add(sphere); 
  }
  
  //EDGE
  var materialLine = new THREE.LineBasicMaterial({
    color: 0x1f9ed5,
    linewidth: 1
  });

  for (var u_edge in und_edges) {
    edge = und_edges[u_edge];
    node_a_id = edge._node_a.getID();
    node_b_id = edge._node_b.getID();
    
    var geometryLine = new THREE.Geometry();
    geometryLine.vertices.push(
      new THREE.Vector3(
        nodes_obj[node_a_id].getFeature('coords').x, 
        nodes_obj[node_a_id].getFeature('coords').y, 
        nodes_obj[node_a_id].getFeature('coords').z
      ),
      new THREE.Vector3(
        nodes_obj[node_b_id].getFeature('coords').x, 
        nodes_obj[node_b_id].getFeature('coords').y, 
        nodes_obj[node_b_id].getFeature('coords').z
      )
    );
    var line = new THREE.Line( geometryLine, materialLine );
    scene.add( line );
  }
  for (var d_edge in dir_edges) {
    edge = dir_edges[d_edge];
    node_a_id = edge._node_a.getID();
    node_b_id = edge._node_b.getID();

    var geometryLine = new THREE.Geometry();
    geometryLine.vertices.push(
      new THREE.Vector3(
        nodes_obj[node_a_id].getFeature('coords').x, 
        nodes_obj[node_a_id].getFeature('coords').y, 
        nodes_obj[node_a_id].getFeature('coords').z
      ),
      new THREE.Vector3(
        nodes_obj[node_b_id].getFeature('coords').x, 
        nodes_obj[node_b_id].getFeature('coords').y, 
        nodes_obj[node_b_id].getFeature('coords').z
      )
    );
    var line = new THREE.Line( geometryLine, materialLine );
    scene.add( line );
  }
  
  var render = function () {
    renderer.render(scene, camera); // Each time we change the position of the cube object, we must re-render it.
    //requestAnimationFrame(render); // Call the render() function up to 60 times per second (i.e., up to 60 animation frames per second).
  };

  render();
}

if (window !== 'undefined') {
  // window.test = test;

  window.$GV = {
    render: render,
    // mutilateGraph: mutilateNGraph
  }
}
