var ZOOM_FACTOR = 0.05,
    MAX_FOV = 100, //zoom out
    MIN_FOV = 20, //zoom in
    KEY_A = 97,
    KEY_D = 100,
    KEY_W = 119,
    KEY_S = 115,
    KEY_R = 114,
    KEY_F = 102,
    KEY_X = 120,
    KEY_Y = 121,
    KEY_C = 99,
    KEY_SX = 88,
    KEY_SY = 89,
    KEY_SC = 67,
    WIDTH = 1500,
    HEIGHT = 900;


renderButton.onclick = function() {
  initGraph();
  window.$GV.render();
}

function render() {
  var MIN_X = MAX_X = nodes_obj[0].getFeature('coords').x,
      MIN_Y = MAX_Y = nodes_obj[0].getFeature('coords').y,
      MIN_Z = MAX_Z = nodes_obj[0].getFeature('coords').z;

  var scene = new THREE.Scene(); // Create a Three.js scene object.
  var camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 0.1, 1000); // Define the perspective camera's attributes.

  var renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer(); // Fallback to canvas renderer, if necessary.
  renderer.setSize(WIDTH, HEIGHT); // Set the size of the WebGL viewport.
  //document.body.appendChild(renderer.domElement); // Append the WebGL viewport to the DOM.
  var element = document.getElementById("containerGraph");
  element.appendChild(renderer.domElement); // Append the WebGL viewport to the DOM.

  var edges = new THREE.Group();
  var nodes = new THREE.Group();
  window.network = new THREE.Group();

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

  for(node in nodes_obj) {
    var sphere = new THREE.Mesh(geometry, material);
    var x = nodes_obj[node].getFeature('coords').x,
        y = nodes_obj[node].getFeature('coords').y,
        z = nodes_obj[node].getFeature('coords').z;

    MIN_X = Math.min(MIN_X, x);
    MIN_Y = Math.min(MIN_Y, y);
    MIN_Z = Math.min(MIN_Z, z);

    MAX_X = Math.max(MAX_X, x);
    MAX_Y = Math.max(MAX_Y, y);
    MAX_Z = Math.max(MAX_Z, z);

    sphere.position.set( x, y, z );
    nodes.add(sphere);
  }
  network.add(nodes);

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
    //scene.add( line );
    edges.add(line);
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
    //scene.add( line );
    edges.add(line);
  }
  network.add(edges);

  network.translateX(-MAX_X/2);
  network.translateY(-MAX_Y/2);
  network.translateZ(-MAX_Z/2);
  scene.add(network);
  camera.position.z = Math.max(MAX_X, MAX_Y);

  var render = function () {
    renderer.render(scene, camera); // Each time we change the position of the cube object, we must re-render it.
    //requestAnimationFrame(render); // Call the render() function up to 60 times per second (i.e., up to 60 animation frames per second).
  };
  window.requestAnimationFrame(render);

  window.addEventListener('keypress', key, false);
  function key(event) {
    var deltaDistance = 10; //distance to move
    var deltaRotation = 0.05; //rotation step

    switch (event.charCode) {
      case KEY_W: //zoom in
        //camera.position.y = camera.position.y - deltaDistance; break;
        network.translateY(deltaDistance); break;
      case KEY_S: //zoom out
        //camera.position.y = camera.position.y + deltaDistance; break;
        network.translateY(-deltaDistance); break;
      case KEY_A: //move left
        //camera.position.x = camera.position.x + deltaDistance; break;
        network.translateX(-deltaDistance); break;
      case KEY_D: //move right
        //camera.position.x = camera.position.x - deltaDistance; break;
        network.translateX(deltaDistance); break;
      case KEY_R:
        network.translateZ(deltaDistance); break;
      case KEY_F:
        network.translateZ(-deltaDistance); break;
      case KEY_X:
        network.rotation.x += deltaRotation; break;
      case KEY_SX:
        network.rotation.x -= deltaRotation; break;
      case KEY_Y:
        network.rotation.y += deltaRotation; break;
      case KEY_SY:
        network.rotation.y -= deltaRotation; break;
      case KEY_C:
        network.rotation.z += deltaRotation; break;
      case KEY_SC:
        network.rotation.z -= deltaRotation; break;
      default:
        break;
    }
    //camera.updateProjectionMatrix();
    window.requestAnimationFrame(render);
    // render();
  }

  window.addEventListener('mousewheel', mousewheel, false);
  function mousewheel(event) {
    //wheel down: negative value
    //wheel up: positive value
    camera.fov -= ZOOM_FACTOR * event.wheelDeltaY;
    camera.fov = Math.max( Math.min( camera.fov, MAX_FOV ), MIN_FOV );
    camera.projectionMatrix = new THREE.Matrix4().makePerspective(camera.fov, WIDTH / HEIGHT, camera.near, camera.far);
    window.requestAnimationFrame(render);
  }

  window.addEventListener('click', mousedown, false);
  function mousedown(event) {
    var raycaster = new THREE.Raycaster(); // create once
    var mouse = new THREE.Vector2();

    event.preventDefault();

    mouse.x = ( event.clientX / WIDTH ) * 2 - 1; //renderer.domElement.width
    mouse.y = - ( event.clientY / HEIGHT ) * 2 + 1; //renderer.domElement.height

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera( mouse, camera );
    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects( nodes.children );
    for ( var i = 0; i < intersects.length; i++ ) {
      intersects[ i ].object.material.color.set( 0xff0000 );
    }
    //console.log(nodes.children);
    render();
  }

  window.addEventListener('resize', windowResize, false);
  function windowResize() {
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
    renderer.setSize(WIDTH, HEIGHT);
  }
}

function switchTo2D(network) {
  for(var i = 0; i < network.children[0].children.length; i++) {
    //console.log(network.children[0].children.position.z);
    network.children[0].children[i].position.setZ(0);
  }

  for(var i = 0; i < network.children[1].children.length; i++) {
    network.children[1].children[i].geometry.vertices[0].setZ(0);
    network.children[1].children[i].geometry.vertices[1].setZ(0);
    network.children[1].children[i].geometry.verticesNeedUpdate = true;
  }
}

function switchTo3D() {
  for(node in node_keys) {
    var z = nodes_obj[node].getFeature('coords').z;
    network.children[0].children[node].position.setZ(z);
  }

  var i = 0; //TODO
  for (var u_edge in und_edges) {
    edge = und_edges[u_edge];
    node_a_id = edge._node_a.getID();
    node_b_id = edge._node_b.getID();

    var z_a = nodes_obj[node_a_id].getFeature('coords').z;
    var z_b = nodes_obj[node_b_id].getFeature('coords').z;

    network.children[1].children[i].geometry.vertices[0].setZ(z_a);
    network.children[1].children[i].geometry.vertices[1].setZ(z_b);
    network.children[1].children[i].geometry.verticesNeedUpdate = true;
    i++;
  }
  for (var d_edge in dir_edges) {
    edge = dir_edges[d_edge];
    node_a_id = edge._node_a.getID();
    node_b_id = edge._node_b.getID();

    var z_a = nodes_obj[node_a_id].getFeature('coords').z;
    var z_b = nodes_obj[node_b_id].getFeature('coords').z;

    network.children[1].children[i].geometry.vertices[0].setZ(z_a);
    network.children[1].children[i].geometry.vertices[1].setZ(z_b);
    network.children[1].children[i].geometry.verticesNeedUpdate = true;
    i++;
  }
}

if (window !== 'undefined') {
  // window.test = test;

  window.$GV = {
    render: render,
    switchTo2D: switchTo2D,
    switchTo3D: switchTo3D
    // mutilateGraph: mutilateNGraph
  }
}
