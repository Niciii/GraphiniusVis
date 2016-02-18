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
    HEIGHT = 900,
    mouse = [0.5, 0.5];
    
window.axis_x = new THREE.Vector3( 1, 0, 0 );
window.axis_y = new THREE.Vector3( 0, 1, 0 );
window.axis_z = new THREE.Vector3( 0, 0, 1 );
var deltaDistance = 10; //distance to move
var deltaRotation = 0.05; //rotation step

renderButton.onclick = function() {
  initGraph();
  window.$GV.renderGraph();
}

function renderGraph() {
  var MIN_X = MAX_X = nodes_obj[0].getFeature('coords').x,
      MIN_Y = MAX_Y = nodes_obj[0].getFeature('coords').y,
      MIN_Z = MAX_Z = nodes_obj[0].getFeature('coords').z,
      AVG_X = AVG_Y = AVG_Z = 0;

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

  var scene = new THREE.Scene(); // Create a Three.js scene object.
  var camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 0.1, 1000); //TODO change to 0.1// Define the perspective camera's attributes.
  var renderer = new THREE.WebGLRenderer({ antialias: false }); //window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer(); // Fallback to canvas renderer, if necessary.
  renderer.setSize(WIDTH, HEIGHT); // Set the size of the WebGL viewport.
  renderer.setClearColor( 0x000000, 1 );
  //renderer.setPixelRatio( window.devicePixelRatio );
  //renderer.gammaInput = true;
	//renderer.gammaOutput = true;
  var element = document.getElementById("containerGraph");
  element.appendChild(renderer.domElement); // Append the WebGL viewport to the DOM.
  
  var i = 0;
  var vertices = new Float32Array( graph.nrNodes() * 3 );
  for(node in nodes_obj) {
    var x = nodes_obj[node].getFeature('coords').x;
    var y = nodes_obj[node].getFeature('coords').y;
    var z = nodes_obj[node].getFeature('coords').z;
    
    vertices[ i*3 ] = x - AVG_X;
    vertices[ i*3 + 1 ] = y - AVG_Y;
    vertices[ i*3 + 2 ] = z - AVG_Z;
    i++;
  }

  var geometry = new THREE.BufferGeometry();    
  geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.addAttribute('color', new THREE.BufferAttribute( 0x8aa7ff, 3));

  var material = new THREE.PointsMaterial({ // MeshBasicMaterial
    color: 0x8aa7ff,
    size: 10
    //map: texture
  });  

  particles = new THREE.Points( geometry, material );
	//scene.add( particles );

  //EDGE
  var materialLine = new THREE.LineBasicMaterial({
    color: 0x81cf28,
    transparent : true,
    opacity: 0.5//default is 1; range: 0.0 - 1.0
   //vertexColors: THREE.VertexColors  //,
    //linewidth: 1
  });  

  window.network = new THREE.Group();
  console.log(network);
  network.add(particles);
  
  [und_edges, dir_edges].forEach(function(edges) {
    var i = 0;
    var positionLine = new Float32Array(Object.keys(edges).length * 6); //2 vertices * 3 xyz
    for (var edge_index in edges) {
      var edge = edges[edge_index];
      var node_a_id = edge._node_a.getID();
      var node_b_id = edge._node_b.getID();
      
      positionLine[ i * 6 ] = nodes_obj[node_a_id].getFeature('coords').x - AVG_X;
      positionLine[ i * 6 + 1 ] = nodes_obj[node_a_id].getFeature('coords').y - AVG_Y;
      positionLine[ i * 6 + 2 ] = nodes_obj[node_a_id].getFeature('coords').z - AVG_Z;
      positionLine[ i * 6 + 3 ] = nodes_obj[node_b_id].getFeature('coords').x - AVG_X;
      positionLine[ i * 6 + 4 ] = nodes_obj[node_b_id].getFeature('coords').y - AVG_Y;
      positionLine[ i * 6 + 5 ] = nodes_obj[node_b_id].getFeature('coords').z - AVG_Z;
      i++;
    }
    var geometryLine = new THREE.BufferGeometry();
    geometryLine.addAttribute('position', new THREE.BufferAttribute(positionLine, 3));
    //geometryLine.addAttribute('color', new THREE.BufferAttribute( 0xff700e, 3));
    //geometry.computeBoundingSphere();
    var line = new THREE.Line( geometryLine, materialLine );
    //scene.add( line );
    network.add(line);
  });

  network.translateX(-MAX_X/2);
  network.translateY(-MAX_Y/2);
  network.translateZ(-MAX_Z/2);
  scene.add(network);
  camera.position.z = Math.max(MAX_X, MAX_Y);
  //camera.position.z = 500; // Move the camera away from the origin, down the positive z-axis.
  //camera.lookat(new THREE.Vector3(0,0,0));

  //The X axis is red. The Y axis is green. The Z axis is blue.
  //var axisHelper = new THREE.AxisHelper( Math.max(MAX_X, Math.max(MAX_Y, MAX_Z)) );
  //scene.add( axisHelper );
  //network.applyMatrix(axisHelper.matrixWorld);  

  var updateGraph = function () {
    renderer.render(scene, camera); // Each time we change the position of the cube object, we must re-render it.
    //requestAnimationFrame(render); // Call the render() function up to 60 times per second (i.e., up to 60 animation frames per second).
  };
  window.requestAnimationFrame(updateGraph);

  window.addEventListener('keypress', key, false);
  function key(event) {    
    switch (event.charCode) {
      case KEY_W: //zoom in
        camera.position.y = camera.position.y - deltaDistance; break;
        //network.translateY(deltaDistance); break;
      case KEY_S: //zoom out
        camera.position.y = camera.position.y + deltaDistance; break;
        //network.translateY(-deltaDistance); break;
      case KEY_A: //move left
        camera.position.x = camera.position.x + deltaDistance; break;
        //network.translateX(-deltaDistance); break;
      case KEY_D: //move right
        camera.position.x = camera.position.x - deltaDistance; break;
        //network.translateX(deltaDistance); break;
      case KEY_R:
        network.translateZ(deltaDistance); break;
      case KEY_F:
        network.translateZ(-deltaDistance); break;
        
      case KEY_X:
        //network.rotation.x += deltaRotation; break;
        network.rotateOnAxis(axis_x, deltaRotation);
        axis_y.applyAxisAngle(axis_x, -deltaRotation);
        axis_z.applyAxisAngle(axis_x, -deltaRotation);
        break;
      case KEY_SX:
        //network.rotation.x -= deltaRotation; break;
        network.rotateOnAxis(axis_x, -deltaRotation); 
        axis_y.applyAxisAngle(axis_x, deltaRotation);
        axis_z.applyAxisAngle(axis_x, deltaRotation);
        break;
      case KEY_Y:
        //network.rotation.y += deltaRotation; break;
        network.rotateOnAxis(axis_y, deltaRotation); 
        axis_x.applyAxisAngle(axis_y, -deltaRotation);
        axis_z.applyAxisAngle(axis_y, -deltaRotation);
        break;
      case KEY_SY:
        //network.rotation.y -= deltaRotation; break;
        network.rotateOnAxis(axis_y, -deltaRotation); 
        axis_x.applyAxisAngle(axis_y, deltaRotation);
        axis_z.applyAxisAngle(axis_y, deltaRotation);
        break;
      case KEY_C:
        //network.rotation.z += deltaRotation; break;
        network.rotateOnAxis(axis_z, deltaRotation); 
        axis_x.applyAxisAngle(axis_z, -deltaRotation);
        axis_y.applyAxisAngle(axis_z, -deltaRotation);
        break;
      case KEY_SC:
        //network.rotation.z -= deltaRotation; break;
        network.rotateOnAxis(axis_z, -deltaRotation); 
        axis_x.applyAxisAngle(axis_z, deltaRotation);
        axis_y.applyAxisAngle(axis_z, deltaRotation);
        break;
      default:
        break;
    }
    //camera.updateProjectionMatrix();
    window.requestAnimationFrame(updateGraph);
  }

  //zoom in and out
  window.addEventListener('mousewheel', mousewheel, false);
  function mousewheel(event) {
    //wheel down: negative value
    //wheel up: positive value    
    if(event.shiftKey) {
      var delta = deltaRotation;
      if(event.wheelDelta < 0) {      
        network.rotateOnAxis(axis_z, -deltaRotation);   
        delta *= -1;      
        axis_x.applyAxisAngle(axis_z, deltaRotation);
        axis_y.applyAxisAngle(axis_z, deltaRotation);
      }
      else {
        network.rotateOnAxis(axis_z, deltaRotation); 
        delta *= -1;
        axis_x.applyAxisAngle(axis_z, -deltaRotation);
        axis_y.applyAxisAngle(axis_z, -deltaRotation);
      }
    }
    else {
      camera.fov -= ZOOM_FACTOR * event.wheelDeltaY;
      camera.fov = Math.max( Math.min( camera.fov, MAX_FOV ), MIN_FOV );
      camera.projectionMatrix = new THREE.Matrix4().makePerspective(camera.fov, WIDTH / HEIGHT, camera.near, camera.far);
    }
    window.requestAnimationFrame(updateGraph);
  }
  
  document.addEventListener( 'mousemove', mouseMove, false );
  function mouseMove(event) {
    
    if(event.shiftKey && event.which == 1) {
      if(event.movementX > 0) {
        network.rotateOnAxis(axis_y, deltaRotation); 
        axis_x.applyAxisAngle(axis_y, -deltaRotation);
        axis_z.applyAxisAngle(axis_y, -deltaRotation);
      }
      else if(event.movementX < 0) {
        network.rotateOnAxis(axis_y, -deltaRotation); 
        axis_x.applyAxisAngle(axis_y, deltaRotation);
        axis_z.applyAxisAngle(axis_y, deltaRotation);
      }
      else if(event.movementY > 0) {
        network.rotateOnAxis(axis_x, deltaRotation);
        axis_y.applyAxisAngle(axis_x, -deltaRotation);
        axis_z.applyAxisAngle(axis_x, -deltaRotation);
      }
      else if(event.movementY < 0) {
        network.rotateOnAxis(axis_x, -deltaRotation);
        axis_y.applyAxisAngle(axis_x, deltaRotation);
        axis_z.applyAxisAngle(axis_x, deltaRotation);
      }
    }
    //left mouse button
    else if(event.which == 1) {      
      var mouseX = event.clientX / WIDTH;
      var mouseY = event.clientY / HEIGHT;
      //movement in y: up is negative, down is positive
      camera.position.x = camera.position.x - (mouseX * event.movementX);
      camera.position.y = camera.position.y + (mouseY * event.movementY);
    }
    
    window.requestAnimationFrame(updateGraph);
  }
  
  window.addEventListener('mouseup', mouseup, false);
  function mouseup(event) {
    //console.log("up");
  }
  
  window.addEventListener('click', mousedown, false);
  function mousedown(event) {

    //var raycaster = new THREE.Raycaster(); // create once
    //var mouse = new THREE.Vector2();

    //event.preventDefault();

    //mouse.x = ( event.clientX / WIDTH ) * 2 - 1; //renderer.domElement.width
    //mouse.y = - ( event.clientY / HEIGHT ) * 2 + 1; //renderer.domElement.height

    //// update the picking ray with the camera and mouse position
    //raycaster.setFromCamera( mouse, camera );
    //// calculate objects intersecting the picking ray
    //var intersects = raycaster.intersectObjects( nodes.children );
    //for ( var i = 0; i < intersects.length; i++ ) {
      //intersects[ i ].object.material.color.set( 0xff0000 );
    //}
    ////console.log(nodes.children);
    //updateGraph();
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
    network.children[0].children[i].position.setZ(0);
  }

  for(var i = 0; i < network.children[1].children.length; i++) {
    network.children[1].children[i].geometry.vertices[0].setZ(0);
    network.children[1].children[i].geometry.vertices[1].setZ(0);
    network.children[1].children[i].geometry.verticesNeedUpdate = true;
  }
  window.requestAnimationFrame(updateGraph);
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
  window.requestAnimationFrame(updateGraph);
}

if (window !== 'undefined') {
  // window.test = test;

  window.$GV = {
    renderGraph: renderGraph,
    switchTo2D: switchTo2D,
    switchTo3D: switchTo3D
  }
}
