//var ZOOM_FACTOR = 0.05,
    //MAX_FOV = 100, //zoom out
    //MIN_FOV = 20, //zoom in
    //KEY_A = 97,
    //KEY_D = 100,
    //KEY_W = 119,
    //KEY_S = 115,
    //KEY_R = 114,
    //KEY_F = 102,
    //KEY_X = 120,
    //KEY_Y = 121,
    //KEY_C = 99,
    //KEY_SX = 88,
    //KEY_SY = 89,
    //KEY_SC = 67,
    //WIDTH = 1500,
    //HEIGHT = 900,
    //TWO_D_MODE = 0,
    //INDEX = 0,
    //NR_MUTILATE = 1,
    //DEFAULT_NODE_SIZE = 6,
    //MIN_X = MAX_X = MIN_Y = MAX_Y = MIN_Z =
    //MAX_Z = AVG_X = AVG_Y = AVG_Z = 0;

//var randomColors = [
  //0xc4d0db, 0xf6b68a, 0xffff33, 0x003fff,
  //0xec2337, 0x008744, 0xffa700, 0x1df726,
  //0x8fd621, 0x2d049b, 0x873bd3, 0x85835f
//];

//var axis_x = new THREE.Vector3( 1, 0, 0 ),
    //axis_y = new THREE.Vector3( 0, 1, 0 ),
    //axis_z = new THREE.Vector3( 0, 0, 1 ),
    //deltaDistance = 10, //distance to move
    //deltaRotation = 0.05, //rotation step
    //network = new THREE.Group(),
    //nodes_obj_idx = new Object(),
    //edges_obj_idx = new Object(),
    //raycaster = new THREE.Raycaster(),
    //mouse = new THREE.Vector2(),
    //camera  = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 0.1, 1000),
    //scene = new THREE.Scene(),
    //renderer = new THREE.WebGLRenderer({ antialias: false }),
    //particles = null;

//renderButton.onclick = function() {
  //initGraph();
  //window.$GV.renderGraph();
//}

//function renderGraph() {
  //MIN_X = MAX_X = nodes_obj[0].getFeature('coords').x,
  //MIN_Y = MAX_Y = nodes_obj[0].getFeature('coords').y,
  //MIN_Z = MAX_Z = nodes_obj[0].getFeature('coords').z,
  //AVG_X = AVG_Y = AVG_Z = 0;

  //for(node in nodes_obj) {
    //var x = nodes_obj[node].getFeature('coords').x;
    //var y = nodes_obj[node].getFeature('coords').y;
    //var z = nodes_obj[node].getFeature('coords').z;

    //MIN_X = Math.min(MIN_X, x);
    //MIN_Y = Math.min(MIN_Y, y);
    //MIN_Z = Math.min(MIN_Z, z);

    //MAX_X = Math.max(MAX_X, x);
    //MAX_Y = Math.max(MAX_Y, y);
    //MAX_Z = Math.max(MAX_Z, z);
  //}
  //AVG_X = (MAX_X - MIN_X) / 2;
  //AVG_Y = (MAX_Y - MIN_Y) / 2;
  //AVG_Z = (MAX_Z - MIN_Z) / 2;

  //renderer.setSize(WIDTH, HEIGHT); 
  //renderer.setClearColor(0x000000, 1);

  //var element = document.getElementById("containerGraph");
  //element.appendChild(renderer.domElement);

  //var i = 0;
  //var vertices = new Float32Array(graph.nrNodes() * 3);
  //var nodeColors = new Float32Array(graph.nrNodes() * 3);
  //var nodeColor = new THREE.Color(0x003fff);
  //for(node in nodes_obj) {
    //var x = nodes_obj[node].getFeature('coords').x;
    //var y = nodes_obj[node].getFeature('coords').y;
    //var z = nodes_obj[node].getFeature('coords').z;

    //vertices[i*3] = x - AVG_X;
    //vertices[i*3 + 1] = y - AVG_Y;
    //vertices[i*3 + 2] = z - AVG_Z;

    //// Trying to set original color
    //nodeColors[i*3] = nodes_obj[node].getFeature('color').r/256.0;
    //nodeColors[i*3 + 1] = nodes_obj[node].getFeature('color').g/256.0;
    //nodeColors[i*3 + 2] = nodes_obj[node].getFeature('color').b/256.0;

    //nodes_obj_idx[node]= i*3;
    //i++;
  //}

  //var geometry = new THREE.BufferGeometry();
  //geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
  //geometry.addAttribute('color', new THREE.BufferAttribute( nodeColors, 3));

  //var material = new THREE.PointsMaterial({
    //vertexColors: THREE.VertexColors,
    //size: DEFAULT_NODE_SIZE
  //});

  //particles = new THREE.Points(geometry, material);
  //network.add(particles);

  ////EDGE
  //var materialLine = new THREE.LineBasicMaterial({
    //transparent : true,
    //opacity: 0.5, //default is 1; range: 0.0 - 1.0
    //vertexColors: THREE.VertexColors
    ////linewidth: 1
  //});

  //[und_edges, dir_edges].forEach(function(edges) {
    //var i = 0;
    //var positionLine = new Float32Array(Object.keys(edges).length * 6); //2 vertices * 3 xyz
    //var lineColors = new Float32Array( positionLine.length);
    //var nodeColor = new THREE.Color(0x81cf28);
    //for (var edge_index in edges) {
      //var edge = edges[edge_index];
      //var node_a_id = edge._node_a.getID();
      //var node_b_id = edge._node_b.getID();

      //positionLine[i * 6] = nodes_obj[node_a_id].getFeature('coords').x - AVG_X;
      //positionLine[i * 6 + 1] = nodes_obj[node_a_id].getFeature('coords').y - AVG_Y;
      //positionLine[i * 6 + 2] = nodes_obj[node_a_id].getFeature('coords').z - AVG_Z;
      //positionLine[i * 6 + 3] = nodes_obj[node_b_id].getFeature('coords').x - AVG_X;
      //positionLine[i * 6 + 4] = nodes_obj[node_b_id].getFeature('coords').y - AVG_Y;
      //positionLine[i * 6 + 5] = nodes_obj[node_b_id].getFeature('coords').z - AVG_Z;

      //lineColors[i * 6] = nodes_obj[node_a_id].getFeature('color').r/256.0;
      //lineColors[i * 6 + 1] = nodes_obj[node_a_id].getFeature('color').g/256.0;
      //lineColors[i * 6 + 2] = nodes_obj[node_a_id].getFeature('color').b/256.0;
      //lineColors[i * 6 + 3] = nodes_obj[node_b_id].getFeature('color').r/256.0;
      //lineColors[i * 6 + 4] = nodes_obj[node_b_id].getFeature('color').g/256.0;
      //lineColors[i * 6 + 5] = nodes_obj[node_b_id].getFeature('color').b/256.0;

      //edges_obj_idx[edge_index] = i*6;
      //i++;
    //}

    //var geometryLine = new THREE.BufferGeometry();
    //geometryLine.addAttribute('position', new THREE.BufferAttribute(positionLine, 3));
    //geometryLine.addAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    //var line = new THREE.LineSegments(geometryLine, materialLine);
    //network.add(line);
  //});

  //scene.add(network);
  //camera.position.z = Math.max(MAX_X, MAX_Y);
  //window.requestAnimationFrame(updateGraph);
//}

//var updateGraph = function () {
  //// update the picking ray with the camera and mouse position
  //raycaster.setFromCamera( mouse, camera );
  //raycaster.params.Points.threshold = 15;
  //// calculate objects intersecting the picking ray
  ////TODO 
  //var test = new Array();
  //test.push(network.children[0]);
  //intersects = raycaster.intersectObjects(test); //network.children
  ////console.log(particles);
  //if ( intersects.length > 0 ) {
    //console.log("intersected objects");
    //console.log(intersects);
    //intersects[0].object.material.color.set( 0xe0f600 );
    //intersects[0].object.material.needsUpdate = true;
  //}
  
  
  ////for ( var i = 0; i < intersects.length; i++ ) {
    ////intersects[ i ].object.material.color.set( 0xff0000 );
  ////}
  
  
  ////var intersects = raycaster.intersectObjects( scene.children );

  ////if ( intersects.length > 0 ) {
    ////if ( INTERSECTED != intersects[0].object ) {
      ////if ( INTERSECTED ) { //INTERSECTED.material.program = programStroke;
         ////console.log("> 0");
      ////}
      ////INTERSECTED = intersects[ 0 ].object;
      //////INTERSECTED.material.program = programFill;
    ////}

  ////} else {
    ////if ( INTERSECTED ) { //INTERSECTED.material.program = programStroke; 
      ////console.log("< 0");
    ////}
    ////INTERSECTED = null;
  ////}
  
  //renderer.render(scene, camera); 
//};

//window.addEventListener('click', mousedown, false);
//function mousedown(event) {

  ////var raycaster = new THREE.Raycaster(); // create once
  ////var mouse = new THREE.Vector2();

  ////event.preventDefault();

  ////mouse.x = ( event.clientX / WIDTH ) * 2 - 1; //renderer.domElement.width
  ////mouse.y = - ( event.clientY / HEIGHT ) * 2 + 1; //renderer.domElement.height

  ////// update the picking ray with the camera and mouse position
  ////raycaster.setFromCamera( mouse, camera );
  ////// calculate objects intersecting the picking ray
  ////var intersects = raycaster.intersectObjects( network.children[0].geometry.getAttribute('position').array );
  ////for ( var i = 0; i < intersects.length; i++ ) {
    ////intersects[ i ].object.material.color.set( 0xff0000 );
  ////}
  //////console.log(nodes.children);
  ////updateGraph();
//}

//window.addEventListener('resize', windowResize, false);
//function windowResize() {
  //camera.aspect = WIDTH / HEIGHT;
  //camera.updateProjectionMatrix();
  //renderer.setSize(WIDTH, HEIGHT);
//}

//window.addEventListener('keypress', key, false);
//function key(event) {
  //switch (event.charCode) {
    //case KEY_W: //zoom in
      //camera.position.y = camera.position.y - deltaDistance; break;
      ////network.translateY(deltaDistance); break;
    //case KEY_S: //zoom out
      //camera.position.y = camera.position.y + deltaDistance; break;
      ////network.translateY(-deltaDistance); break;
    //case KEY_A: //move left
      //camera.position.x = camera.position.x + deltaDistance; break;
      ////network.translateX(-deltaDistance); break;
    //case KEY_D: //move right
      //camera.position.x = camera.position.x - deltaDistance; break;
      ////network.translateX(deltaDistance); break;
    //case KEY_R:
      //network.translateZ(deltaDistance); break;
    //case KEY_F:
      //network.translateZ(-deltaDistance); break;

    //case KEY_X:
      ////network.rotation.x += deltaRotation; break;
      //network.rotateOnAxis(axis_x, deltaRotation);
      //axis_y.applyAxisAngle(axis_x, -deltaRotation);
      //// axis_z.applyAxisAngle(axis_x, -deltaRotation);
      //break;
    //case KEY_SX:
      ////network.rotation.x -= deltaRotation; break;
      //network.rotateOnAxis(axis_x, -deltaRotation);
      //axis_y.applyAxisAngle(axis_x, deltaRotation);
      //// axis_z.applyAxisAngle(axis_x, deltaRotation);
      //break;
    //case KEY_Y:
      ////network.rotation.y += deltaRotation; break;
      //network.rotateOnAxis(axis_y, deltaRotation);
      //axis_x.applyAxisAngle(axis_y, -deltaRotation);
      //// axis_z.applyAxisAngle(axis_y, -deltaRotation);
      //break;
    //case KEY_SY:
      ////network.rotation.y -= deltaRotation; break;
      //network.rotateOnAxis(axis_y, -deltaRotation);
      //axis_x.applyAxisAngle(axis_y, deltaRotation);
      //// axis_z.applyAxisAngle(axis_y, deltaRotation);
      //break;
    //case KEY_C:
      ////network.rotation.z += deltaRotation; break;
      //network.rotateOnAxis(axis_z, deltaRotation);
      //axis_x.applyAxisAngle(axis_z, -deltaRotation);
      //axis_y.applyAxisAngle(axis_z, -deltaRotation);
      //break;
    //case KEY_SC:
      ////network.rotation.z -= deltaRotation; break;
      //network.rotateOnAxis(axis_z, -deltaRotation);
      //axis_x.applyAxisAngle(axis_z, deltaRotation);
      //axis_y.applyAxisAngle(axis_z, deltaRotation);
      //break;
    //default:
      //break;
  //}
  ////camera.updateProjectionMatrix();
  //window.requestAnimationFrame(updateGraph);
//}

////zoom in and out
//window.addEventListener('mousewheel', mousewheel, false);
//function mousewheel(event) {
  ////wheel down: negative value
  ////wheel up: positive value
  //if(event.shiftKey) {
    //if(event.wheelDelta < 0) {
      //network.rotateOnAxis(axis_y, -deltaRotation);
      //axis_x.applyAxisAngle(axis_y, deltaRotation);
      //// axis_z.applyAxisAngle(axis_y, deltaRotation);
    //}
    //else {
      //network.rotateOnAxis(axis_y, deltaRotation);
      //axis_x.applyAxisAngle(axis_y, -deltaRotation);
      //// axis_z.applyAxisAngle(axis_y, -deltaRotation);
    //}
  //}
  //else {
    //camera.fov -= ZOOM_FACTOR * event.wheelDeltaY;
    //camera.fov = Math.max( Math.min( camera.fov, MAX_FOV ), MIN_FOV );
    //camera.projectionMatrix = new THREE.Matrix4().makePerspective(camera.fov, WIDTH / HEIGHT, camera.near, camera.far);
  //}
  //window.requestAnimationFrame(updateGraph);
//}

//window.addEventListener( 'mousemove', mouseMove, false );
//function mouseMove(event) {

  //if(event.shiftKey && event.which == 1) {
    //if(event.movementX > 0) {
      //network.rotateOnAxis(axis_z, deltaRotation);
      //axis_x.applyAxisAngle(axis_z, -deltaRotation);
      //axis_y.applyAxisAngle(axis_z, -deltaRotation);
    //}
    //else if(event.movementX < 0) {
      //network.rotateOnAxis(axis_z, -deltaRotation);
      //axis_x.applyAxisAngle(axis_z, deltaRotation);
      //axis_y.applyAxisAngle(axis_z, deltaRotation);
    //}
    //else if(event.movementY > 0) {
      //network.rotateOnAxis(axis_x, deltaRotation);
      //axis_y.applyAxisAngle(axis_x, -deltaRotation);
      //// axis_z.applyAxisAngle(axis_x, -deltaRotation);
    //}
    //else if(event.movementY < 0) {
      //network.rotateOnAxis(axis_x, -deltaRotation);
      //axis_y.applyAxisAngle(axis_x, deltaRotation);
      //// axis_z.applyAxisAngle(axis_x, deltaRotation);
    //}
  //}
  ////left mouse button
  //else if(event.which == 1) {
    //var mouseX = event.clientX / WIDTH;
    //var mouseY = event.clientY / HEIGHT;
    ////movement in y: up is negative, down is positive
    //camera.position.x = camera.position.x - (mouseX * event.movementX);
    //camera.position.y = camera.position.y + (mouseY * event.movementY);
  //}
  
  ////raycaster
  //// calculate mouse position in normalized device coordinates
  //// (-1 to +1) for both components
  //event.preventDefault();
  //mouse.x = (event.clientX / WIDTH) * 2 - 1;
  //mouse.y = - (event.clientY / HEIGHT) * 2 + 1;
  
  //window.requestAnimationFrame(updateGraph);
//}

//function switchTo2D() {
  //TWO_D_MODE = true;
  //var array = network.children[0].geometry.attributes.position.array;
  //for(var i = 0; i < array.length;) {
    //array[i + 2] = 0;
    //i+=3;
  //}
  //network.children[0].geometry.attributes.position.needsUpdate = true;

  //array = network.children[1].geometry.attributes.position.array;
  //for(var i = 0; i < array.length;) {
    //array[i + 2] = 0;
    //i+=3;
  //}
  //network.children[1].geometry.attributes.position.needsUpdate = true;

  //array = network.children[2].geometry.attributes.position.array;
  //for(var i = 0; i < array.length;) {
    //array[i + 2] = 0;
    //i+=3;
  //}
  //network.children[2].geometry.attributes.position.needsUpdate = true;

  //window.renderer.render(window.scene, window.camera);
//}

//function switchTo3D() {
  //TWO_D_MODE = false;
  //var array = network.children[0].geometry.attributes.position.array;
  //var i = 0;
  //for(node in nodes_obj) {
    //var z = nodes_obj[node].getFeature('coords').z;
    //array[i + 2] = z;
    //i+=3;
  //}
  //network.children[0].geometry.attributes.position.needsUpdate = true;

  //array = network.children[1].geometry.attributes.position.array;
  //var i = 0;
  //for (var edge_index in und_edges) {
    //var edge = und_edges[edge_index];
    //var node_a_id = edge._node_a.getID();
    //var node_b_id = edge._node_b.getID();

    //array[i + 2] = nodes_obj[node_a_id].getFeature('coords').z;
    //array[i + 5] = nodes_obj[node_b_id].getFeature('coords').z;
    //i += 6;
  //}
  //network.children[1].geometry.attributes.position.needsUpdate = true;

  //i = 0;
  //array = network.children[2].geometry.attributes.position.array;
  //for (var edge_index in dir_edges) {
    //var edge = dir_edges[edge_index];
    //var node_a_id = edge._node_a.getID();
    //var node_b_id = edge._node_b.getID();

    //array[i + 2] = nodes_obj[node_a_id].getFeature('coords').z;
    //array[i + 5] = nodes_obj[node_b_id].getFeature('coords').z;
    //i += 6;
  //}
  //network.children[2].geometry.attributes.position.needsUpdate = true;
  //window.renderer.render(window.scene, window.camera);
//}

////add node to graph but without edges
//function addNode(new_node) {
  //var old_nodes = network.children[0].geometry.getAttribute('position').array;
  //var old_colors = network.children[0].geometry.getAttribute('color').array;
  //var new_nodes = new Float32Array(old_nodes.length + 3);
  //var new_colors = new Float32Array(new_nodes.length);
  //var new_color = new THREE.Color(0xff7373);

  //for(var i = 0; i < old_nodes.length; i++) {
    //new_nodes[i] = old_nodes[i];
    //new_colors[i] = old_colors[i];
  //}

  //new_nodes[new_nodes.length - 3] = new_node.getFeature('coords').x;
  //new_nodes[new_nodes.length - 2] = new_node.getFeature('coords').y;
  //new_nodes[new_nodes.length - 1] = new_node.getFeature('coords').z;
  //new_colors[new_nodes.length - 3] = new_color.r;
  //new_colors[new_nodes.length - 2] = new_color.g;
  //new_colors[new_nodes.length - 1] = new_color.b;

  //if(TWO_D_MODE) {
    //new_nodes[new_nodes.length - 1] = 0;
  //}

  ////index: last element of old_nodes array
  ////var new_element = {id: new_node.getID(), index: old_nodes.length};
  ////nodes_obj_idx.push(new_element);
  //nodes_obj_idx[new_node.getID()] = old_nodes.length;//Object.keys(nodes_obj_idx).length;

  //network.children[0].geometry.addAttribute('position', new THREE.BufferAttribute(new_nodes, 3));
  //network.children[0].geometry.addAttribute('color', new THREE.BufferAttribute(new_colors, 3));
  //network.children[0].geometry.attributes.position.needsUpdate = true;
  //network.children[0].geometry.attributes.color.needsUpdate = true;
  //window.renderer.render(window.scene, window.camera);
//}

////update node and edge position
//function updateNodePosition(update_node) {

  //var node_id = update_node.getID();
  //var index = nodes_obj_idx[node_id];

  ////update nodes
  //var old_nodes = network.children[0].geometry.getAttribute('position').array;
  //old_nodes[index] = update_node.getFeature('coords').x;
  //old_nodes[index + 1] = update_node.getFeature('coords').y;
  //old_nodes[index + 2] = update_node.getFeature('coords').z;

  //if(TWO_D_MODE) {
    //old_nodes[index + 2] = 0;
  //}
  //network.children[0].geometry.attributes.position.needsUpdate = true;

  ////update edges
  //var old_edges = network.children[1].geometry.getAttribute('position').array;
  //var und_edges = update_node.undEdges();
  //for(var i = 0; i < Object.keys(und_edges).length; i++) {
    //var edge = und_edges[Object.keys(update_node.undEdges())[i]];

    ////update from-node
    //var edge_index = edges_obj_idx[edge.getID()];
    //if(edge._node_a === update_node) {
      //old_edges[edge_index] = update_node.getFeature('coords').x;
      //old_edges[edge_index + 1] = update_node.getFeature('coords').y;
      //old_edges[edge_index + 2] = update_node.getFeature('coords').z;
    //}
    ////update to-node
    //else if(edge._node_b === update_node) {
      //old_edges[edge_index + 3] = update_node.getFeature('coords').x;
      //old_edges[edge_index + 4] = update_node.getFeature('coords').y;
      //old_edges[edge_index + 5] = update_node.getFeature('coords').z;
    //}
  //}
  //network.children[1].geometry.attributes.position.needsUpdate = true;
  ////TODO for directed and undirected edges
  ////network.children[2].geometry.attributes.position.needsUpdate = true;
  //window.renderer.render(window.scene, window.camera);
//}

////remove node and their edges
//function removeNode(remove_node) {
  ////remove node
  //console.log(remove_node);
  //var node_id = remove_node.getID();
  //var index = nodes_obj_idx[node_id];

  //var old_nodes = network.children[0].geometry.getAttribute('position').array;
  //old_nodes[index] = NaN;
  //old_nodes[index + 1] = NaN;
  //old_nodes[index + 2] = NaN;

  ////remove edge
  //var old_edges = network.children[1].geometry.getAttribute('position').array;
  //var und_edges = remove_node.undEdges();
  //for(var i = 0; i < Object.keys(und_edges).length; i++) {
    //var edge = und_edges[Object.keys(remove_node.undEdges())[i]];

    ////update from-node
    //var edge_index = edges_obj_idx[edge.getID()];
    //old_edges[edge_index] = NaN;
    //old_edges[edge_index + 1] = NaN;
    //old_edges[edge_index + 2] = NaN;
    //old_edges[edge_index + 3] = NaN;
    //old_edges[edge_index + 4] = NaN;
    //old_edges[edge_index + 5] = NaN;
  //}
  //network.children[0].geometry.attributes.position.needsUpdate = true;
  //network.children[1].geometry.attributes.position.needsUpdate = true;
  ////TODO for directed and undirected edges
  ////network.children[2].geometry.attributes.position.needsUpdate = true;
  //window.renderer.render(window.scene, window.camera);
//}

//function colorSingleNode(node, hexColor) {
  //var newColor = new THREE.Color(hexColor);
  //var nodeColors = network.children[0].geometry.getAttribute('color').array;

  //var node_id = remove_node.getID();
  //var index = nodes_obj_idx[node_id];
  //nodeColors[index] = newColor.r;
  //nodeColors[index + 1] = newColor.g;
  //nodeColors[index + 2] = newColor.b;
  //network.children[0].geometry.attributes.color.needsUpdate = true;

  //window.renderer.render(window.scene, window.camera);
//}

//function colorAllNodes(hexColor) {
  //if(hexColor == 0) {
    //var randomIndex = Math.floor((Math.random() * randomColors.length));
    //hexColor = randomColors[randomIndex];
  //}

  //var newColor = new THREE.Color(hexColor);
  //var nodeColors = network.children[0].geometry.getAttribute('color').array;

  //for(var i = 0; i < nodeColors.length;) {
    //nodeColors[i] = newColor.r;
    //nodeColors[i + 1] = newColor.g;
    //nodeColors[i + 2] = newColor.b;
    //i += 3;
  //}
  //network.children[0].geometry.attributes.color.needsUpdate = true;
  //window.renderer.render(window.scene, window.camera);
//}

//function addEdge(edge) {
  //var index = 1;
  //if(edge._directed) {
    //index = 2;
  //} 

  //var old_edges = network.children[index].geometry.getAttribute('position').array;
  //var old_colors = network.children[index].geometry.getAttribute('color').array;
  //var new_edges = new Float32Array(old_edges.length + 6); // 3 xyz-coordinate * 2 nodes
  //var new_colors = new Float32Array(old_colors.length + 6);
  //var new_color = new THREE.Color(0xff7373);
  //for(var i = 0; i < old_edges.length; i++) {
    //new_edges[i] = old_edges[i];
    //new_colors[i] = old_colors[i];
  //}
  
  //new_edges[new_edges.length - 6] = edge._node_a.getFeature('coords').x;
  //new_edges[new_edges.length - 5] = edge._node_a.getFeature('coords').y;
  //new_edges[new_edges.length - 4] = edge._node_a.getFeature('coords').z;
  //new_edges[new_edges.length - 3] = edge._node_b.getFeature('coords').x;
  //new_edges[new_edges.length - 2] = edge._node_b.getFeature('coords').y;
  //new_edges[new_edges.length - 1] = edge._node_b.getFeature('coords').z;

  //new_colors[new_colors.length - 6] = new_color.r;
  //new_colors[new_colors.length - 5] = new_color.g;
  //new_colors[new_colors.length - 4] = new_color.b;
  //new_colors[new_colors.length - 3] = new_color.r;
  //new_colors[new_colors.length - 2] = new_color.g;
  //new_colors[new_colors.length - 1] = new_color.b;
  
  ////network.children[index].geometry.removeAttribute ('position');
  //network.children[index].geometry.addAttribute('position', new THREE.BufferAttribute(new_edges, 3));
  //network.children[index].geometry.addAttribute('color', new THREE.BufferAttribute(new_colors, 3));
  //network.children[index].geometry.attributes.position.needsUpdate = true;
  //network.children[index].geometry.attributes.color.needsUpdate = true;
  //window.renderer.render(window.scene, window.camera);
//}

//function colorSingleEdge(edge, hexColor) {  
  //var new_color = new THREE.Color(hexColor);
  //var index = 1;
  //if(edge._directed) {
    //index = 2;
  //}
  //var edge_olors = network.children[index].geometry.getAttribute('color').array;
  //var edge_id = edge.getID();
  //var idx = edges_obj_idx[edge_id];
  
  //edge_olors[idx] = new_color.r;
  //edge_olors[idx + 1] = new_color.g;
  //edge_olors[idx + 2] = new_color.b;
  //edge_olors[idx + 3] = new_color.r;
  //edge_olors[idx + 4] = new_color.g;
  //edge_olors[idx + 5] = new_color.b;
    
  //network.children[index].geometry.attributes.color.needsUpdate = true;
  //window.renderer.render(window.scene, window.camera);
//}

//function colorAllEdges(hexColor) {
  //if(hexColor == 0) {
    //var randomIndex = Math.floor((Math.random() * randomColors.length));
    //hexColor = randomColors[randomIndex];
  //}

  //var newColor = new THREE.Color(hexColor);
  //var edgeColors1 = network.children[1].geometry.getAttribute('color').array;
  //var edgeColors2 = network.children[2].geometry.getAttribute('color').array;

  //for(var i = 0; i < edgeColors1.length;) {
    //edgeColors1[i] = newColor.r;
    //edgeColors1[i + 1] = newColor.g;
    //edgeColors1[i + 2] = newColor.b;
    //i += 3;
  //}
  //for(var i = 0; i < edgeColors2.length;) {
    //edgeColors2[i] = newColor.r;
    //edgeColors2[i + 1] = newColor.g;
    //edgeColors2[i + 2] = newColor.b;
    //i += 3;
  //}

  //network.children[1].geometry.attributes.color.needsUpdate = true;
  //network.children[2].geometry.attributes.color.needsUpdate = true;
  //window.renderer.render(window.scene, window.camera);
//}

//TODO
function mutilateGraph() {  
  var nodes_obj = window.graph.getNodes(),
      nodes_len = Object.keys(nodes_obj).length;
  
  //console.log(nodes_obj);
  for(id in nodes_obj) {
    requestAnimationFrame(function() {
      removeNode(nodes_obj[id]);
    });
    INDEX++; 
  }
  
  //requestAnimationFrame(mutilateGraph);
  // if(INDEX < nodes_len) {
  //   console.log(INDEX);
  //   removeNode(nodes_obj[INDEX]);
  //   INDEX++;
  // }
  // else {
  //   return;
  // }
  // requestAnimationFrame(mutilateGraph);

  //if(INDEX < nodes_len) {
    //var i = 0;
    //while (INDEX < nodes_len && i++ < NR_MUTILATE) {
      //removeNode(nodes_obj[INDEX++]);
    //}
  //}
  //else {
    //return;
  //}
  //requestAnimationFrame(mutilateGraph);
}

function setNrMutilate(nr_mutilate) {
  NR_MUTILATE = nr_mutilate;
}

//function addRandomNodes() {
  //var x_ = Math.floor((Math.random() * MAX_X) - AVG_X),
      //y_ = Math.floor((Math.random() * MAX_Y) - AVG_Y),
      //z_ = Math.floor((Math.random() * MAX_Z) - AVG_Z),
      //idx = Object.keys(nodes_obj_idx).length;
  //var new_node = graph.addNode(idx, {coords: {x: x_, y: y_, z:z_}});
  //addNode(new_node);
//}

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

//function updateRandomPostions() {
  //var node_obj = graph.getNodes();
  //var old_nodes = network.children[0].geometry.getAttribute('position').array;
  //var old_edges = network.children[1].geometry.getAttribute('position').array;
  //for(node in node_obj) {
    //var index = nodes_obj_idx[node];
    //node_obj[node].getFeature('coords').x = old_coordinates[index] + Math.random() * 20 - 10 - AVG_X;
    //node_obj[node].getFeature('coords').y = old_coordinates[index + 1] + Math.random() * 20 - 10 - AVG_Y;
    //node_obj[node].getFeature('coords').z = old_coordinates[index + 2] + Math.random() * 20 - 10 - AVG_Z;

    //old_nodes[index] = node_obj[node].getFeature('coords').x;
    //old_nodes[index + 1] = node_obj[node].getFeature('coords').y;
    //old_nodes[index + 2] = node_obj[node].getFeature('coords').z;
  //}

  //var und_edges = graph.getUndEdges();
  //var dir_edges = graph.getDirEdges();
  //[und_edges, dir_edges].forEach(function(edges) {
    //var i = 0;
    //for (var edge_index in edges) {
      //var edge = edges[edge_index];
      //var node_a_id = edge._node_a.getID();
      //var node_b_id = edge._node_b.getID();

      //old_edges[i] = node_obj[node_a_id].getFeature('coords').x;
      //old_edges[i + 1] = node_obj[node_a_id].getFeature('coords').y;
      //old_edges[i + 2] = node_obj[node_a_id].getFeature('coords').z;
      //old_edges[i + 3] = node_obj[node_b_id].getFeature('coords').x;
      //old_edges[i + 4] = node_obj[node_b_id].getFeature('coords').y;
      //old_edges[i + 5] = node_obj[node_b_id].getFeature('coords').z;
      //i += 6;
    //}
  //});

  //network.children[0].geometry.attributes.position.needsUpdate = true;
  //network.children[1].geometry.attributes.position.needsUpdate = true;
  //network.children[2].geometry.attributes.position.needsUpdate = true;
  //window.renderer.render(window.scene, window.camera);

  //if(window.cnt++ < 100) {
    //requestAnimationFrame(updateRandomPostions);
  //}
  //else {
    //var i = 0;
    //for(node in node_obj) {
      //var index = nodes_obj_idx[node];
      //node_obj[node].getFeature('coords').x = window.old_coordinates[i];
      //node_obj[node].getFeature('coords').y = window.old_coordinates[i + 1];
      //node_obj[node].getFeature('coords').z = window.old_coordinates[i + 2];
      //i += 3;

      //old_nodes[index] = node_obj[node].getFeature('coords').x - AVG_X;
      //old_nodes[index + 1] = node_obj[node].getFeature('coords').y - AVG_Y;
      //old_nodes[index + 2] = node_obj[node].getFeature('coords').z - AVG_Z;
    //}
    //[und_edges, dir_edges].forEach(function(edges) {
      //var i = 0;
      //for (var edge_index in edges) {
        //var edge = edges[edge_index];
        //var node_a_id = edge._node_a.getID();
        //var node_b_id = edge._node_b.getID();

        //old_edges[i] = node_obj[node_a_id].getFeature('coords').x - AVG_X;
        //old_edges[i + 1] = node_obj[node_a_id].getFeature('coords').y - AVG_Y;
        //old_edges[i + 2] = node_obj[node_a_id].getFeature('coords').z - AVG_Z;
        //old_edges[i + 3] = node_obj[node_b_id].getFeature('coords').x - AVG_X;
        //old_edges[i + 4] = node_obj[node_b_id].getFeature('coords').y - AVG_Y;
        //old_edges[i + 5] = node_obj[node_b_id].getFeature('coords').z - AVG_Z;
        //i += 6;
      //}
    //});
    //network.children[0].geometry.attributes.position.needsUpdate = true;
    //network.children[1].geometry.attributes.position.needsUpdate = true;
    //network.children[2].geometry.attributes.position.needsUpdate = true;
    //window.renderer.render(window.scene, window.camera);
  //}
//}

//if (window !== 'undefined') {
  //window.$GV = {
    //renderGraph: renderGraph,
    //addNode: addNode,
    //addEdge: addEdge,
    //removeNode: removeNode,
    //colorSingleNode: colorSingleNode,
    //colorAllNodes: colorAllNodes,
    //colorSingleEdge: colorSingleEdge,
    //colorAllEdges: colorAllEdges,
    //switchTo2D: switchTo2D,
    //switchTo3D: switchTo3D,
    //setNrMutilate: setNrMutilate
  //}
//}
