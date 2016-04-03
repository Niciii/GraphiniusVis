var keys = require("../core/init.js").keys;
var globals = require("../core/init.js").globals;
var defaults = require("../core/init.js").defaults;
var update = require("../core/render.js").update;
var network = require("../core/init.js").globals.network;
var container = require("../core/init.js").container;
var mouse = require("../core/init.js").globals.mouse;
var nodeIntersection = require("./interaction.js").nodeIntersection;
var callbacks = require("../core/init.js").callbacks;

// for testing purposes
var intersect_cb1 = function(node) {
  document.querySelector("#nodeID").innerHTML = node._id;
};
callbacks.node_intersects.push(intersect_cb1);

//rotation
var axis_x = new THREE.Vector3( 1, 0, 0 ),
    axis_y = new THREE.Vector3( 0, 1, 0 ),
    axis_z = new THREE.Vector3( 0, 0, 1 );

window.addEventListener('keypress', key, false);
function key(event) {
  switch (event.charCode) {
    case keys.KEY_W: //zoom in
      globals.camera.position.y = globals.camera.position.y - defaults.delta_distance; break;
    case keys.KEY_S: //zoom out
      globals.camera.position.y = globals.camera.position.y + defaults.delta_distance; break;
    case keys.KEY_A: //move left
      globals.camera.position.x = globals.camera.position.x + defaults.delta_distance; break;
    case keys.KEY_D: //move right
      globals.camera.position.x = globals.camera.position.x - defaults.delta_distance; break;
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
var eventWheel = 'mousewheel';
if(typeof InstallTrigger !== 'undefined') {
  eventWheel = 'wheel';
}
window.addEventListener(eventWheel, mousewheel, false);
function mousewheel(event) {
  //wheel down: negative value; firefox positive
  //wheel up: positive value; firefox negative;  
  
  var delta = event.wheelDelta; //chromium, ...
  if(typeof InstallTrigger !== 'undefined') { //firefox
    delta = event.deltaY * defaults.firefox_wheel_factor; 
  }
  
  if(event.altKey) {
    if(delta < 0) {
      network.rotateOnAxis(axis_y, -defaults.delta_rotation);
      axis_x.applyAxisAngle(axis_y, defaults.delta_rotation);
    }
    else {
      network.rotateOnAxis(axis_y, defaults.delta_rotation);
      axis_x.applyAxisAngle(axis_y, -defaults.delta_rotation);
    }
  }
  else {
    globals.camera.fov -= defaults.ZOOM_FACTOR * delta;
    globals.camera.fov = Math.max( Math.min( globals.camera.fov, defaults.MAX_FOV ), defaults.MIN_FOV );
    globals.camera.projectionMatrix = new THREE.Matrix4().makePerspective(globals.camera.fov, container.WIDTH / container.HEIGHT, globals.camera.near, globals.camera.far);
  }
  window.requestAnimationFrame(update);
}

window.addEventListener('mousemove', mouseMove, false);
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

    if(globals.camera.position.x > max_x) {
      globals.camera.position.x = max_x;
    }
    else if(globals.camera.position.x < -max_x) {
      globals.camera.position.x = -max_x;
    }
    else if(globals.camera.position.y > max_y) {
      globals.camera.position.y = max_y;
    }
    else if(globals.camera.position.y < -max_y) {
      globals.camera.position.y = -max_y;
    }

    //movement in y: up is negative, down is positive
    globals.camera.position.x = globals.camera.position.x - (mouseX * event.movementX);
    globals.camera.position.y = globals.camera.position.y + (mouseY * event.movementY);
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
  if(globals.INTERSECTED.node != null) {
    globals.selected_node = globals.INTERSECTED.node;
    document.querySelector("#nodeInfo").style.visibility = 'visible';
    var ni = callbacks.node_intersects;
    for (var cb in ni) {
      if (typeof ni[cb] === 'function') {
        ni[cb](globals.INTERSECTED.node);
      }
    }
  }
}

module.exports = {
  mouse: mouse
};
