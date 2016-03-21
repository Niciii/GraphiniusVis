var keys = require("../core/init.js").keys;
var globals = require("../core/init.js").globals;
var selected_node = require("../core/init.js").globals.selected_node;
var camera = require("../core/render.js").camera;
var defaults = require("../core/init.js").defaults;
var update = require("../core/render.js").update;
var network = require("../core/render.js").network;
var container = require("../core/init.js").container;
var mouse = require("../core/init.js").globals.mouse;
var nodeIntersection = require("./interaction.js").nodeIntersection;
var INTERSECTED = require("./interaction.js").INTERSECTED;
var callbacks = require("../core/init.js").callbacks;

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
